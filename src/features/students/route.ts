import { zValidator } from "@hono/zod-validator";
import { db } from "@/db";
import {
  Enrollment,
  Guardian,
  MeetingPackage,
  Program,
  ProgramLevel,
  Student,
  StudentGuardian,
} from "@/db/schema";
import { Hono } from "hono";
import { eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { studentGuardianSchema, studentSchema } from "./schema";

const app = new Hono()
  .get("/", async (c) => {
    const students = await db.select().from(Student);
    return c.json(students);
  })
  .get(
    "/q",
    zValidator(
      "query",
      z.object({
        name: z.string().optional(),
      })
    ),
    async (c) => {
      const { name } = c.req.valid("query");

      const query = db.select().from(Student).limit(10);
      if (name) {
        query.where(ilike(Student.name, `%${name}%`));
      }

      const students = await query;

      return c.json(students);
    }
  )
  .get(
    "/enrollment/:studentId",
    zValidator(
      "param",
      z.object({
        studentId: z.coerce.number(),
      })
    ),
    async (c) => {
      const { studentId } = c.req.valid("param");

      const enrollment = await db
        .select({
          id: Enrollment.id,
          studentId: Enrollment.studentId,
          program: Program.name,
          packageName: MeetingPackage.name,
          packageCount: MeetingPackage.count,
          level: ProgramLevel.name,
          meetingQty: Enrollment.meeting_qty,
          status: Enrollment.status,
          date: Enrollment.enrollmentDate,
        })
        .from(Enrollment)
        .leftJoin(Program, eq(Enrollment.programId, Program.id))
        .leftJoin(ProgramLevel, eq(Enrollment.currentLevelId, ProgramLevel.id))
        .leftJoin(
          MeetingPackage,
          eq(Enrollment.meetingPackageId, MeetingPackage.id)
        )
        .where(eq(Enrollment.studentId, studentId));

      if (enrollment.length === 0) {
        return c.json({ error: "No enrollment found" }, 404);
      }

      return c.json(enrollment);
    }
  )
  .get(
    "/:studentId",
    zValidator(
      "param",
      z.object({
        studentId: z.string().regex(/^\d+$/, "Student ID must be a number"),
      })
    ),
    async (c) => {
      const { studentId } = c.req.valid("param");
      const students = await db
        .select({
          id: Student.id,
          name: Student.name,
          nickname: Student.nickname,
          email: Student.email,
          phoneNumber: Student.phoneNumber,
          dateOfBirth: Student.dateOfBirth,
          address: Student.address,
          additionalInfo: Student.additionalInfo,
          notes: Student.notes,
          guardian: {
            id: Guardian.id,
            name: Guardian.name,
            email: Guardian.email,
            phoneNumber: Guardian.phoneNumber,
            address: Guardian.address,
            occupation: Guardian.occupation,
            isPrimary: StudentGuardian.isPrimary,
            relationship: StudentGuardian.relationship,
          },
        })
        .from(Student)
        .leftJoin(StudentGuardian, eq(StudentGuardian.studentId, Student.id))
        .leftJoin(Guardian, eq(StudentGuardian.guardianId, Guardian.id))
        .where(eq(Student.id, parseInt(studentId)))
        .limit(1);

      if (!students.length) {
        return c.json({ error: "Student not found" }, 404);
      }

      return c.json(students[0]);
    }
  )
  .post("/", zValidator("json", studentSchema), async (c) => {
    const validatedData = c.req.valid("json");

    const existingStudent = await db
      .select()
      .from(Student)
      .where(eq(Student.name, validatedData.name))
      .limit(1);

    if (existingStudent.length > 0) {
      return c.json({ error: "Student already exists" }, 400);
    }
    const [student] = await db
      .insert(Student)
      .values({
        ...validatedData,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        address: validatedData.address,
      })
      .returning();

    if (!student) {
      return c.json({ error: "Failed to create student" }, 400);
    }

    return c.json(student);
  })
  .post("/guardian", zValidator("json", studentGuardianSchema), async (c) => {
    const validatedData = c.req.valid("json");

    const newGuardian = await db.transaction(async (tx) => {
      const guardian = await tx
        .insert(Guardian)
        .values({
          ...validatedData,
        })
        .returning();

      if (guardian.length === 0) {
        return c.json({ error: "Failed to create guardian" }, 400);
      }

      await tx.insert(StudentGuardian).values({
        studentId: Number(validatedData.studentId),
        guardianId: guardian[0].id,
        isPrimary: validatedData.isPrimary,
        relationship: validatedData.relationship,
      });

      console.log("successfully added guardian");

      return guardian[0];
    });

    return c.json(newGuardian, 201);
  });

export default app;
