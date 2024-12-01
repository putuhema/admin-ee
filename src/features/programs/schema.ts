import { z } from "zod";

export const programSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  extra: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        describe: z.string(),
      }),
    )
    .optional(),
});

export type Program = z.infer<typeof programSchema>;

export const extraFeeSchema = z.object({
  programId: z.number(),
  book: z.string().optional(),
  certificate: z.string().optional(),
  trophy: z.string().optional(),
  medal: z.string().optional(),
});

export type ExtraFee = z.infer<typeof extraFeeSchema>;

export const ProgramExtraResponse = z.object({
  type: z.string(),
  price: z.string(),
});

const ProgramExtraSchema = z.object({
  type: z.string(),
  price: z.coerce.number(),
});

export const ProgramResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  extra: z.array(ProgramExtraSchema),
});
