import { db } from "@/db";
import { Program, ProgramExtra, ProgramLevel } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { asc, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { extraFeeSchema, programSchema, ProgramResponseSchema } from "./schema";

const app = new Hono()
  .get("/", async (c) => {
    try {
      const programExtras = db
        .select({
          programId: ProgramExtra.programId,
          extras: sql<string>`json_agg(
            json_build_object('type', ${ProgramExtra.type}, 'price', ${ProgramExtra.price})
          )`.as("extras"),
        })
        .from(ProgramExtra)
        .groupBy(ProgramExtra.programId)
        .as("program_extras");

      const programLevels = db
        .select({
          programId: ProgramLevel.programId,
          levels: sql<string>`json_agg(
            json_build_object('id', ${ProgramLevel.id}, 'level', ${ProgramLevel.name})
          )`.as("levels"),
        })
        .from(ProgramLevel)
        .groupBy(ProgramLevel.programId)
        .as("program_levels");

      // Main query with proper joins
      const rawPrograms = await db
        .select({
          id: Program.id,
          name: Program.name,
          description: Program.description,
          pricePerMeeting: Program.pricePerMeeting,
          extra: programExtras.extras,
          levels: programLevels.levels,
        })
        .from(Program)
        .leftJoin(programExtras, eq(Program.id, programExtras.programId))
        .leftJoin(programLevels, eq(Program.id, programLevels.programId))
        .orderBy(asc(Program.name));

      const programs = rawPrograms.map((program) => {
        const extraArray = Array.isArray(program.extra)
          ? program.extra
          : JSON.parse(program.extra || "[]");
        const levelsArray = Array.isArray(program.levels)
          ? program.levels
          : JSON.parse(program.levels || "[]");

        return {
          ...program,
          extra: extraArray.filter(Boolean),
          levels: levelsArray.filter(Boolean),
        };
      });

      const validatedPrograms = ProgramResponseSchema.array().parse(programs);

      return c.json(validatedPrograms, 200);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json(
          { error: "Invalid data structure", details: error.errors },
          400
        );
      }

      console.error("Server error:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .get(
    "/levels/:programId",
    zValidator(
      "param",
      z.object({
        programId: z.coerce.number(),
      })
    ),
    async (c) => {
      try {
        const { programId } = c.req.valid("param");
        const programLevels = await db
          .select({
            id: ProgramLevel.id,
            level: ProgramLevel.name,
          })
          .from(ProgramLevel)
          .where(eq(ProgramLevel.programId, programId));

        return c.json(programLevels, 200);
      } catch (error) {
        console.error("Server error:", error);
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )

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
          id: ProgramExtra.id,
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
