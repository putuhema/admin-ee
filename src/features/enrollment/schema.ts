import { z } from "zod";

export const enrollmentSchema = z.object({
  studentId: z.string(),
  programId: z.string(),
  quantity: z.coerce.number(),
  enrollmentDate: z.coerce.date(),
  extras: z.array(z.string()),
  products: z.array(z.string()),
  packages: z.string(),
  notes: z.string().optional(),
});

export type EnrollmentType = z.infer<typeof enrollmentSchema>;
