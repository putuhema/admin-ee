import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { TypeOf } from "zod";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export type User = typeof user.$inferSelect;

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  expiresAt: timestamp("expiresAt"),
  password: text("password"),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export const Student = pgTable("student", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  nickname: text("nickname"),
  dateOfBirth: timestamp("date_of_birth"),
  joinDate: timestamp("join_date"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type StudentType = typeof Student.$inferSelect;

export const Subject = pgTable("subject", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  level: integer("level"),
});

export const Pricing = pgTable("pricing", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => Subject.id),
  bookPrice: integer("book_price"),
  monthlyFee: integer("monthly_fee"),
  certificateFee: integer("certificate_fee"),
  medalFee: integer("medal_fee"),
  trophyFee: integer("trophy_fee"),
  additionalCost: integer("additional_cost"),
});

export type PricingType = typeof Pricing.$inferSelect;

export const Enrollment = pgTable("enrollment", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => Student.id),
  subjectId: integer("subject_id").references(() => Subject.id),
  enrollmentDate: timestamp("enrollment_date", { withTimezone: true }),
  status: varchar("status", { length: 255 }),
  enrollmentFee: integer("enrollment_fee"),
});

export const Schedule = pgTable("schedule", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
  tutorId: text("tutor_id").references(() => user.id),
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  location: varchar("location", { length: 255 }),
  status: varchar("status", {
    length: 255,
  }),
});

export const Payment = pgTable("payment", {
  id: serial("id").primaryKey(),
  paymentNumber: varchar("payment_number", { length: 255 }),
  packet: integer("packet"),
  packetQty: integer("packet_qty"),
  amount: integer("amount"),
  paymentDate: timestamp("payment_date", { withTimezone: true }),
  status: varchar("status", { length: 255 }),
  method: varchar("method", { length: 255 }),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
  pricingId: integer("pricing_id").references(() => Pricing.id),
});

export const EnrollmentSubjects = pgTable("enrollment_subjects", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
  subjectId: integer("subject_id").references(() => Subject.id),
});

export const studentRelations = relations(Student, ({ many }) => ({
  enrollments: many(Enrollment),
}));

export const subjectRelations = relations(Subject, ({ many }) => ({
  enrollments: many(Enrollment),
  pricings: many(Pricing),
  enrollmentSubjects: many(EnrollmentSubjects),
}));

export const pricingRelations = relations(Pricing, ({ one, many }) => ({
  subject: one(Subject, {
    fields: [Pricing.subjectId],
    references: [Subject.id],
  }),
  payments: many(Payment),
}));

export const enrollmentRelations = relations(Enrollment, ({ one, many }) => ({
  student: one(Student, {
    fields: [Enrollment.studentId],
    references: [Student.id],
  }),
  subject: one(Subject, {
    fields: [Enrollment.subjectId],
    references: [Subject.id],
  }),
  schedules: many(Schedule),
  payments: many(Payment),
  enrollmentSubjects: many(EnrollmentSubjects),
}));

export const scheduleRelations = relations(Schedule, ({ one }) => ({
  enrollment: one(Enrollment, {
    fields: [Schedule.enrollmentId],
    references: [Enrollment.id],
  }),
}));

export const paymentRelations = relations(Payment, ({ one }) => ({
  enrollment: one(Enrollment, {
    fields: [Payment.enrollmentId],
    references: [Enrollment.id],
  }),
  pricing: one(Pricing, {
    fields: [Payment.pricingId],
    references: [Pricing.id],
  }),
}));

export const enrollmentSubjectsRelations = relations(
  EnrollmentSubjects,
  ({ one }) => ({
    enrollment: one(Enrollment, {
      fields: [EnrollmentSubjects.enrollmentId],
      references: [Enrollment.id],
    }),
    subject: one(Subject, {
      fields: [EnrollmentSubjects.subjectId],
      references: [Subject.id],
    }),
  }),
);
