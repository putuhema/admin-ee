import { db } from "@/db";
import { SubjectPricing, Subject } from "@/db/schema";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { pricingSchema } from "./schema";

import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const subjects = await db
      .select({
        id: Subject.id,
        name: Subject.name,
      })
      .from(Subject);

    return c.json(subjects);
  })
  .get("/pricing", async (c) => {
    const pricings = await db
      .select({
        subjectName: Subject.name,
        fee: {
          book: SubjectPricing.bookFee,
          monthly: SubjectPricing.monthlyFee,
          certificate: SubjectPricing.certificateFee,
          medal: SubjectPricing.medalFee,
          trophy: SubjectPricing.trophyFee,
        },
      })
      .from(SubjectPricing)
      .leftJoin(Subject, eq(SubjectPricing.subjectId, Subject.id))
      .orderBy(Subject.name);

    return c.json(pricings);
  })
  .get(
    "/pricing/:subjectId",
    zValidator(
      "param",
      z.object({
        subjectId: z.string(),
      })
    ),
    async (c) => {
      const { subjectId } = c.req.valid("param");

      const [pricings] = await db
        .select({
          subjectName: Subject.name,
          fee: {
            book: SubjectPricing.bookFee,
            monthly: SubjectPricing.monthlyFee,
            certificate: SubjectPricing.certificateFee,
            medal: SubjectPricing.medalFee,
            trophy: SubjectPricing.trophyFee,
          },
        })
        .from(SubjectPricing)
        .leftJoin(Subject, eq(SubjectPricing.subjectId, Subject.id))
        .where(eq(Subject.id, parseInt(subjectId)));

      return c.json(pricings);
    }
  )
  .put("/subject-pricing", zValidator("json", pricingSchema), async (c) => {
    const validatedData = c.req.valid("json");

    const feeData = {
      subjectId: validatedData.subjectId,
      bookFee: Number(validatedData.bookFee),
      monthlyFee: Number(validatedData.monthlyFee),
      certificateFee: Number(validatedData.certificateFee),
      medalFee: Number(validatedData.medalFee),
      trophyFee: Number(validatedData.trophyFee),
    };

    const [data] = await db
      .insert(SubjectPricing)
      .values(feeData)
      .onConflictDoUpdate({
        target: SubjectPricing.subjectId,
        set: feeData,
      })
      .returning();

    return c.json(data);
  });
export default app;
