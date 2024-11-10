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
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
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

export const Program = pgTable("program", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const Level = pgTable("level", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const ProgramLevel = pgTable("program_level", {
  id: serial("id").primaryKey(),
  programId: integer("program_id")
    .notNull()
    .references(() => Program.id),
  levelId: integer("level_id")
    .notNull()
    .references(() => Level.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ProgramLevelType = typeof ProgramLevel.$inferSelect;

export const ProgramPrice = pgTable("program_price", {
  id: serial("id").primaryKey(),
  programId: integer("program_id")
    .references(() => Program.id)
    .unique(),
  bookFee: integer("book_fee"),
  monthlyFee: integer("monthly_fee"),
  certificateFee: integer("certificate_fee"),
  medalFee: integer("medal_fee"),
  trophyFee: integer("trophy_fee"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ProgramPriceType = typeof ProgramPrice.$inferSelect;

export const Enrollment = pgTable("enrollment", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => Student.id),
  programId: integer("program_id").references(() => Program.id),
  status: varchar("status", { length: 255 }),
  programPriceId: integer("program_price_id").references(() => Program.id),
  enrollmentFee: integer("enrollment_fee"),
  enrollmentDate: timestamp("enrollment_date", { withTimezone: true }),
  notes: text("notes"),
});

export const EnrollmentItem = pgTable("enrollment_item", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
  itemType: varchar("item_type", { length: 255 }),
  productId: integer("product_id").references(() => Product.id),
  meetingPackageId: integer("meeting_package_id").references(
    () => MeetingPackage.id
  ),
  quantity: integer("quantity"),
  unit_price: integer("unit_price"),
  total_price: integer("total_price"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const MeetingPackage = pgTable("meeting_package", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }),
  count: integer("count"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const ProductCategory = pgTable("product_category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
});

export const Product = pgTable("product", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => ProductCategory.id),
  name: varchar("name", { length: 255 }),
  price: integer("price"),
  programId: integer("program_id").references(() => Program.id),
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const Payment = pgTable("payment", {
  id: serial("id").primaryKey(),
  amount: integer("amount"),
  status: varchar("status", { length: 255 }),
  method: varchar("method", { length: 255 }),
  paymentDate: timestamp("payment_date", { withTimezone: true }),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const PaymentDetail = pgTable("payment_detail", {
  id: serial("id").primaryKey(),
  paymentId: integer("payment_id").references(() => Payment.id),
  enrollmentItemId: integer("enrollment_item_id").references(
    () => EnrollmentItem.id
  ),
  amount: integer("amount"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const EnrolledProgram = pgTable("enrolled_program", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id").references(() => Enrollment.id),
  programId: integer("program_id").references(() => Program.id),
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

export const programRelations = relations(Program, ({ many }) => ({
  enrollments: many(Enrollment),
  pricings: many(ProgramPrice),
  enrollmentSubjects: many(EnrolledProgram),
  programLevels: many(ProgramLevel),
}));

export const programPriceRelations = relations(
  ProgramPrice,
  ({ one, many }) => ({
    program: one(Program, {
      fields: [ProgramPrice.programId],
      references: [Program.id],
    }),
    payments: many(Payment),
  })
);

export const enrollmentRelations = relations(Enrollment, ({ one, many }) => ({
  student: one(Student, {
    fields: [Enrollment.studentId],
    references: [Student.id],
  }),
  program: one(Program, {
    fields: [Enrollment.programId],
    references: [Program.id],
  }),
  programPrice: one(ProgramPrice, {
    fields: [Enrollment.programPriceId],
    references: [ProgramPrice.id],
  }),
  tutorSchedules: many(Schedule),
  paymentRecords: many(Payment),
  enrollmentItems: many(EnrollmentItem),
}));

export const enrollmentItemRelations = relations(EnrollmentItem, ({ one }) => ({
  enrollment: one(Enrollment, {
    fields: [EnrollmentItem.enrollmentId],
    references: [Enrollment.id],
  }),
  product: one(Product, {
    fields: [EnrollmentItem.productId],
    references: [Product.id],
  }),
  monthlyPackage: one(MeetingPackage, {
    fields: [EnrollmentItem.meetingPackageId],
    references: [MeetingPackage.id],
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

export const enrolledProgramRelations = relations(
  EnrolledProgram,
  ({ one }) => ({
    enrollment: one(Enrollment, {
      fields: [EnrolledProgram.enrollmentId],
      references: [Enrollment.id],
    }),
    program: one(Program, {
      fields: [EnrolledProgram.programId],
      references: [Program.id],
    }),
  })
);

export const meetingPackageRelations = relations(
  MeetingPackage,
  ({ one, many }) => ({
    enrollment: one(Enrollment, {
      fields: [MeetingPackage.id],
      references: [Enrollment.id],
    }),
    enrollmentItems: many(EnrollmentItem),
  })
);

export const levelRelations = relations(Level, ({ many }) => ({
  programLevels: many(ProgramLevel),
}));

export const programLevelRelations = relations(ProgramLevel, ({ one }) => ({
  program: one(Program, {
    fields: [ProgramLevel.programId],
    references: [Program.id],
  }),
  level: one(Level, {
    fields: [ProgramLevel.levelId],
    references: [Level.id],
  }),
}));
