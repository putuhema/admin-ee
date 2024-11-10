import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires"),
});

export type UserType = typeof user.$inferSelect;

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  impersonatedBy: text("impersonatedBy"),
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
  email: text("email").unique(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
  address: text("address"),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const Guardian = pgTable("guardian", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: text("email").unique(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  address: text("address"),
  occupation: varchar("occupation", { length: 255 }),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const StudentGuardian = pgTable("student_guardian", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => Student.id),
  guardianId: integer("guardian_id")
    .notNull()
    .references(() => Guardian.id),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type StudentType = typeof Student.$inferSelect;

export const Subject = pgTable("subject", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const SubjectPricing = pgTable("subject_pricing", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").references(() => Subject.id),
  bookFee: integer("book_fee"),
  monthlyFee: integer("monthly_fee"),
  certificateFee: integer("certificate_fee"),
  medalFee: integer("medal_fee"),
  trophyFee: integer("trophy_fee"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export type PricingType = typeof SubjectPricing.$inferSelect;

export const Enrollment = pgTable("enrollment", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => Student.id),
  subjectId: integer("subject_id").references(() => Subject.id),
  enrollmentDate: timestamp("enrollment_date", { withTimezone: true }),
  status: varchar("status", { length: 255 }),
  enrollmentFee: integer("enrollment_fee"),
  notes: text("notes"),
});

export const EnrollmentItem = pgTable("enrollment_item", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
  subjectPricingId: integer("subject_pricing_id").references(
    () => SubjectPricing.id
  ),
  productId: integer("product_id").references(() => Product.id),
  MonthlyPackageId: integer("monthly_package_id").references(
    () => MonthlyPackage.id
  ),
  itemType: varchar("item_type", { length: 255 }),
  quantity: integer("quantity"),
  unit_price: integer("unit_price"),
  total_price: integer("total_price"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const MonthlyPackage = pgTable("monthly_package", {
  id: serial("id").primaryKey(),
  package: varchar("package", { length: 255 }),
  packageTaken: integer("package_taken"),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
});

export const ProductCategory = pgTable("product_category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
});

export const Product = pgTable("post", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => ProductCategory.id),
  name: varchar("name", { length: 255 }),
  price: integer("price"),
  description: text("description"),
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
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const Payment = pgTable("payment", {
  id: serial("id").primaryKey(),
  amount: integer("amount"),
  status: varchar("status", { length: 255 }),
  method: varchar("method", { length: 255 }),
  paymentDate: timestamp("payment_date", { withTimezone: true }),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const PaymentDetail = pgTable("payment_detail", {
  id: serial("id").primaryKey(),
  paymentId: integer("payment_id").references(() => Payment.id),
  enrollmentItemId: integer("enrollment_item_id").references(
    () => EnrollmentItem.id
  ),
  amount: integer("amount"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const EnrollmentSubjects = pgTable("enrollment_subjects", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
  subjectId: integer("subject_id").references(() => Subject.id),
});

// Relations start here

export const studentRelations = relations(Student, ({ many }) => ({
  enrollments: many(Enrollment),
  studentGuardians: many(StudentGuardian),
}));

export const guardianRelations = relations(Guardian, ({ many }) => ({
  studentGuardians: many(StudentGuardian),
}));

export const studentGuardianRelations = relations(
  StudentGuardian,
  ({ one }) => ({
    student: one(Student, {
      fields: [StudentGuardian.studentId],
      references: [Student.id],
    }),
    guardian: one(Guardian, {
      fields: [StudentGuardian.guardianId],
      references: [Guardian.id],
    }),
  })
);

export const subjectRelations = relations(Subject, ({ many }) => ({
  enrollments: many(Enrollment),
  pricings: many(SubjectPricing),
  enrollmentSubjects: many(EnrollmentSubjects),
}));

export const pricingRelations = relations(SubjectPricing, ({ one, many }) => ({
  subject: one(Subject, {
    fields: [SubjectPricing.subjectId],
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
  tutorSchedules: many(Schedule),
  paymentRecords: many(Payment),
  enrollmentItems: many(EnrollmentItem),
  monthlyPackage: many(MonthlyPackage),
}));

export const enrollmentItemRelations = relations(EnrollmentItem, ({ one }) => ({
  enrollment: one(Enrollment, {
    fields: [EnrollmentItem.enrollmentId],
    references: [Enrollment.id],
  }),
  subjectPricing: one(SubjectPricing, {
    fields: [EnrollmentItem.subjectPricingId],
    references: [SubjectPricing.id],
  }),
  product: one(Product, {
    fields: [EnrollmentItem.productId],
    references: [Product.id],
  }),
  monthlyPackage: one(MonthlyPackage, {
    fields: [EnrollmentItem.MonthlyPackageId],
    references: [MonthlyPackage.id],
  }),
}));

export const paymentDetailRelations = relations(PaymentDetail, ({ one }) => ({
  payment: one(Payment, {
    fields: [PaymentDetail.paymentId],
    references: [Payment.id],
  }),
  enrollmentItem: one(EnrollmentItem, {
    fields: [PaymentDetail.enrollmentItemId],
    references: [EnrollmentItem.id],
  }),
}));

export const productRelations = relations(Product, ({ one }) => ({
  category: one(ProductCategory, {
    fields: [Product.categoryId],
    references: [ProductCategory.id],
  }),
}));

export const productCategoryRelations = relations(
  ProductCategory,
  ({ many }) => ({
    products: many(Product),
  })
);

export const scheduleRelations = relations(Schedule, ({ one }) => ({
  enrollment: one(Enrollment, {
    fields: [Schedule.enrollmentId],
    references: [Enrollment.id],
  }),
  tutor: one(user, {
    fields: [Schedule.tutorId],
    references: [user.id],
  }),
}));

export const paymentRelations = relations(Payment, ({ one, many }) => ({
  enrollment: one(Enrollment, {
    fields: [Payment.enrollmentId],
    references: [Enrollment.id],
  }),
  details: many(PaymentDetail),
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
  })
);

export const monthlyPackageRelations = relations(
  MonthlyPackage,
  ({ one, many }) => ({
    enrollment: one(Enrollment, {
      fields: [MonthlyPackage.enrollmentId],
      references: [Enrollment.id],
    }),
    enrollmentItems: many(EnrollmentItem),
  })
);
