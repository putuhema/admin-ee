import { zValidator } from "@hono/zod-validator";
import { db } from "@/db";
import { Enrollment, EnrollmentSubjects, Student } from "@/db/schema";
import { Hono } from "hono";
import { studentSchema } from "@/lib/zod-schema";
import { eq } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const students = await db.select().from(Student);
    return c.json(students);
  })
  .post("/", zValidator("json", studentSchema), async (c) => {
    const validatedData = c.req.valid("json");

    const data = await db.transaction(async (tx) => {
      const existingStudent = await tx
        .select()
        .from(Student)
        .where(eq(Student.name, validatedData.name))
        .limit(1);

      if (existingStudent.length > 0) {
        return c.json({ error: "Student already exists" }, 400);
      }
      const [student] = await tx
        .insert(Student)
        .values({
          name: validatedData.name,
          nickname: validatedData.nickname,
          dateOfBirth: validatedData.dateOfBirth,
          joinDate: validatedData.joinDate,
        })
        .returning();

      if (!student) {
        return c.json({ error: "Failed to create student" }, 400);
      }

      const [enrollment] = await tx
        .insert(Enrollment)
        .values({
          studentId: student.id,
          subjectId: validatedData.subjectId,
          enrollmentFee: 0,
          status: "active",
          enrollmentDate: validatedData.joinDate,
        })
        .returning();

      await tx.insert(EnrollmentSubjects).values({
        enrollmentId: enrollment.id,
        subjectId: validatedData.subjectId,
      });

      return student;
    });

    return c.json(data);
  });

export default app;
