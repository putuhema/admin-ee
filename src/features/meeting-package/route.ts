import { db } from "@/db";
import { MeetingPackage } from "@/db/schema";
import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  const packages = await db
    .select({
      id: MeetingPackage.id,
      name: MeetingPackage.name,
      count: MeetingPackage.count,
    })
    .from(MeetingPackage)
    .orderBy(MeetingPackage.count);
  return c.json(packages, 200);
});

export default app;
