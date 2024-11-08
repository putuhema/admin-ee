import { zValidator } from "@hono/zod-validator";
import { db } from "@/db";
import { Student } from "@/db/schema";
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
        name: validatedData.name,
        nickname: validatedData.nickname,
        dateOfBirth: validatedData.dateOfBirth,
        joinDate: validatedData.joinDate,
      })
      .returning();

    if (!student) {
      return c.json({ error: "Failed to create student" }, 400);
    }

    return c.json(student);
  });

export default app;