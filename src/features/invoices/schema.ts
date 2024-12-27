import { z } from "zod";

export const invoiceSchema = z.object({
  programId: z.string(),
  studentId: z.string(),
  packageId: z.string(),
  quantity: z.coerce.number(),
  date: z.coerce.date(),
  notes: z.string(),
});

export type InvoiceData = z.infer<typeof invoiceSchema>;
