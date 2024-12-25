import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { bookPreparationsSchema } from "./schema";
import { db } from "@/db";
import {
  BookPreparationStatus,
  BookPrepInsert,
  Order,
  Payment,
  Program,
  ProgramExtra,
  Student,
} from "@/db/schema";
import { and, AnyColumn, asc, desc, eq, inArray, SQL, sql } from "drizzle-orm";
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
        program: z.string().optional(),
        status: z.enum(["pending", "prepared", "paid", "delivered"]).optional(),
        sort: z.enum(["name", "nickname", "dateOfBirth"]).optional(),
        order: z.enum(["asc", "desc"]).optional().default("desc"),
      })
    ),
    async (c) => {
      try {
        const { limit, offset, search, status, program, sort, order } =
          c.req.valid("query");

        const baseSelection = {
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
          notes: BookPreparationStatus.notes,
          status: BookPreparationStatus.status,
          price: BookPreparationStatus.price,
        };

        const conditions: SQL[] = [];

        if (search) {
          const searchTerm = `%${search.toLowerCase()}%`;
          conditions.push(
            sql`(LOWER(${Student.name}::text) LIKE ${searchTerm} OR LOWER(${Student.nickname}::text) LIKE ${searchTerm})`
          );
        }

        if (status) conditions.push(eq(BookPreparationStatus.status, status));
        if (program) conditions.push(eq(Program.id, Number(program)));

        const sortClause = !sort
          ? desc(BookPreparationStatus.createdAt)
          : sort === "name" || sort === "nickname"
          ? order === "desc"
            ? desc(Student[sort])
            : asc(Student[sort])
          : order === "desc"
          ? desc(
              BookPreparationStatus[
                sort as keyof typeof BookPreparationStatus
              ] as AnyColumn
            )
          : asc(
              BookPreparationStatus[
                sort as keyof typeof BookPreparationStatus
              ] as AnyColumn
            );

        const baseQuery = db
          .select(baseSelection)
          .from(BookPreparationStatus)
          .leftJoin(Student, eq(Student.id, BookPreparationStatus.studentId))
          .leftJoin(Program, eq(Program.id, BookPreparationStatus.programId));

        const whereClause = conditions.length ? and(...conditions) : undefined;
        const [bookPreps, [{ count }]] = await Promise.all([
          baseQuery
            .where(whereClause)
            .orderBy(sortClause)
            .limit(limit)
            .offset(offset),

          db
            .select({ count: sql`count(${BookPreparationStatus.id})` })
            .from(BookPreparationStatus)
            .leftJoin(Student, eq(Student.id, BookPreparationStatus.studentId))
            .leftJoin(Program, eq(Program.id, BookPreparationStatus.programId))
            .where(whereClause),
        ]);

        return c.json(
          {
            bookPreps,
            pagination: { total: Number(count), limit, offset },
          },
          200
        );
      } catch (error) {
        console.error("Error fetching book preparations:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid("param");
      const bookPrep = await db
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
          notes: BookPreparationStatus.notes,
          status: BookPreparationStatus.status,
        })
        .from(BookPreparationStatus)
        .leftJoin(Student, eq(Student.id, BookPreparationStatus.studentId))
        .leftJoin(Program, eq(Program.id, BookPreparationStatus.programId))
        .where(eq(BookPreparationStatus.id, id))
        .limit(1);

      if (bookPrep.length === 0) {
        return c.json({ error: "Book Preparations not found" }, 404);
      }

      return c.json(bookPrep[0]);
    }
  )
  .post("/", zValidator("json", bookPreparationsSchema), async (c) => {
    const formData = c.req.valid("json");

    const result = await db.transaction(async (tx) => {
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

      const bookPrepare = await tx
        .insert(BookPreparationStatus)
        .values({
          studentId: Number(formData.studentId),
          programId: Number(formData.programId),
          notes: formData.notes,
          status: "pending",
          price: program[0].bookPrice!,
        })
        .returning();

      const order = await tx
        .insert(Order)
        .values({
          studentId: Number(formData.studentId),
          totalAmount: program[0].bookPrice!,
          notes: "bookprep",
          status: "pending",
          orderDate: new Date(),
        })
        .returning();

      await tx.insert(Payment).values({
        orderId: order[0].id,
        amount: program[0].bookPrice!,
        status: "pending",
      });

      return bookPrepare;
    });

    return c.json(result);
  })
  .put(
    "/",
    zValidator(
      "json",
      bookPreparationsSchema.extend({
        id: z.number(),
      })
    ),
    async (c) => {
      try {
        const formData = c.req.valid("json");

        const updatedBooks = await db
          .update(BookPreparationStatus)
          .set({
            studentId: Number(formData.studentId),
            programId: Number(formData.programId),
            notes: formData.notes,
          })
          .where(eq(BookPreparationStatus.id, formData.id))
          .returning();

        if (updatedBooks.length === 0) {
          return c.json({ error: "Book Preparations not found" }, 404);
        }

        return c.json({
          message: "Book preparation updated successfully",
          data: updatedBooks[0],
        });
      } catch (error) {
        console.error("Error updating book preparation:", error);
        return c.json({ error: "Failed to update book preparation" }, 500);
      }
    }
  )
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

        const updatedBooks = await db.transaction(async (tx) => {
          const currentBookPrep = await tx
            .select({
              prepareDate: BookPreparationStatus.prepareDate,
              paidDate: BookPreparationStatus.paidDate,
              deliveredDate: BookPreparationStatus.deliveredDate,
            })
            .from(BookPreparationStatus)
            .where(eq(BookPreparationStatus.id, id))
            .limit(1);

          if (currentBookPrep.length === 0) {
            return c.json({ error: "Book Preparations not found" }, 404);
          }

          const bookPrep: Partial<BookPrepInsert> = {
            status,
            ...(status === "prepared" && { prepareDate: new Date() }),
            ...(status === "paid" && { paidDate: new Date() }),
            ...(status === "delivered" && {
              deliveredDate: new Date(),
              ...(currentBookPrep[0].prepareDate === null && {
                prepareDate: new Date(),
              }),
              ...(currentBookPrep[0].paidDate === null && {
                paidDate: new Date(),
              }),
            }),
          };

          const updatedBooks = await tx
            .update(BookPreparationStatus)
            .set(bookPrep)
            .where(eq(BookPreparationStatus.id, id))
            .returning();

          if (updatedBooks.length === 0) {
            return c.json({ error: "Book Preparations not found" }, 404);
          }

          if (status === "delivered" || status === "paid") {
            const order = await tx
              .update(Order)
              .set({ status: "completed" })
              .where(
                and(
                  eq(Order.studentId, updatedBooks[0].studentId),
                  eq(Order.notes, "bookprep")
                )
              )
              .returning();

            if (order.length >= 0) {
              await tx
                .update(Payment)
                .set({ status: "completed" })
                .where(eq(Payment.orderId, order[0].id))
                .returning();
            }
          }

          return updatedBooks;
        });

        return c.json({
          message: "Status updated successfully",
          data: updatedBooks,
        });
      } catch (error) {
        console.error("Error updating book preparation status", error);

        return c.json({ error: "Failed to update status" }, 500);
      }
    }
  )
  .patch(
    "/date",
    zValidator(
      "json",
      z.object({
        id: z.number(),
        date: z.coerce.date(),
        type: z.enum(["prepare", "paid", "delivered"]),
      })
    ),
    async (c) => {
      try {
        const { id, date, type } = c.req.valid("json");

        const updatedBooks = await db
          .update(BookPreparationStatus)
          .set({
            [`${type}Date`]: date,
          })
          .where(eq(BookPreparationStatus.id, id))
          .returning();

        if (updatedBooks.length === 0) {
          return c.json({ error: "Book Preparations not found" }, 404);
        }

        return c.json({
          message: "Date updated successfully",
          data: updatedBooks[0],
        });
      } catch (error) {
        console.error("Error updating book preparation date", error);

        return c.json({ error: "Failed to update date" }, 500);
      }
    }
  )
  .delete("/", zValidator("json", z.object({ id: z.number() })), async (c) => {
    try {
      const { id } = c.req.valid("json");

      const deletedBooks = await db
        .delete(BookPreparationStatus)
        .where(eq(BookPreparationStatus.id, id))
        .returning();

      if (deletedBooks.length === 0) {
        return c.json({ error: "Book Preparations not found" }, 404);
      }

      return c.json({
        message: "Book preparation deleted successfully",
        data: deletedBooks[0],
      });
    } catch (error) {
      console.error("Error deleting book preparation:", error);
      return c.json({ error: "Failed to delete book preparation" }, 500);
    }
  })
  .delete(
    "/bulk-delete",
    zValidator("json", z.array(z.number())),
    async (c) => {
      try {
        const ids = c.req.valid("json");

        const deletedBooks = await db
          .delete(BookPreparationStatus)
          .where(inArray(BookPreparationStatus.id, ids))
          .returning();

        return c.json({
          message: "Book preparation deleted successfully",
          data: deletedBooks,
        });
      } catch (error) {
        console.error("Error deleting book preparation:", error);
        return c.json({ error: "Failed to delete book preparation" }, 500);
      }
    }
  );
export default app;
