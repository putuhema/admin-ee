import { z } from "zod";

export const meetingSchema = z.object({
  studentId: z.array(z.string().regex(/^\d+$/)),
  programId: z.number(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  notes: z.string().optional(),
});

export type MeetingType = z.infer<typeof meetingSchema>;

const meetingType = z.object({
  id: z.number(),
  studentId: z.number(),
  studentName: z.string(),
  type: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const MeetingsResponse = z.array(
  z.object({
    programName: z.string(),
    meetings: z.array(meetingType),
  })
);
