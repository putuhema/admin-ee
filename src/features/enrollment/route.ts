import { db } from "@/db";
import { Enrollment, Student, Subject } from "@/db/schema";
import { Hono } from "hono";
import { eq } from "drizzle-orm";

const app = new Hono().get("/", async (c) => {
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
      subject: {
        id: Subject.id,
        name: Subject.name,
      },
    })
    .from(Enrollment)
    .leftJoin(Student, eq(Enrollment.studentId, Student.id))
    .leftJoin(Subject, eq(Enrollment.subjectId, Subject.id))
    .orderBy(Student.name);

  return c.json(enrollments);
});

export default app;
