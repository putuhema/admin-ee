import { z } from "zod";

export const bookPreparationsSchema = z.object({
  programId: z.number(),
  studentId: z.string(),
  notes: z
    .string()
    .min(3, {
      message: "Catatan minimal 3 karakter.",
    })
    .max(50, {
      message: "Catatan tidak lebih dari 50 karakter.",
    }),
});

export type BookPreparationData = z.infer<typeof bookPreparationsSchema>;
