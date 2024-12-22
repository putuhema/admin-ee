import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { bookPreparationsSchema } from "./schema";
import { db } from "@/db";
import {
  BookPreparationStatus,
  BookPrepInsert,
  Order,
  Program,
  ProgramExtra,
  Student,
} from "@/db/schema";
import { and, AnyColumn, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        limit: z.coerce.number().optional().default(10),
        offset: z.coerce.number().optional().default(0),
        search: z.string().optional(),
        sort: z.enum(["name", "nickname", "dateOfBirth"]).optional(),
        order: z.enum(["asc", "desc"]).optional().default("desc"),
      })
    ),
    async (c) => {
      try {
        // TODO: filtering is not working
        const { limit, offset, search, sort, order } = c.req.valid("query");
        const buildBaseQuery = () =>
          db
            .select({
              id: BookPreparationStatus.id,
              program: { id: Program.id, name: Program.name },
              student: {
                id: Student.id,
                name: Student.name,
                nickname: Student.nickname,
              },
              prepareDate: BookPreparationStatus.prepareDate,
              paidDate: BookPreparationStatus.paidDate,
              deliveredDate: BookPreparationStatus.deliveredDate,
              status: BookPreparationStatus.status,
            })
            .from(BookPreparationStatus)
            .leftJoin(Student, eq(Student.id, BookPreparationStatus.studentId))
            .leftJoin(Program, eq(Program.id, BookPreparationStatus.programId));

        const searchCondition = search
          ? sql`LOWER(${
              Student.name
            }::text) LIKE ${`%${search.toLowerCase()}%`} OR LOWER(${
              Student.nickname
            }::text) LIKE ${`%${search.toLowerCase()}%`}`
          : undefined;

        const getSortClause = () => {
          if (!sort) return desc(BookPreparationStatus.createdAt);
          if (sort === "name") {
            return order === "desc"
              ? sql`student.name desc`
              : sql`student.name asc`;
          }
          const sortColumn = BookPreparationStatus[
            sort as keyof typeof BookPreparationStatus
          ] as AnyColumn;
          return order === "desc" ? desc(sortColumn) : asc(sortColumn);
        };

        const [bookPreps, [{ count }]] = await Promise.all([
          buildBaseQuery()
            .where(searchCondition)
            .orderBy(getSortClause())
            .limit(limit)
            .offset(offset),

          db
            .select({
              count: sql`count(${BookPreparationStatus.id})`,
            })
            .from(BookPreparationStatus)
            .where(searchCondition),
        ]);

        return c.json(
          {
            bookPreps,
            pagination: {
              total: Number(count),
              limit,
              offset,
            },
          },
          200
        );
      } catch (error) {
        console.error("Error fetching book preparations:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .post("/", zValidator("json", bookPreparationsSchema), async (c) => {
    const formData = c.req.valid("json");

    const result = await db.transaction(async (tx) => {
      const bookPrepare = await tx
        .insert(BookPreparationStatus)
        .values({
          studentId: Number(formData.studentId),
          programId: Number(formData.programId),
          notes: formData.notes,
          status: "pending",
        })
        .returning();

      const program = await tx
        .select({
          name: Program.name,
          bookPrice: ProgramExtra.price,
        })
        .from(Program)
        .where(eq(Program.id, Number(formData.programId)))
        .leftJoin(
          ProgramExtra,
          and(
            eq(ProgramExtra.programId, Number(formData.programId)),
            eq(ProgramExtra.type, "book")
          )
        )
        .limit(1);

      if (program.length === 0) {
        return c.json("Program not found", 404);
      }

      await tx.insert(Order).values({
        studentId: Number(formData.studentId),
        totalAmount: program[0].bookPrice!,
        notes: `preparing ${formData.notes} for ${program[0].name}.`,
        status: "pending",
        orderDate: new Date(),
      });

      return bookPrepare;
    });

    return c.json(result);
  })
  .patch(
    "/status",
    zValidator(
      "json",
      z.object({
        id: z.number(),
        status: z.enum(["pending", "prepared", "paid", "delivered"]),
      })
    ),
    async (c) => {
      try {
        const { id, status } = c.req.valid("json");

        const bookPrep: Partial<BookPrepInsert> = {
          status,
          ...(status === "prepared" && { prepareDate: new Date() }),
          ...(status === "paid" && { paidDate: new Date() }),
          ...(status === "delivered" && { deliveredDate: new Date() }),
        };

        const updatedBooks = await db
          .update(BookPreparationStatus)
          .set(bookPrep)
          .where(eq(BookPreparationStatus.id, id))
          .returning();

        if (updatedBooks.length === 0) {
          return c.json({ error: "Book Preparations not found" }, 404);
        }

        return c.json({
          message: "Status updated successfully",
          data: updatedBooks[0],
        });
      } catch (error) {
        console.error("Error updating book preparation status", error);
        return c.json({ error: "Failed to update status" }, 500);
      }
    }
  );
export default app;
