import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  AttendanceSchema,
  MeetingResponseType,
  meetingSchema,
  MeetingsResponse,
  MeetingsSchema,
} from "./schema";
import { db } from "@/db";
import {
  Enrollment,
  Meeting,
  MeetingInsert,
  MeetingPackage,
  MeetingSession,
  MeetingSessionInsert,
  MeetingType,
  Program,
  Student,
  user,
} from "@/db/schema";

import { custom, z } from "zod";
import { and, asc, between, eq, inArray, SQL, sql } from "drizzle-orm";
import { Variables } from "@/app/api/[[...route]]/route";
import { supabase } from "@/lib/supabase";
import { pusherServer } from "@/lib/pusher";
import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";

const PROGRAM_MAPPING = {
  abama: "Abama/Calistung",
  calistung: "Abama/Calistung",
  "english basic": "English",
  "english elementary": "English",
  "english ski&efc": "English",
  lkom: "Komputer",
  prisma: "Prisma",
  mathe: "Mathe/Cermat",
  cermat: "Mathe/Cermat",
  private: "Private",
} as const;

interface GroupedMeeting {}

const app = new Hono<Variables>()
  .get("/", async (c) => {
    try {
      const sqlDate = sql`DATE(${Meeting.startTime})`;

      const meetings = await db
        .select({
          meetingDate: sqlDate,
          count: sql`COUNT(*)`,
          attendance: sql`COUNT(CASE WHEN ${MeetingSession.studentAttendance} = true THEN 1 END)`,
        })
        .from(Meeting)
        .leftJoin(MeetingSession, eq(MeetingSession.meetingId, Meeting.id))
        .groupBy(sqlDate)
        .orderBy(sql`DATE(${Meeting.startTime}) DESC`);

      const meetingsParse = MeetingsSchema.parse(meetings);

      return c.json(meetingsParse, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          { error: "Invalid data structure", details: error.errors },
          500,
        );
      }
      return c.json({ error: "Failed to get Meetings" }, 500);
    }
  })
  .get(
    "/schedule",
    zValidator(
      "query",
      z.object({
        date: z.string(),
      }),
    ),
    async (c) => {
      try {
        const { date } = c.req.valid("query");
        const today = new Date(date);
        today.setHours(0, 0, 0, 0);
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);

        const meetings = await db
          .select({
            programName: Program.name,
            meetings: sql`json_agg(
            json_build_object(
              'id', ${Meeting.id},
              'studentName', ${Student.name},
              'studentNickname', ${Student.nickname},
              'programName', ${Program.name},
              'startTime', ${Meeting.startTime},
              'endTime', ${Meeting.endTime},
              'studentId', ${Meeting.studentId},
              'type', ${Meeting.type}
            )
            ORDER BY ${Meeting.startTime} ASC
          )`,
          })
          .from(Meeting)
          .leftJoin(Student, eq(Student.id, Meeting.studentId))
          .leftJoin(Program, eq(Program.id, Meeting.programId))
          .where(between(Meeting.startTime, today, endOfToday))
          .groupBy(Program.name);

        const parsedMeetings = MeetingsResponse.parse(meetings);

        const groupedSchedule =
          groupMeetingsByProgramAndTimeSlot(parsedMeetings);

        return c.json(groupedSchedule);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return c.json(
            { error: "Invalid data structure", details: error.errors },
            500,
          );
        }
        throw error;
      }
    },
  )
  .get(
    "/date/:date",
    zValidator("param", z.object({ date: z.string() })),
    zValidator("query", z.object({ type: z.string().default("all") })),
    async (c) => {
      const logginUser = c.get("user");

      if (!logginUser) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const { date } = c.req.valid("param");
      const { type } = c.req.valid("query");

      if (!date) {
        return c.json({ error: "Date is required" }, 400);
      }

      const whereClause: SQL[] = [];

      whereClause.push(eq(sql`DATE(${Meeting.startTime})`, sql`DATE(${date})`));

      if (type === "loggin-user") {
        whereClause.push(eq(user.id, logginUser.id));
      }

      const meetings = await db
        .select({
          id: Meeting.id,
          studentId: Meeting.studentId,
          programId: Meeting.programId,
          studentName: Student.name,
          studentNickname: Student.nickname,
          programName: Program.name,
          startTime: Meeting.startTime,
          endTime: Meeting.endTime,
          location: Meeting.location,
          status: Meeting.status,
          meetingSessionStatus: MeetingSession.status,
          meetingSessionCheckIn: MeetingSession.checkInTime,
          meetingSessionCheckOut: MeetingSession.checkOutTime,
          type: Meeting.type,
          attendance: MeetingSession.studentAttendance,
          tutorId: MeetingSession.tutorId,
          tutorName: user.name,
        })
        .from(Meeting)
        .leftJoin(Student, eq(Student.id, Meeting.studentId))
        .leftJoin(Program, eq(Program.id, Meeting.programId))
        .leftJoin(MeetingSession, eq(MeetingSession.meetingId, Meeting.id))
        .leftJoin(user, eq(user.id, MeetingSession.tutorId))
        .where(and(...whereClause))
        .orderBy(asc(Meeting.status));

      const groupedMeetings = meetings.reduce<
        {
          studentName: string;
          studentNickname: string;
          programGroups: {
            programName: string;
            startTime: Date;
            endTime: Date;
            checkOutTime: Date;
            checkInTime: Date;
            status: string;
            details: typeof meetings;
          }[];
        }[]
      >((acc, meeting) => {
        // Find existing student group or create a new one
        let studentGroup = acc.find(
          (group) => group.studentName === meeting.studentName,
        );

        if (!studentGroup) {
          // Create new student group if not exists
          studentGroup = {
            studentName: meeting.studentName!,
            studentNickname: meeting.studentNickname!,
            programGroups: [
              {
                programName: meeting.programName!,
                startTime: meeting.startTime,
                endTime: meeting.endTime,
                status: meeting.meetingSessionStatus!,
                checkOutTime: meeting.meetingSessionCheckOut!,
                checkInTime: meeting.meetingSessionCheckIn!,
                details: [meeting],
              },
            ],
          };
          acc.push(studentGroup);
        } else {
          // Find or create program group within student group
          let programGroup = studentGroup.programGroups.find(
            (pg) => pg.programName === meeting.programName,
          );

          if (!programGroup) {
            // Create new program group for this student
            programGroup = {
              programName: meeting.programName!,
              startTime: meeting.startTime!,
              endTime: meeting.endTime,
              status: meeting.meetingSessionStatus!,
              checkOutTime: meeting.meetingSessionCheckOut!,
              checkInTime: meeting.meetingSessionCheckIn!,
              details: [meeting],
            };
            studentGroup.programGroups.push(programGroup);
          } else {
            // Update start and end times for existing program group
            programGroup.startTime = new Date(
              Math.min(
                new Date(programGroup.startTime).getTime(),
                new Date(meeting.startTime).getTime(),
              ),
            );
            programGroup.endTime = new Date(
              Math.max(
                new Date(programGroup.endTime).getTime(),
                new Date(meeting.endTime).getTime(),
              ),
            );
            programGroup.details.push(meeting);
          }
        }

        return acc;
      }, []);

      return c.json(groupedMeetings);
    },
  )
  .get(
    "/programs/:programId/students/:studentId",
    zValidator(
      "param",
      z.object({
        programId: z.coerce.number().int().positive(),
        studentId: z.coerce.number().int().positive(),
      }),
    ),
    zValidator(
      "query",
      z.object({
        month: z.coerce.number().int().min(1).max(12).optional(),
        year: z.coerce.number().int().min(2021).optional(),
      }),
    ),
    async (c) => {
      const { programId, studentId } = c.req.valid("param");
      const { month, year } = c.req.valid("query");

      const meetings = await db.transaction(async (tx) => {
        const enrollmentDetails = await tx
          .select({
            count: MeetingPackage.count,
          })
          .from(Enrollment)
          .leftJoin(
            MeetingPackage,
            eq(MeetingPackage.id, Enrollment.meetingPackageId),
          )
          .where(
            and(
              eq(Enrollment.programId, programId),
              eq(Enrollment.studentId, studentId),
            ),
          )
          .limit(1)
          .execute();

        if (!enrollmentDetails.length) {
          return [];
        }

        const packageCount = enrollmentDetails[0].count ?? 0;
        const whereClause: SQL[] = [];

        let meetingQuery = tx
          .select({
            tutorId: user.id,
            tutorName: user.name,
            startTime: MeetingSession.checkInTime,
            endTime: MeetingSession.checkOutTime,
            attendance: MeetingSession.studentAttendance,
          })
          .from(Meeting)
          .leftJoin(MeetingSession, eq(Meeting.id, MeetingSession.meetingId))
          .leftJoin(user, eq(MeetingSession.tutorId, user.id))
          .leftJoin(Student, eq(Meeting.studentId, Student.id));

        whereClause.push(
          eq(Meeting.programId, programId),
          eq(Student.id, studentId),
        );

        if (month !== undefined) {
          whereClause.push(
            sql`extract(month from ${MeetingSession.checkInTime}) = ${month}`,
          );
        }

        if (year !== undefined) {
          whereClause.push(
            sql`extract(year from ${MeetingSession.checkInTime}) = ${year}`,
          );
        }

        const actualMeetings = await meetingQuery
          .where(and(...whereClause))
          .orderBy(asc(MeetingSession.checkInTime))
          .execute();

        return Array.from(
          { length: packageCount },
          (_, index) =>
            actualMeetings[index] ?? {
              tutorId: null,
              tutorName: null,
              startTime: null,
              endTime: null,
              attendance: null,
            },
        );
      });

      const count = meetings.length;
      const attendance = meetings.filter(
        (meeting) => meeting.attendance,
      ).length;

      return c.json({
        count,
        attendance,
        meetings,
        attendanceRate: count > 0 ? Math.round((attendance / count) * 100) : 0,
      });
    },
  )
  .get(
    "/:meetingId",
    zValidator("param", z.object({ meetingId: z.coerce.number() })),
    async (c) => {
      const { meetingId } = c.req.valid("param");

      const meeting = await db
        .select()
        .from(Meeting)
        .where(eq(Meeting.id, meetingId))
        .limit(1);

      if (meeting.length === 0) {
        return c.json({ error: "Meeting not found" }, 404);
      }

      return c.json(meeting[0]);
    },
  )
  .post("/", zValidator("json", meetingSchema), async (c) => {
    const validatedMeeting = c.req.valid("json");

    const meetings = validatedMeeting.studentId.map(
      (id) =>
        ({
          programId: validatedMeeting.programId,
          studentId: Number(id),
          startTime: validatedMeeting.startTime,
          endTime: validatedMeeting.endTime,
          location: "Tommo",
          status: "scheduled",
          type: "scheduled",
          notes: validatedMeeting.notes,
        }) as MeetingInsert,
    );

    const [meeting] = await db.insert(Meeting).values(meetings).returning();

    return c.json(meeting, 201);
  })
  .post("/session", zValidator("json", AttendanceSchema), async (c) => {
    const validatedSession = c.req.valid("json");

    const values: MeetingSessionInsert = {
      meetingId: validatedSession.meetingId,
      tutorId: validatedSession.teacherId,
      studentAttendance: true,
      status: "completed",
      checkInTime: validatedSession.checkInTime,
      checkOutTime: validatedSession.checkOutTime,
      duration: validatedSession.duration,
    };

    const meetingSessions = await db
      .insert(MeetingSession)
      .values(values)
      .onConflictDoUpdate({
        target: [MeetingSession.meetingId],
        set: values,
      })
      .returning();

    return c.json(meetingSessions, 201);
  })
  .post(
    "/claim-session",
    zValidator(
      "json",
      z.object({
        ids: z.array(z.number()),
        session: z.number(),
      }),
    ),
    async (c) => {
      const logginUser = c.get("user");

      if (!logginUser) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { ids, session } = c.req.valid("json");

      await db.transaction(async (tx) => {
        const claimedMeeting = await tx
          .select()
          .from(Meeting)
          .where(inArray(Meeting.id, ids));

        if (claimedMeeting.length === 0) {
          return c.json({ error: "Meeting not found" }, 404);
        }

        const currentMeeting = claimedMeeting[claimedMeeting.length - 1];

        let newMeeting: MeetingType[] = [];
        if (claimedMeeting.length !== session) {
          newMeeting = await tx
            .insert(Meeting)
            .values({
              programId: currentMeeting.programId,
              status: "inprogress",
              startTime: currentMeeting.endTime,
              endTime: new Date(
                currentMeeting.endTime.getTime() + 60 * 60 * 1000,
              ),
              studentId: currentMeeting.studentId,
              type: "scheduled",
            })
            .returning();
        }

        const meetingIds =
          newMeeting.length > 0 ? [...ids, newMeeting[0].id] : ids;
        const meetings = await tx
          .select()
          .from(Meeting)
          .where(inArray(Meeting.id, meetingIds));
        const currentDate = new Date();
        const duration = meetings.length;

        await tx.insert(MeetingSession).values(
          meetings.map((meeting) => ({
            duration: 1,
            meetingId: meeting.id,
            tutorId: logginUser.id,
            checkInTime: currentDate,
            checkOutTime: new Date(
              currentDate.getTime() + 60 * 60 * 1000 * duration,
            ),
            status: "inprogress" as MeetingSessionInsert["status"],
            studentAttendance: true,
          })),
        );
      });

      pusherServer.trigger("meeting", "claimed-meeting", {
        data: {
          message: "new Message",
        },
      });

      return c.json({ message: "Meeting claimed" });
    },
  )
  .patch(
    "/meeting-session/completed",
    zValidator(
      "json",
      z.object({
        meetingIds: z.array(z.number()),
      }),
    ),
    async (c) => {
      const { meetingIds } = c.req.valid("json");

      await db.transaction(async (tx) => {
        await tx
          .update(MeetingSession)
          .set({
            status: "completed",
          })
          .where(inArray(MeetingSession.meetingId, meetingIds));

        await tx
          .update(Meeting)
          .set({
            status: "completed",
          })
          .where(inArray(Meeting.id, meetingIds));
      });

      return c.json({ message: "successfully update meeting" }, 200);
    },
  )
  .delete(
    "/",
    zValidator("json", z.object({ id: z.coerce.number() })),
    async (c) => {
      const { id } = c.req.valid("json");

      await db.delete(Meeting).where(eq(Meeting.id, id));

      return c.json({ message: "Meeting deleted" });
    },
  );

const formatTimeSlot = (startTime: Date | string, endTime: Date | string) => {
  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const end = endTime instanceof Date ? endTime : new Date(endTime);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  return `${formatTime(start)}-${formatTime(end)}`;
};

const groupMeetingsByProgramAndTimeSlot = (
  meetings: Array<{
    programName: string;
    meetings: MeetingResponseType[];
  }>,
) => {
  const programGroups: Record<string, MeetingResponseType[]> = {};

  meetings.forEach(({ programName, meetings: programMeetings }) => {
    const mappedProgramName =
      PROGRAM_MAPPING[
        programName.toLowerCase() as keyof typeof PROGRAM_MAPPING
      ] || programName;

    if (!programGroups[mappedProgramName]) {
      programGroups[mappedProgramName] = [];
    }

    programGroups[mappedProgramName].push(...programMeetings);
  });

  return Object.entries(programGroups).map(([programName, meetings]) => {
    const timeSlotGroups = meetings.reduce(
      (acc, meeting) => {
        const timeSlotKey = formatTimeSlot(meeting.startTime, meeting.endTime);

        if (!acc[timeSlotKey]) {
          acc[timeSlotKey] = [];
        }

        acc[timeSlotKey].push(meeting);
        return acc;
      },
      {} as Record<string, MeetingResponseType[]>,
    );

    const sortedTimeSlots = Object.entries(timeSlotGroups)
      .map(([timeSlot, timeslotMeetings]) => ({
        timeSlot,
        meetings: timeslotMeetings,
      }))
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

    return {
      programName,
      timeSlots: sortedTimeSlots,
    };
  });
};

export default app;
