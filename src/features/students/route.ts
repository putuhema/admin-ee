import { zValidator } from "@hono/zod-validator";
import { db } from "@/db";
import { Student } from "@/db/schema";
import { Hono } from "hono";
import { eq, ilike } from "drizzle-orm";
import { z } from "zod";
import { studentSchema } from "./schema";

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
      .values(validatedData)
      .returning();

    if (!student) {
      return c.json({ error: "Failed to create student" }, 400);
    }

    return c.json(student);
  });

export default app;
