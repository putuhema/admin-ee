import { db } from "@/db";
import { ProgramPrice, Program } from "@/db/schema";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { pricingSchema } from "./schema";

import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const programs = await db
      .select({
        id: Program.id,
        name: Program.name,
      })
      .from(Program);

    return c.json(programs);
  })
  .get("/pricing", async (c) => {
    const pricings = await db
      .select({
        ProgramName: Program.name,
        fee: {
          book: ProgramPrice.bookFee,
          monthly: ProgramPrice.monthlyFee,
          certificate: ProgramPrice.certificateFee,
          medal: ProgramPrice.medalFee,
          trophy: ProgramPrice.trophyFee,
        },
      })
      .from(ProgramPrice)
      .leftJoin(Program, eq(ProgramPrice.programId, Program.id))
      .orderBy(Program.name);

    return c.json(pricings);
  })
  .get(
    "/pricing/:programId",
    zValidator(
      "param",
      z.object({
        programId: z.string(),
      })
    ),
    async (c) => {
      const { programId } = c.req.valid("param");

      const [pricings] = await db
        .select({
          ProgramName: Program.name,
          fee: {
            book: ProgramPrice.bookFee,
            monthly: ProgramPrice.monthlyFee,
            certificate: ProgramPrice.certificateFee,
            medal: ProgramPrice.medalFee,
            trophy: ProgramPrice.trophyFee,
          },
        })
        .from(ProgramPrice)
        .leftJoin(Program, eq(ProgramPrice.programId, Program.id))
        .where(eq(Program.id, parseInt(programId)));

      return c.json(pricings);
    }
  )
  .put("/Program-pricing", zValidator("json", pricingSchema), async (c) => {
    const validatedData = c.req.valid("json");

    const feeData = {
      programId: validatedData.programId,
      bookFee: Number(validatedData.bookFee),
      monthlyFee: Number(validatedData.monthlyFee),
      certificateFee: Number(validatedData.certificateFee),
      medalFee: Number(validatedData.medalFee),
      trophyFee: Number(validatedData.trophyFee),
    };

    const [data] = await db
      .insert(ProgramPrice)
      .values(feeData)
      .onConflictDoUpdate({
        target: ProgramPrice.programId,
        set: feeData,
      })
      .returning();

    return c.json(data);
  });
export default app;
