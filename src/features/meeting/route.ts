import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  MeetingResponseType,
  meetingSchema,
  MeetingsResponse,
  MeetingsSchema,
} from "./schema";
import { db } from "@/db";
import { Meeting, MeetingInsert, Program, Student } from "@/db/schema";

import { z } from "zod";
import { asc, between, eq, sql } from "drizzle-orm";

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

const app = new Hono()
  .get("/", async (c) => {
    try {
      const sqlDate = sql`DATE(${Meeting.startTime})`;

      const meetings = await db
        .select({
          meetingDate: sqlDate,
          count: sql`COUNT(*)`,
        })
        .from(Meeting)
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
