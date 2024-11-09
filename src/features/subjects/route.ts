import { db } from "@/db";
import { Pricing, PricingType, Subject } from "@/db/schema";
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
          book: Pricing.bookPrice,
          monthly: Pricing.monthlyFee,
          certificate: Pricing.certificateFee,
          medal: Pricing.medalFee,
          trophy: Pricing.trophyFee,
          aditional: Pricing.additionalCost,
        },
      })
      .from(Pricing)
      .leftJoin(Subject, eq(Pricing.subjectId, Subject.id))
      .orderBy(Subject.name);

    return c.json(pricings);
  })
  .get(
    "/pricing/:subjectId",
    zValidator(
      "param",
      z.object({
        subjectId: z.string(),
      }),
    ),
    async (c) => {
      const { subjectId } = c.req.valid("param");

      const [pricings] = await db
        .select({
          subjectName: Subject.name,
          fee: {
            book: Pricing.bookPrice,
            monthly: Pricing.monthlyFee,
            certificate: Pricing.certificateFee,
            medal: Pricing.medalFee,
            trophy: Pricing.trophyFee,
            aditional: Pricing.additionalCost,
          },
        })
        .from(Pricing)
        .leftJoin(Subject, eq(Pricing.subjectId, Subject.id))
        .where(eq(Subject.id, parseInt(subjectId)));

      return c.json(pricings);
    },
  )
  .post("/pricing", zValidator("json", pricingSchema), async (c) => {
    const validatedData = c.req.valid("json");

    const data = await db.transaction(async (tx) => {
      let pricing: PricingType;

      const isPricingExist = await tx
        .select()
        .from(Pricing)
        .where(eq(Pricing.subjectId, validatedData.subjectId))
        .limit(1);

      if (isPricingExist.length > 0) {
        await tx
          .update(Pricing)
          .set({
            subjectId: validatedData.subjectId,
            bookPrice: parseInt(validatedData.bookPrice),
            monthlyFee: parseInt(validatedData.monthlyFee),
            certificateFee: parseInt(validatedData.certificateFee),
            medalFee: parseInt(validatedData.medalFee),
            trophyFee: parseInt(validatedData.trophyFee),
            additionalCost: parseInt(validatedData.additionalCost),
          })
          .where(eq(Pricing.subjectId, validatedData.subjectId));

        [pricing] = await tx
          .select()
          .from(Pricing)
          .where(eq(Pricing.subjectId, validatedData.subjectId))
          .limit(1);
      } else {
        [pricing] = await tx
          .insert(Pricing)
          .values({
            subjectId: validatedData.subjectId,
            bookPrice: parseInt(validatedData.bookPrice),
            monthlyFee: parseInt(validatedData.monthlyFee),
            certificateFee: parseInt(validatedData.certificateFee),
            medalFee: parseInt(validatedData.medalFee),
            trophyFee: parseInt(validatedData.trophyFee),
            additionalCost: parseInt(validatedData.additionalCost),
          })
          .returning();
      }

      return pricing;
    });

    return c.json(data);
  });
export default app;
