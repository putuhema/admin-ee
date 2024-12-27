import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { invoiceSchema } from "./schema";
import { db } from "@/db";
import { Enrollment, MeetingPackage, MonthlyFee } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const app = new Hono()
  .get("/", async (c) => {
    return c.json({ message: ":/invoices" });
  })
  .post("/", zValidator("json", invoiceSchema), async (c) => {
    try {
      const { studentId, packageId, programId, quantity, date, notes } =
        c.req.valid("json");

      const newInvoice = await db.transaction(async (tx) => {
        const enrollment = await tx
          .update(Enrollment)
          .set({
            meetingPackageId: Number(packageId),
            programId: Number(programId),
            meetingQty: Number(quantity),
            notes,
          })
          .where(
            and(
              eq(Enrollment.studentId, Number(studentId)),
              eq(Enrollment.programId, Number(programId))
            )
          )
          .returning();

        if (enrollment.length === 0) {
          throw new Error("Enrollment not found");
        }

        const invoiceNumber = `INV-${uuidv4()
          .replace(/-/g, "")
          .slice(0, 12)
          .toUpperCase()}`;

        const [currentPackage] = await tx
          .select()
          .from(MeetingPackage)
          .where(eq(MeetingPackage.id, enrollment[0].meetingPackageId!));

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
