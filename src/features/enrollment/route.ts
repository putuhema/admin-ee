import { db } from "@/db";
import { Enrollment, Program, Student } from "@/db/schema";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { enrollmentSchema } from "./schema";

const app = new Hono()
  .get("/", async (c) => {
    const enrollments = await db
      .select({
        enrollment: {
          id: Enrollment.id,
          enrollmentDate: Enrollment.enrollmentDate,
          status: Enrollment.status,
          enrollmentFee: Enrollment.enrollmentFee,
        },
        student: {
          id: Student.id,
          name: Student.name,
          nickname: Student.nickname,
          dateOfBirth: Student.dateOfBirth,
        },
        Program: {
          id: Program.id,
          name: Program.name,
        },
      })
      .from(Enrollment)
      .leftJoin(Student, eq(Enrollment.studentId, Student.id))
      .leftJoin(Program, eq(Enrollment.programId, Program.id))
      .orderBy(Student.name);

    return c.json(enrollments);
  })
  .post("/", zValidator("json", enrollmentSchema), async (c) => {
    /*     const validateData = c.req.valid("json");

    return await db.transaction(async (tx) => {

      try {
        const [program] = await tx
          .select()
          .from(Program)
          .where(eq(Program.id, Number(validateData.programId)))
          .limit(1);

        if (!program) {
          return c.json({ message: "Program not found" }, 404);
        }

        const [programPricing] = await tx
          .select()
          .from(ProgramPricing)
          .where(eq(ProgramPricing.programId, Program.id))
          .limit(1);

        if (!ProgramPricing) {
          return c.json({ message: "Program pricing not found" }, 404);
        }

        type PaymentType =
          | "Materi Pembelajaran"
          | "Layanan Berlangganan"
          | "Penghargaan"
          | "Pakaian";

        const feeMapping: Record<PaymentType, number | null> = {
          "Materi Pembelajaran": ProgramPricing.bookFee,
          "Layanan Berlangganan": ProgramPricing.monthlyFee,
          Penghargaan: ProgramPricing.certificateFee,
          Pakaian: 64000,
        };

        const enrollmentFee =
          feeMapping[validateData.paymentType as PaymentType];

        if (enrollmentFee === undefined) {
          return c.json({ message: "Invalid payment type" }, 400);
        }

        const [existingEnrollment] = await tx
          .select()
          .from(Enrollment)
          .where(
            and(
              eq(Enrollment.studentId, Number(validateData.studentId)),
              eq(Enrollment.programId, Program.id)
            )
          )
          .limit(1);

        let enrollment;
        if (!existingEnrollment) {
          [enrollment] = await tx
            .insert(Enrollment)
            .values({
              enrollmentFee,
              enrollmentDate: validateData.enrollmentDate,
              status: "active",
              studentId: Number(validateData.studentId),
              programId: Program.id,
              programPricingId: ProgramPricing.id,

            })
            .returning();
        } else {
          enrollment = existingEnrollment;
        }

        const [monthlyPackage] = await tx
          .select()
          .from(MonthlyPackage)
          .where(eq(MonthlyPackage.enrollmentId, enrollment.id))
          .limit(1);

        await tx.insert(EnrollmentItem).values({

          enrollmentId: enrollment.id,
          itemType: validateData.paymentType,
          ProgramPricingId: ProgramPricing.id,
          MonthlyPackageId: monthlyPackage.id,
        });

        return c.json(enrollment, 201);
      } catch (error) {
        console.error(error);
        return c.json(
          {
            message: "Failed to process enrollment",
          },
          500
        );
      }
    }); */
    return c.json({ message: "Not implemented" }, 501);
  });

export default app;
