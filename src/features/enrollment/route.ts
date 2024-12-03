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
  Product,
  Program,
  ProgramExtra,
  Student,
} from "@/db/schema";
import { Hono } from "hono";
import { eq, inArray } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { enrollmentSchema } from "./schema";
import { z } from "zod";

const app = new Hono()
  .get("/", async (c) => {
    const enrollments = await db
      .select({
        enrollment: {
          id: Enrollment.id,
          enrollmentDate: Enrollment.enrollmentDate,
          status: Enrollment.status,
          qty: Enrollment.meetingQty,
        },
        student: {
          id: Student.id,
          name: Student.name,
        },
        program: {
          id: Program.id,
          name: Program.name,
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
        eq(Enrollment.meetingPackageId, MeetingPackage.id),
      )
      .orderBy(Student.name);

    return c.json(enrollments);
  })
  .get(
    "/:enrollmentId",
    zValidator(
      "param",
      z.object({
        enrollmentId: z.coerce.number(),
      }),
    ),
    async (c) => {
      try {
        const { enrollmentId } = c.req.valid("param");

        const enrollment = await db.transaction(async (tx) => {
          const enrollment = await tx
            .select({
              enrollmentId: Enrollment.id,
              enrollmentDate: Enrollment.enrollmentDate,
              enrollmentStatus: Enrollment.status,
              enrollmentQty: Enrollment.meetingQty,
              enrollmentNotes: Enrollment.notes,
              studentId: Student.id,
              studentName: Student.name,
              programId: Program.id,
              prograName: Program.name,
              orderId: Order.id,
              orderStatus: Order.status,
              orderAmount: Order.totalAmount,
              packageId: MeetingPackage.id,
              packageName: MeetingPackage.name,
              packageCount: MeetingPackage.count,
              packageDiscount: MeetingPackage.discount,
              packagePrice: MeetingPackage.price,
              paymentDate: Payment.paymentDate,
              paymentStatus: Payment.status,
            })
            .from(Enrollment)
            .leftJoin(Student, eq(Enrollment.studentId, Student.id))
            .leftJoin(Program, eq(Enrollment.programId, Program.id))
            .leftJoin(Order, eq(Enrollment.orderId, Order.id))
            .leftJoin(Payment, eq(Enrollment.orderId, Payment.orderId))
            .leftJoin(
              MeetingPackage,
              eq(Enrollment.meetingPackageId, MeetingPackage.id),
            )
            .where(eq(Enrollment.id, enrollmentId))
            .limit(1);

          if (enrollment.length === 0) {
            return null;
          }

          const orderDetails = await tx
            .select({
              id: OrderDetail.id,
              orderId: OrderDetail.orderId,
              price: OrderDetail.price,
              quantity: OrderDetail.quantity,
              date: OrderDetail.createdAt,
              productName: Product.name,
              productPrice: Product.price,
              extraName: ProgramExtra.type,
              extraPrice: ProgramExtra.price,
              packageName: MeetingPackage.name,
              packagePrice: MeetingPackage.price,
              programName: Program.name,
            })
            .from(OrderDetail)
            .leftJoin(Product, eq(OrderDetail.productId, Product.id))
            .leftJoin(Program, eq(OrderDetail.programId, Program.id))
            .leftJoin(
              MeetingPackage,
              eq(OrderDetail.packageId, MeetingPackage.id),
            )
            .leftJoin(ProgramExtra, eq(OrderDetail.extraId, ProgramExtra.id))
            .where(eq(OrderDetail.orderId, enrollment[0].orderId!));

          if (orderDetails.length === 0) {
            null;
          }

          return {
            ...enrollment[0],
            orderDetails: orderDetails,
          };
        });

        if (!enrollment) {
          return c.json({ message: "Enrollment not found" }, 404);
        }

        return c.json(enrollment);
      } catch (error) {
        console.error(error);
        return c.json({ message: error }, 500);
      }
    },
  )
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
        })
        .from(Program)
        .where(eq(Program.id, Number(enrollment.programId)))
        .limit(1);

      const choosePackage = await tx
        .select()
        .from(MeetingPackage)
        .where(eq(MeetingPackage.id, Number(enrollment.packages)));

      if (choosePackage.length === 0) {
        return c.json({ message: "Meeting package not found" });
      }

      const programExtras = await tx
        .select({
          id: ProgramExtra.id,
          price: ProgramExtra.price,
        })
        .from(ProgramExtra)
        .where(inArray(ProgramExtra.id, enrollment.extras.map(Number)));

      const programProducts = await tx
        .select({
          id: Product.id,
          price: Product.price,
        })
        .from(Product)
        .where(inArray(Product.id, enrollment.products.map(Number)));

      let totalAmount =
        (choosePackage[0].price -
          choosePackage[0].price * (choosePackage[0].discount / 100)) *
        enrollment.quantity;

      const extrasTotalAmount = programExtras.reduce(
        (acc, extra) => acc + extra.price,
        0,
      );

      const productsTotalAmount = programProducts.reduce(
        (acc, product) => acc + product.price,
        0,
      );
      totalAmount += extrasTotalAmount + productsTotalAmount;

      const order = await tx
        .insert(Order)
        .values({
          totalAmount,
          studentId: student[0].id,
          orderDate: new Date(),
          status: "pending" as OrderInsert["status"],
        })
        .returning();

      const orderDetailsValues: OrderDetailInsert[] = [];

      orderDetailsValues.push({
        orderId: order[0].id,
        programId: program[0].id,
        packageId: Number(enrollment.packages),
        quantity: enrollment.quantity,
        price: choosePackage[0].price,
      });

      if (enrollment.extras.length > 0) {
        orderDetailsValues.push(
          ...enrollment.extras.map((extraId) => {
            const extra = programExtras.find((p) => p.id === Number(extraId));
            return {
              orderId: order[0].id,
              programId: program[0].id,
              quantity: 1,
              extraId: Number(extraId),
              price: extra?.price ?? 0,
            };
          }),
        );
      }

      if (enrollment.products.length > 0) {
        orderDetailsValues.push(
          ...enrollment.products.map((productId) => {
            const product = programProducts.find(
              (p) => p.id === Number(productId),
            );
            return {
              orderId: order[0].id,
              programId: program[0].id,
              quantity: 1,
              productId: Number(productId),
              price: product?.price ?? 0,
            };
          }),
        );
      }

      if (orderDetailsValues.length > 0) {
        await tx.insert(OrderDetail).values(orderDetailsValues);
      }

      await tx.insert(Payment).values({
        purpose: "enrollment",
        orderId: order[0].id,
        amount: order[0].totalAmount,
        status: "pending",
      });

      const [selectedPackage] = await tx
        .select({ count: MeetingPackage.count, id: MeetingPackage.id })
        .from(MeetingPackage)
        .where(eq(MeetingPackage.id, Number(enrollment.packages)))
        .limit(1);

      if (!selectedPackage) {
        return c.json({ message: "Meeting package not found" }, 404);
      }

      const meetingLeft = selectedPackage.count * enrollment.quantity;

      const newEnrollment = await tx
        .insert(Enrollment)
        .values({
          meetingLeft,
          studentId: student[0].id,
          programId: program[0].id,
          orderId: order[0].id,
          currentLevelId: enrollment.levels,
          meetingPackageId: Number(enrollment.packages),
          quantity: enrollment.quantity,
          enrollmentDate: enrollment.enrollmentDate,
          meetingQty: enrollment.quantity,
          status: "active",
          notes: enrollment.notes,
        } as EnrollmentInsert)
        .returning();

      return newEnrollment[0];
    });

    return c.json(newEnrollment, 201);
  });
export default app;
