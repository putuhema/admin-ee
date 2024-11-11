import { db } from "@/db";
import { Program } from "@/db/schema";
import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  const programs = await db.select().from(Program);

  return c.json(programs, 200);
});

export default app;
