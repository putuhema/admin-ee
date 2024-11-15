import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { meetingSchema, MeetingsResponse } from "./schema";
import { db } from "@/db";
import { Meeting, MeetingInsert, Program, Student } from "@/db/schema";

import { z } from "zod";
import { between, eq, sql } from "drizzle-orm";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        date: z.string(),
      })
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
        return c.json(parsedMeetings);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return c.json(
            { error: "Invalid data structure", details: error.errors },
            500
          );
        }
        throw error;
      }
    }
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
        } as MeetingInsert)
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
    }
  );
export default app;
