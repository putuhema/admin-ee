import { db } from "@/db";
import { Student } from "@/db/schema";
import { validatedAction } from "@/lib/middleware";
import { studentSchema } from "@/lib/zod-schema";
import { eq } from "drizzle-orm";

export const postStudent = validatedAction(studentSchema, async (data) => {
  const existingStudent = await db
    .select()
    .from(Student)
    .where(eq(Student.name, data.name))
    .limit(1);

  if (existingStudent.length > 0) {
    return { error: "Student already exists" };
  }

  const [student] = await db.insert(Student).values(data).returning();

  if (!student) {
    return { error: "Failed to create student" };
  }
});
