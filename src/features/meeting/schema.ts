import { z } from "zod";

export const meetingSchema = z.object({
  studentId: z.array(z.string().regex(/^\d+$/)),
  programId: z.number(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  notes: z.string().optional(),
});

export type MeetingType = z.infer<typeof meetingSchema>;

export const MeetingResponse = z.object({
  id: z.number(),
  studentId: z.number(),
  studentName: z.string(),
  programName: z.string(),
  type: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export type MeetingResponseType = z.infer<typeof MeetingResponse>;

export const MeetingsResponse = z.array(
  z.object({
    programName: z.string(),
    meetings: z.array(MeetingResponse),
  }),
);

export type GroupingMeeting = z.infer<typeof MeetingsResponse>;

export const MeetingsSchema = z.array(
  z.object({
    meetingDate: z.string(),
    count: z.string(),
    attendance: z.string(),
  }),
);

export const AttendanceSchema = z.object({
  teacherId: z.string(),
  meetingId: z.number(),
  checkInTime: z.coerce.date(),
  checkOutTime: z.coerce.date(),
  duration: z.number(),
});

export type AttendaceType = z.infer<typeof AttendanceSchema>;
