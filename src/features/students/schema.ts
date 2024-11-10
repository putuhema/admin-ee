import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }).max(100),
  nickname: z
    .string()
    .min(1, { message: "Nickname cannot be empty" })
    .max(50, "Nickname is too long"),
  email: z.string().optional(),
  phoneNumber: z.string().max(20).optional(),
  dateOfBirth: z.coerce.date().optional(),
  address: z.string().optional(),
  additionalInfo: z.string().optional(),
  notes: z.string().optional(),
});
