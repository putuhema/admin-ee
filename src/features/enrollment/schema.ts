import { z } from "zod";

export const enrollmentSchema = z.object({
  studentId: z.string(),
  subjectId: z.string(),
  enrollmentDate: z.coerce.date(),
  package: z.number(),
  packageTaken: z.number(),
  paymentType: z.string(),
  notes: z.string().optional(),
});

export type EnrollmentType = z.infer<typeof enrollmentSchema>;
