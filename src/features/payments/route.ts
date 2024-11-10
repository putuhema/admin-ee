import { db } from "@/db";
import { Enrollment, Student, Subject } from "@/db/schema";
import { Hono } from "hono";
import { eq, and } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { paymentSchema } from "@/lib/zod-schema";

const app = new Hono().post(
  "/",
  zValidator("json", paymentSchema),
  async (c) => {
    const validatedData = c.req.valid("json");

    const studentEnrollment = await db
      .select()
      .from(Enrollment)
      .where(
        and(
          eq(Enrollment.studentId, parseInt(validatedData.studentId)),
          eq(Enrollment.subjectId, parseInt(validatedData.subjectId)),
        ),
      )
      .limit(1);

    if (studentEnrollment.length === 0) {
      return c.json({ error: "Student is not enrolled in the subject" }, 400);
    }
  },
);

export default app;
