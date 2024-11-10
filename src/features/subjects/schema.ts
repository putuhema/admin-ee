import { z } from "zod";

export const pricingSchema = z.object({
  programId: z.number(),
  bookFee: z.string(),
  monthlyFee: z.string(),
  certificateFee: z.string(),
  medalFee: z.string(),
  trophyFee: z.string(),
});
