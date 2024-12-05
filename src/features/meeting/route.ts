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
  Program,
  Student,
  user,
} from "@/db/schema";

import { z } from "zod";
import { and, asc, between, eq, sql } from "drizzle-orm";
import { Variables } from "@/app/api/[[...route]]/route";
import { supabase } from "@/lib/supabase";

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

        const groupMeetingsByProgram = (
          meetings: Array<{
            programName: string;
            meetings: MeetingResponseType[];
          }>,
        ) => {
          const groupedObj = meetings.reduce(
            (acc, { programName, meetings: programMeetings }) => {
              const groupName =
                PROGRAM_MAPPING[
                  programName.toLowerCase() as keyof typeof PROGRAM_MAPPING
                ] || programName;
              acc[groupName] = acc[groupName] || [];
              acc[groupName].push(...programMeetings);
              return acc;
            },
            {} as Record<string, MeetingResponseType[]>,
          );

          return Object.entries(groupedObj).map(([programName, meetings]) => ({
            programName,
            meetings,
          }));
        };
        const groupMeetings = groupMeetingsByProgram(parsedMeetings);

        return c.json(groupMeetings);
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
    async (c) => {
      const { date } = c.req.valid("param");

      if (!date) {
        return c.json({ error: "Date is required" }, 400);
      }

      const meetings = await db
        .select({
          id: Meeting.id,
          studentId: Meeting.studentId,
          programId: Meeting.programId,
          studentName: Student.name,
          programName: Program.name,
          startTime: Meeting.startTime,
          endTime: Meeting.endTime,
          location: Meeting.location,
          status: Meeting.status,
          meetingSessionStatus: MeetingSession.status,
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
        .where(eq(sql`DATE(${Meeting.startTime})`, sql`DATE(${date})`))
        .orderBy(asc(Meeting.startTime));

      return c.json(meetings);
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
    async (c) => {
      const { programId, studentId } = c.req.valid("param");

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

        const actualMeetings = await tx
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
          .leftJoin(Student, eq(Meeting.studentId, Student.id))
          .where(
            and(eq(Meeting.programId, programId), eq(Student.id, studentId)),
          )
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
        attendanceRate: Math.round((attendance / count) * 100),
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
    zValidator("json", z.object({ meetingId: z.coerce.number() })),
    async (c) => {
      const logginUser = c.get("user");

      if (!logginUser) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { meetingId } = c.req.valid("json");
      const channel = supabase.channel("meeting-claimed");

      channel.subscribe((status) => {
        if (status !== "SUBSCRIBED") {
          return null;
        }

        channel.send({
          type: "broadcast",
          event: "meeting-claimed",
          payload: {},
        });
      });

      const claimedMeeting = await db
        .select()
        .from(Meeting)
        .where(eq(Meeting.id, meetingId))
        .limit(1);

      if (claimedMeeting.length === 0) {
        return c.json({ error: "Meeting not found" }, 404);
      }

      await db.insert(MeetingSession).values({
        meetingId: meetingId,
        tutorId: logginUser.id,
        checkInTime: new Date(),
        status: "inprogress",
        studentAttendance: true,
      });

      return c.json({ message: "Meeting claimed" });
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
export default app;
