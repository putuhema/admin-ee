import { db } from "@/db";
import { Subject } from "@/db/schema";
import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  const subjects = await db
    .select({
      id: Subject.id,
      name: Subject.name,
    })
    .from(Subject);

  return c.json(subjects);
});

export default app;
