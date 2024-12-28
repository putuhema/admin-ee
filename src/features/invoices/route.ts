import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { invoiceSchema } from "./schema";
import { db } from "@/db";
import {
  Enrollment,
  MeetingPackage,
  MonthlyFee,
  Program,
  Student,
} from "@/db/schema";
import { and, count, countDistinct, eq, gt, lt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const app = new Hono()
  .get("/", async (c) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const rawInvoices = await db
      .select({
        id: MonthlyFee.id,
        student: {
          name: Student.name,
          nickname: Student.nickname,
          id: Student.id,
        },
        program: {
          id: Program.id,
          name: Program.name,
        },
        package: {
          id: MeetingPackage.id,
          name: MeetingPackage.name,
          qty: MeetingPackage.count,
          price: MeetingPackage.price,
        },
        invoiceDate: MonthlyFee.invoiceDate,
        invoiceNumber: MonthlyFee.invoiceNumber,
        dueDate: MonthlyFee.dueDate,
        amount: MonthlyFee.amount,
        status: MonthlyFee.status,
        paidDate: MonthlyFee.paidDate,
        notes: MonthlyFee.notes,
      })
      .from(MonthlyFee)
      .leftJoin(Student, eq(Student.id, MonthlyFee.studentId))
      .leftJoin(
        Enrollment,
        and(
          eq(Enrollment.studentId, MonthlyFee.studentId),
          eq(Enrollment.programId, MonthlyFee.programId)
        )
      )
      .leftJoin(Program, eq(Program.id, MonthlyFee.programId))
      .leftJoin(
        MeetingPackage,
        eq(MeetingPackage.id, Enrollment.meetingPackageId)
      )
      .where(
        and(
          gt(MonthlyFee.invoiceDate, startOfMonth),
          lt(MonthlyFee.invoiceDate, endOfMonth)
        )
      );

    const groupedInvoices = rawInvoices.reduce(
      (acc, invoice) => {
        const studentId = invoice.student!.id;

        if (!acc[studentId]) {
          acc[studentId] = {
            student: invoice.student,
            programs: [],
          };
        }

        const existingProgram = acc[studentId].programs.find(
          (p) => p.program!.id === invoice.program!.id
        );

        if (existingProgram) {
          existingProgram.invoices.push({
            id: invoice.id,
            package: invoice.package,
            invoiceDate: invoice.invoiceDate,
            invoiceNumber: invoice.invoiceNumber,
            dueDate: invoice.dueDate,
            amount: invoice.amount,
            status: invoice.status,
            paidDate: invoice.paidDate,
            notes: invoice.notes,
          });
        } else {
          acc[studentId].programs.push({
            program: invoice.program,
            invoices: [
              {
                id: invoice.id,
                package: invoice.package,
                invoiceDate: invoice.invoiceDate,
                invoiceNumber: invoice.invoiceNumber,
                dueDate: invoice.dueDate,
                amount: invoice.amount,
                status: invoice.status,
                paidDate: invoice.paidDate,
                notes: invoice.notes,
              },
            ],
          });
        }

        return acc;
      },
      {} as Record<
        number,
        {
          student: (typeof rawInvoices)[0]["student"];
          programs: Array<{
            program: (typeof rawInvoices)[0]["program"];
            invoices: Array<
              Omit<(typeof rawInvoices)[0], "student" | "program">
            >;
          }>;
        }
      >
    );

    const totalStudents = await db
      .select({ count: count() })
      .from(Student)
      .then((result) => result[0].count);

    const studentsWithInvoice = await db
      .select({ count: countDistinct(MonthlyFee.studentId) })
      .from(MonthlyFee)
      .where(
        and(
          gt(MonthlyFee.invoiceDate, startOfMonth),
          lt(MonthlyFee.invoiceDate, endOfMonth)
        )
      )
      .then((result) => result[0].count);

    const percentage =
      totalStudents > 0
        ? Math.round((studentsWithInvoice / totalStudents) * 100)
        : 0;

    return c.json({
      invoices: Object.values(groupedInvoices),
      summary: {
        totalStudents,
        studentsWithInvoice,
        percentage,
      },
    });
  })
  .post("/", zValidator("json", invoiceSchema), async (c) => {
    try {
      const { studentId, packageId, programId, quantity, date, notes } =
        c.req.valid("json");

      const newInvoice = await db.transaction(async (tx) => {
        const [existingEnrollment] = await tx
          .select()
          .from(Enrollment)
          .where(
            and(
              eq(Enrollment.studentId, Number(studentId)),
              eq(Enrollment.programId, Number(programId))
            )
          );

        if (existingEnrollment) {
          await tx
            .update(Enrollment)
            .set({
              meetingPackageId: Number(packageId),
              meetingQty: Number(quantity),
              notes,
            })
            .where(
              and(
                eq(Enrollment.studentId, Number(studentId)),
                eq(Enrollment.programId, Number(programId))
              )
            );
        } else {
          await tx.insert(Enrollment).values({
            studentId: Number(studentId),
            programId: Number(programId),
            meetingPackageId: Number(packageId),
            meetingQty: Number(quantity),
            meetingLeft: Number(quantity),
            notes,
          });
        }

        const invoiceNumber = `INV-${uuidv4()
          .replace(/-/g, "")
          .slice(0, 12)
          .toUpperCase()}`;

        const [currentPackage] = await tx
          .select()
          .from(MeetingPackage)
          .where(eq(MeetingPackage.id, Number(packageId)));

        if (!currentPackage) {
          throw new Error("Meeting package not found");
        }

        const [invoice] = await tx
          .insert(MonthlyFee)
          .values({
            invoiceDate: date,
            dueDate: date,
            invoiceNumber,
            studentId: Number(studentId),
            programId: Number(programId),
            amount: currentPackage.price * quantity,
            notes,
          })
          .returning();

        return invoice;
      });

      return c.json(newInvoice);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        switch (error.message) {
          case "Enrollment not found":
            return c.json({ error: error.message }, 404);
          case "Meeting package not found":
            return c.json({ error: error.message }, 404);
          default:
            return c.json({ error: "Something went wrong" }, 500);
        }
      }

      return c.json({ error: "Something went wrong" }, 500);
    }
  });

export default app;
