import { db } from "@/db";
import {
  Enrollment,
  EnrollmentInsert,
  MeetingPackage,
  Order,
  OrderDetail,
  OrderDetailInsert,
  OrderInsert,
  Payment,
  Program,
  ProgramLevel,
  Student,
} from "@/db/schema";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { enrollmentSchema } from "./schema";

const app = new Hono()
  .get("/", async (c) => {
    const enrollments = await db
      .select({
        enrollment: {
          id: Enrollment.id,
          enrollmentDate: Enrollment.enrollmentDate,
          status: Enrollment.status,
          qty: Enrollment.meeting_qty,
        },
        student: {
          id: Student.id,
          name: Student.name,
        },
        program: {
          id: Program.id,
          name: Program.name,
          level: ProgramLevel.name,
        },
        orders: {
          id: Order.id,
          status: Order.status,
          amount: Order.totalAmount,
        },
        packages: {
          id: MeetingPackage.id,
          name: MeetingPackage.name,
          count: MeetingPackage.count,
        },
      })
      .from(Enrollment)
      .leftJoin(Student, eq(Enrollment.studentId, Student.id))
      .leftJoin(Program, eq(Enrollment.programId, Program.id))
      .leftJoin(Order, eq(Enrollment.orderId, Order.id))
      .leftJoin(
        MeetingPackage,
        eq(Enrollment.meetingPackageId, MeetingPackage.id)
      )
      .leftJoin(ProgramLevel, eq(Enrollment.currentLevelId, ProgramLevel.id))
      .orderBy(Student.name);

    return c.json(enrollments);
  })
  .post("/", zValidator("json", enrollmentSchema), async (c) => {
    const enrollment = c.req.valid("json");

    const newEnrollment = await db.transaction(async (tx) => {
      const student = await tx
        .select({
          id: Student.id,
        })
        .from(Student)
        .where(eq(Student.id, Number(enrollment.studentId)))
        .limit(1);

      if (student.length === 0) {
        return c.json({ message: "Student not found" }, 404);
      }

      const program = await tx
        .select({
          id: Program.id,
          price: Program.pricePerMeeting,
        })
        .from(Program)
        .where(eq(Program.id, Number(enrollment.programId)))
        .limit(1);

      const order = await tx
        .insert(Order)
        .values({
          studentId: student[0].id,
          orderDate: new Date(),
          totalAmount: program[0].price,
          status: "pending" as OrderInsert["status"],
        })
        .returning();

      const defaultOrderDetails: OrderDetailInsert = {
        orderId: order[0].id,
        programId: program[0].id,
        price: program[0].price,
        packageId: Number(enrollment.packages),
        quantity: enrollment.quantity,
      };

      const orderDetailsValues: OrderDetailInsert[] = [];
      if (enrollment.extras.length > 0) {
        orderDetailsValues.push(
          ...enrollment.extras.map((extraId) => ({
            ...defaultOrderDetails,
            extraId: Number(extraId),
          }))
        );
      }

      if (enrollment.products.length > 0) {
        orderDetailsValues.push(
          ...enrollment.products.map((productId) => ({
            ...defaultOrderDetails,
            productId: Number(productId),
          }))
        );
      }

      if (orderDetailsValues.length > 0) {
        await tx.insert(OrderDetail).values(orderDetailsValues);
      }

      await tx.insert(Payment).values({
        purpose: "enrollment",
        orderId: order[0].id,
        paymentDate: new Date(),
        amount: order[0].totalAmount,
        status: "pending",
      });

      const newEnrollment = await tx
        .insert(Enrollment)
        .values({
          studentId: student[0].id,
          programId: program[0].id,
          orderId: order[0].id,
          currentLevelId: enrollment.levels,
          meetingPackageId: Number(enrollment.packages),
          quantity: enrollment.quantity,
          enrollmentDate: enrollment.enrollmentDate,
          meeting_qty: enrollment.quantity,
          status: "active",
          notes: enrollment.notes,
        } as EnrollmentInsert)
        .returning();

      return newEnrollment[0];
    });

    return c.json(newEnrollment, 201);
  });

export default app;
