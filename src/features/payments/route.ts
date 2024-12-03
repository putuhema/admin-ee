import { db } from "@/db";
import { Enrollment, Order, Payment } from "@/db/schema";
import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { paymentSchema } from "@/lib/zod-schema";
import { z } from "zod";

const app = new Hono()
  .post("/", zValidator("json", paymentSchema), async (c) => {
    const validatedData = c.req.valid("json");

    const studentEnrollment = await db
      .select()
      .from(Enrollment)
      .where(and(eq(Enrollment.studentId, parseInt(validatedData.studentId))))
      .limit(1);

    if (studentEnrollment.length === 0) {
      return c.json({ error: "Student is not enrolled in the subject" }, 400);
    }
  })
  .put(
    "/enrollment",
    zValidator(
      "json",
      z.object({
        orderId: z.number(),
        paymentDate: z.coerce.date(),
      }),
    ),
    async (c) => {
      try {
        const { paymentDate, orderId } = c.req.valid("json");

        const payment = await db.transaction(async (tx) => {
          const selectedPayment = await tx
            .select()
            .from(Payment)
            .where(eq(Payment.orderId, orderId))
            .limit(1);

          if (selectedPayment.length === 0) {
            return c.json({ error: "Payment not found" }, 404);
          }

          const payment = await tx
            .update(Payment)
            .set({ paymentDate, status: "completed", paymentMethod: "cash" })
            .where(eq(Payment.orderId, orderId))
            .returning();
          if (payment.length === 0) {
            return c.json({ error: "Failed to update payment" }, 500);
          }

          await tx
            .update(Order)
            .set({ status: "completed" })
            .where(eq(Order.id, orderId));

          return payment;
        });

        return c.json(payment);
      } catch (error) {
        return c.json({ error: error }, 500);
      }
    },
  );
export default app;
