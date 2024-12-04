import { zValidator } from "@hono/zod-validator";
import { db } from "@/db";
import {
  Enrollment,
  Guardian,
  MeetingPackage,
  Program,
  Student,
  StudentGuardian,
} from "@/db/schema";
import { Hono } from "hono";
import {
  and,
  AnyColumn,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  sql,
  SQL,
} from "drizzle-orm";
import { z } from "zod";
import { studentGuardianSchema, studentSchema } from "./schema";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        limit: z.coerce.number().optional().default(10),
        offset: z.coerce.number().optional().default(0),
        search: z.string().optional(),
        sort: z.enum(["name", "nickname", "dateOfBirth"]).optional(),
        order: z.enum(["asc", "desc"]).optional().default("desc"),
      }),
    ),
    async (c) => {
      try {
        const { limit, offset, search, sort, order } = c.req.valid("query");
        const whereClause: SQL[] = [];

        whereClause.push(eq(Student.isDeleted, false));

        if (search) {
          whereClause.push(
            sql`lower(${Student.name}) like ${`%${search.toLowerCase()}%`} OR lower(${Student.nickname}) like ${`%${search.toLowerCase()}%`}`,
          );
        }

        let query = db.select().from(Student);

        if (whereClause.length > 0) {
          query = query.where(and(...whereClause)) as typeof query;
        }

        if (sort) {
          if (sort === "name") {
            query = query.orderBy(
              order === "desc" ? sql`student.name desc` : sql`student.name asc`,
            ) as typeof query;
          } else {
            const sortColumn = Student[
              sort as keyof typeof Student
            ] as AnyColumn;
            query = query.orderBy(
              order === "desc" ? desc(sortColumn) : asc(sortColumn),
            ) as typeof query;
          }
        } else {
          query = query.orderBy(desc(Student.createdAt)) as typeof query;
        }

        query = query.limit(limit).offset(offset) as typeof query;

        const students = await query;

        let totalCountQuery = db
          .select({ count: sql`count(${Student.id})` })
          .from(Student);

        if (whereClause.length) {
          totalCountQuery = totalCountQuery.where(
            and(...whereClause),
          ) as typeof totalCountQuery;
        }

        const [{ count }] = await totalCountQuery;

        return c.json(
          {
            students,
            pagination: {
              total: Number(count),
              limit,
              offset,
            },
          },
          200,
        );
      } catch (error) {
        console.error("Error fetching tasks: ", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  .get(
    "/q",
    zValidator(
      "query",
      z.object({
        name: z.string().optional(),
      }),
    ),
    async (c) => {
      const { name } = c.req.valid("query");

      const query = db.select().from(Student);
      if (name) {
        query.where(
          sql`lower(${Student.name}) like ${`%${name.toLowerCase()}%`} OR lower(${Student.nickname}) like ${`%${name.toLowerCase()}%`}`,
        );
      }

      const students = await query;

      return c.json(students);
    },
  )
  .get(
    "/enrollment/:studentId",
    zValidator(
      "param",
      z.object({
        studentId: z.coerce.number(),
      }),
    ),
    async (c) => {
      const { studentId } = c.req.valid("param");

      const enrollment = await db
        .select({
          id: Enrollment.id,
          studentId: Enrollment.studentId,
          programName: Program.name,
          packageName: MeetingPackage.name,
          packageCount: MeetingPackage.count,
          meetingQty: Enrollment.meetingQty,
          status: Enrollment.status,
          date: Enrollment.enrollmentDate,
        })
        .from(Enrollment)
        .leftJoin(
          MeetingPackage,
          eq(Enrollment.meetingPackageId, MeetingPackage.id),
        )
        .leftJoin(Program, eq(Enrollment.programId, Program.id))
        .where(and(eq(Enrollment.studentId, studentId)));

      if (enrollment.length === 0) {
        return c.json({ error: "No enrollment found" }, 404);
      }

      return c.json(enrollment);
    },
  )
  .get(
    "/:studentId",
    zValidator(
      "param",
      z.object({
        studentId: z.string().regex(/^\d+$/, "Student ID must be a number"),
      }),
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
        .where(
          and(eq(Student.id, Number(studentId)), eq(Student.isDeleted, false)),
        )
        .limit(1);

      if (!students.length) {
        return c.json({ error: "Student not found" }, 404);
      }

      return c.json(students[0]);
    },
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
  .patch("/:studentId", zValidator("json", studentSchema), async (c) => {
    try {
      const studentId = c.req.param("studentId");
      const studentData = c.req.valid("json");
      const [student] = await db
        .update(Student)
        .set(studentData)
        .where(eq(Student.id, Number(studentId)))
        .returning();

      if (!student) {
        return c.json({ error: "Failed to update student" }, 400);
      }

      return c.json(student, 200);
    } catch (error) {
      console.error("Failed to update student :", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })
  .delete(
    "/:studentId",
    zValidator(
      "param",
      z.object({
        studentId: z.string().regex(/^\d+$/, "Student ID must be a number"),
      }),
    ),
    async (c) => {
      try {
        const studentId = Number(c.req.valid("param").studentId);

        const [student] = await db
          .update(Student)
          .set({ isDeleted: true, deletedAt: new Date() })
          .where(eq(Student.id, studentId))
          .returning();

        if (!student) {
          return c.json({ error: "Failed to delete student" }, 400);
        }

        return c.json(student, 200);
      } catch (error) {
        console.error("Failed to delete student :", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
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
  })
  .post(
    "/bulk-delete",
    zValidator("json", z.object({ ids: z.array(z.number()) })),
    async (c) => {
      try {
        const { ids } = c.req.valid("json");

        const deleteStudents = await db
          .update(Student)
          .set({ isDeleted: true, deletedAt: new Date() })
          .where(inArray(Student.id, ids))
          .returning();

        if (deleteStudents.length === 0) {
          return c.json({ error: "Failed to delete students" }, 400);
        }

        return c.json({ message: "Students deleted successfully" }, 200);
      } catch (err) {
        console.error("Failed to delete students: ", err);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  );

export default app;
