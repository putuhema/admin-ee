import { z } from "zod";

export const paymentSchema = z.object({
  date: z.date(),
  studentId: z.string(),
  subjectId: z.string(),
  type: z.string(),
  amount: z.number(),
  level: z.string().optional(),
  packet: z.number().optional(),
  quantity: z.number().optional(),
});

export type PaymentForm = z.infer<typeof paymentSchema>;

export const studentSchema = z.object({
  name: z.string(),
  nickname: z.string(),
  subjectId: z.number(),
  dateOfBirth: z.coerce.date().optional(),
  joinDate: z.coerce.date().optional(),
});
