import { db } from "@/db";
import { Program, ProgramExtra } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { extraFeeSchema, programSchema } from "./schema";

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
  .get(
    "/extra/:programId",
    zValidator(
      "param",
      z.object({
        programId: z.coerce.number(),
      })
    ),
    async (c) => {
      const { programId } = c.req.valid("param");
      const programExtra = await db
        .select({
          programId: ProgramExtra.programId,
          type: ProgramExtra.type,
          price: ProgramExtra.price,
        })
        .from(ProgramExtra)
        .where(eq(ProgramExtra.programId, programId));

      if (!programExtra.length) {
        return c.json({ message: "Program extra not found" }, 404);
      }

      return c.json(programExtra, 200);
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
  })
  .post("/extra", zValidator("json", extraFeeSchema), async (c) => {
    const program = c.req.valid("json");

    const extra = Object.entries({
      book: program.book,
      certificate: program.certificate,
      trophy: program.trophy,
      medal: program.medal,
    }).map(([key, value]) => ({
      programId: program.programId,
      type: key,
      price: Number(value),
      description: "",
    }));

    const [updatedPrograms] = await db
      .insert(ProgramExtra)
      .values(extra)
      .onConflictDoUpdate({
        target: [ProgramExtra.programId, ProgramExtra.type],
        set: {
          price: sql`EXCLUDED.price`,
          description: sql`EXCLUDED.description`,
        },
      })
      .returning();

    return c.json(updatedPrograms, 201);
  });

export default app;
