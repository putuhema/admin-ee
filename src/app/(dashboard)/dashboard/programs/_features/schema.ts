import { z } from "zod";

export const programSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  pricePerMeeting: z.string(),
});

export type Program = z.infer<typeof programSchema>;
