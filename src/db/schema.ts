import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
  varchar,
  uniqueIndex,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

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

export const Student = pgTable(
  "student",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    nickname: text("nickname").notNull(),
    email: text("email"),
    phoneNumber: varchar("phone_number", { length: 20 }),
    dateOfBirth: timestamp("date_of_birth", { withTimezone: true }).notNull(),
    address: text("address").notNull(),
    isActive: boolean("is_active").default(true),
    notes: text("notes"),
    additionalInfo: text("additional_info"),
    isDeleted: boolean("is_deleted").default(false),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("unique_student_idx").on(t.name),
    index("student_name_idx").on(t.name),
  ],
);

export const studentSchema = createSelectSchema(Student);

export const Guardian = pgTable(
  "guardian",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: text("email"),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull().unique(),
    address: text("address"),
    occupation: varchar("occupation", { length: 255 }),
    isPrimary: boolean("is_primary").default(false),
    isActive: boolean("is_active").default(true),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("unique_guardian_idx")
      .on(t.id)
      .where(sql`is_primary = true`),
  ],
);

export const StudentGuardian = pgTable(
  "student_guardian",
  {
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
  },
  (t) => [
    uniqueIndex("unique_student_guardian_idx").on(t.studentId, t.guardianId),
  ],
);

export type StudentType = typeof Student.$inferSelect;

export const Program = pgTable(
  "program",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("program_name_idx").on(t.name)],
);

export const ProgramExtra = pgTable(
  "program_extra",
  {
    id: serial("id").primaryKey(),
    programId: integer("program_id").references(() => Program.id),
    type: varchar("type", { length: 255 }).notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("program_extra_program_id_type_idx").on(t.programId, t.type),
  ],
);

export const EnrollmentStatus = pgEnum("enrollment_status", [
  "active",
  "inactive",
  "completed",
]);

export const Enrollment = pgTable(
  "enrollment",
  {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").references(() => Student.id),
    programId: integer("program_id").references(() => Program.id),
    orderId: integer("order_id").references(() => Order.id),
    meetingPackageId: integer("meeting_package_id").references(
      () => MeetingPackage.id,
    ),
    meetingQty: integer("meeting_qty").notNull(),
    meetingLeft: integer("meeting_left").notNull(),
    enrollmentDate: timestamp("enrollment_date", { withTimezone: true }),
    status: EnrollmentStatus("status").default("active"),
    notes: text("notes"),
  },
  (t) => [
    index("student_idx").on(t.studentId),
    index("program_idx").on(t.programId),
    index("package_idx").on(t.meetingPackageId),
  ],
);

export type EnrollmentInsert = typeof Enrollment.$inferInsert;

export const MeetingPackage = pgTable(
  "meeting_package",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    count: integer("count").notNull(),
    price: integer("price").notNull(),
    discount: integer("discount").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("meeteng_package_name_idx").on(t.name)],
);

export const ProductStatus = pgEnum("product_status", ["active", "inactive"]);

export const Product = pgTable(
  "product",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }),
    price: integer("price").notNull(),
    stockQuantity: integer("stock_quantity"),
    status: ProductStatus("status"),
    description: text("description"),
  },
  (t) => [index("product_name_idx").on(t.name)],
);

export type ProductInsert = typeof Product.$inferInsert;

export const OrderStatus = pgEnum("order_status", [
  "pending",
  "completed",
  "cancelled",
]);

export const Order = pgTable("order", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => Student.id),
  status: OrderStatus("status"),
  orderDate: timestamp("order_date", { withTimezone: true }),
  totalAmount: integer("total_amount").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type OrderInsert = typeof Order.$inferInsert;

export const OrderDetail = pgTable("order_detail", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => Order.id),
  productId: integer("product_id").references(() => Product.id),
  programId: integer("program_id").references(() => Program.id),
  packageId: integer("package_id").references(() => MeetingPackage.id),
  extraId: integer("extra_id").references(() => ProgramExtra.id),
  quantity: integer("quantity"),
  price: integer("price"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type OrderDetailInsert = typeof OrderDetail.$inferInsert;

export const Payment = pgTable("payment", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => Order.id),
  amount: integer("amount"),
  paymentDate: timestamp("payment_date", { withTimezone: true }),
  paymentMethod: varchar("payment_method", { length: 255 }),
  status: OrderStatus("status"),
  purpose: varchar("purpose", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const MeetingStatus = pgEnum("meeting_status", [
  "scheduled",
  "inprogress",
  "completed",
  "cancelled",
  "postponed",
]);

export const MeetingType = pgEnum("meeting_type", ["scheduled", "walk-in"]);

export const Meeting = pgTable("meeting", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .references(() => Student.id)
    .notNull(),
  programId: integer("program_id")
    .references(() => Program.id)
    .notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  location: varchar("location", { length: 255 }),
  type: MeetingType("type").default("scheduled"),
  status: MeetingStatus("status"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type MeetingInsert = typeof Meeting.$inferInsert;
export type MeetingType = typeof Meeting.$inferSelect;

export const MeetingSession = pgTable("meeting_session", {
  id: serial("id").primaryKey(),
  meetingId: integer("meeting_id")
    .references(() => Meeting.id)
    .unique(),
  tutorId: text("tutor_id").references(() => user.id),
  checkInTime: timestamp("check_in_time", { withTimezone: true }),
  checkOutTime: timestamp("check_out_time", { withTimezone: true }),
  duration: integer("duration"),
  status: MeetingStatus("status"),
  studentAttendance: boolean("student_attendance"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type MeetingSessionInsert = typeof MeetingSession.$inferInsert;

export const BookStatus = pgEnum("book_status", [
  "pending",
  "prepared",
  "paid",
  "delivered",
]);

export const BookPreparationStatus = pgTable("book_preparation_status", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => Student.id),
  programId: integer("program_id").references(() => Program.id),
  prepareDate: timestamp("prepare_date", { withTimezone: true }),
  paidDate: timestamp("paid_date", { withTimezone: true }),
  status: BookStatus("status"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Relations start here
export const userRelations = relations(user, ({ many }) => ({
  meetingSessions: many(MeetingSession),
  orders: many(Order),
  enrollements: many(Enrollment),
}));

export const studentRelations = relations(Student, ({ many }) => ({
  meetings: many(Meeting),
  bookPreparations: many(BookPreparationStatus),
  guardians: many(StudentGuardian),
}));

export const guardianRelations = relations(Guardian, ({ many }) => ({
  students: many(StudentGuardian),
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
  }),
);

export const programRelations = relations(Program, ({ many }) => ({
  enrollments: many(Enrollment),
  meetings: many(Meeting),
  bookPreparations: many(BookPreparationStatus),
  extra: many(ProgramExtra),
}));

export const programExtraRelations = relations(ProgramExtra, ({ one }) => ({
  program: one(Program, {
    fields: [ProgramExtra.programId],
    references: [Program.id],
  }),
}));

export const enrollementRelations = relations(Enrollment, ({ one }) => ({
  student: one(Student, {
    fields: [Enrollment.studentId],
    references: [Student.id],
  }),
  program: one(Program, {
    fields: [Enrollment.programId],
    references: [Program.id],
  }),
  meetingPackage: one(MeetingPackage, {
    fields: [Enrollment.meetingPackageId],
    references: [MeetingPackage.id],
  }),
  order: one(Order, {
    fields: [Enrollment.orderId],
    references: [Order.id],
  }),
}));

export const OrderRelations = relations(Order, ({ one, many }) => ({
  student: one(Student, {
    fields: [Order.studentId],
    references: [Student.id],
  }),
  details: many(OrderDetail),
}));

export const OrderDetailRelations = relations(OrderDetail, ({ one }) => ({
  order: one(Order, {
    fields: [OrderDetail.orderId],
    references: [Order.id],
  }),
  product: one(Product, {
    fields: [OrderDetail.productId],
    references: [Product.id],
  }),
  program: one(Program, {
    fields: [OrderDetail.programId],
    references: [Program.id],
  }),
  package: one(MeetingPackage, {
    fields: [OrderDetail.packageId],
    references: [MeetingPackage.id],
  }),
  extra: one(ProgramExtra, {
    fields: [OrderDetail.extraId],
    references: [ProgramExtra.id],
  }),
}));

export const paymentRelations = relations(Payment, ({ one }) => ({
  order: one(Order, {
    fields: [Payment.orderId],
    references: [Order.id],
  }),
}));

export const meetingRelations = relations(Meeting, ({ one, many }) => ({
  student: one(Student, {
    fields: [Meeting.studentId],
    references: [Student.id],
  }),
  program: one(Program, {
    fields: [Meeting.programId],
    references: [Program.id],
  }),
  sessions: many(MeetingSession),
}));

export const meetingSessionRelations = relations(MeetingSession, ({ one }) => ({
  meeting: one(Meeting, {
    fields: [MeetingSession.meetingId],
    references: [Meeting.id],
  }),
  tutor: one(user, {
    fields: [MeetingSession.tutorId],
    references: [user.id],
  }),
}));

export const bookPreparationStatusRelations = relations(
  BookPreparationStatus,
  ({ one }) => ({
    student: one(Student, {
      fields: [BookPreparationStatus.studentId],
      references: [Student.id],
    }),
    program: one(Program, {
      fields: [BookPreparationStatus.programId],
      references: [Program.id],
    }),
  }),
);
