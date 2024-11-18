import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  const teachers = await db
    .select({
      id: user.id,
      name: user.name,
    })
    .from(user)
    .where(eq(user.role, "teacher"));

  return c.json(teachers);
});

export default app;
