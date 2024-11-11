import { db } from "@/db";
import { Program } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { programSchema } from "./schema";

const app = new Hono()
  .get("/", async (c) => {
    const programs = await db.select().from(Program).orderBy(asc(Program.name));

    return c.json(programs, 200);
  })
  .get(
    "/:programId",
    zValidator(
      "param",
      z.object({
        programId: z.coerce.number(),
      })
    ),
    async (c) => {
      const { programId } = c.req.valid("param");

      const program = await db
        .select()
        .from(Program)
        .where(eq(Program.id, programId))
        .limit(1);

      if (!program.length) {
        return c.json({ message: "Program not found" }, 404);
      }

      return c.json(program[0], 200);
    }
  )
  .put("/", zValidator("json", programSchema), async (c) => {
    const program = c.req.valid("json");

    const [updatedPrograms] = await db
      .update(Program)
      .set({
        ...program,
        pricePerMeeting: Number(program.pricePerMeeting),
      })
      .where(eq(Program.id, program.id))
      .returning();

    return c.json(updatedPrograms, 201);
  });
export default app;
