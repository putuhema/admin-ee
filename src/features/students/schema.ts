import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }).max(100),
  nickname: z
    .string()
    .min(1, { message: "Nickname cannot be empty" })
    .max(50, "Nickname is too long"),
  email: z.string().optional(),
  phoneNumber: z.string().max(20).optional(),
  dateOfBirth: z.coerce.date(),
  address: z.string(),
  additionalInfo: z.string().optional(),
  notes: z.string().optional(),
});

export const studentGuardianSchema = z.object({
  studentId: z.string(),
  name: z.string().min(1, { message: "Name cannot be empty" }).max(100),
  email: z.string().optional(),
  phoneNumber: z.string(),
  address: z.string(),
  occupation: z.string(),
  isPrimary: z.boolean().default(false),
  relationship: z.string(),
  notes: z.string().optional(),
});
