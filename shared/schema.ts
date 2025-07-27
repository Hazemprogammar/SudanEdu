import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (Required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (Required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["student", "teacher", "institution", "parent", "admin"] }).default("student"),
  pointsBalance: integer("points_balance").default(0),
  referralCode: varchar("referral_code").unique(),
  referredBy: varchar("referred_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  teacherId: varchar("teacher_id").references(() => users.id),
  pointsCost: integer("points_cost").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  progress: integer("progress").default(0),
});

export const exams = pgTable("exams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  courseId: varchar("course_id").references(() => courses.id),
  duration: integer("duration").notNull(), // in minutes
  totalPoints: integer("total_points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  examId: varchar("exam_id").references(() => exams.id),
  question: text("question").notNull(),
  options: jsonb("options"), // Array of options
  correctAnswer: varchar("correct_answer"),
  points: integer("points").default(1),
  order: integer("order"),
});

export const examAttempts = pgTable("exam_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id),
  examId: varchar("exam_id").references(() => exams.id),
  answers: jsonb("answers"), // Object with questionId: answer
  score: integer("score").default(0),
  totalPoints: integer("total_points").default(0),
  completedAt: timestamp("completed_at"),
  startedAt: timestamp("started_at").defaultNow(),
});

export const pointsTransactions = pgTable("points_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  amount: integer("amount").notNull(),
  type: varchar("type", { enum: ["earned", "spent", "purchased", "transferred_in", "transferred_out"] }).notNull(),
  description: text("description"),
  referenceId: varchar("reference_id"), // Could be exam_id, course_id, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").references(() => users.id),
  referredId: varchar("referred_id").references(() => users.id),
  pointsEarned: integer("points_earned").default(50),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  status: varchar("status", { enum: ["open", "in_progress", "resolved", "closed"] }).default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { enum: ["grade", "activity", "points", "invite", "general"] }).notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses),
  enrollments: many(enrollments),
  examAttempts: many(examAttempts),
  pointsTransactions: many(pointsTransactions),
  referralsGiven: many(referrals, { relationName: "referrer" }),
  referralsReceived: many(referrals, { relationName: "referred" }),
  reviews: many(reviews),
  complaints: many(complaints),
  notifications: many(notifications),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  teacher: one(users, { fields: [courses.teacherId], references: [users.id] }),
  enrollments: many(enrollments),
  exams: many(exams),
  reviews: many(reviews),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, { fields: [enrollments.studentId], references: [users.id] }),
  course: one(courses, { fields: [enrollments.courseId], references: [courses.id] }),
}));

export const examsRelations = relations(exams, ({ one, many }) => ({
  course: one(courses, { fields: [exams.courseId], references: [courses.id] }),
  questions: many(questions),
  attempts: many(examAttempts),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  exam: one(exams, { fields: [questions.examId], references: [exams.id] }),
}));

export const examAttemptsRelations = relations(examAttempts, ({ one }) => ({
  student: one(users, { fields: [examAttempts.studentId], references: [users.id] }),
  exam: one(exams, { fields: [examAttempts.examId], references: [exams.id] }),
}));

export const pointsTransactionsRelations = relations(pointsTransactions, ({ one }) => ({
  user: one(users, { fields: [pointsTransactions.userId], references: [users.id] }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, { fields: [referrals.referrerId], references: [users.id], relationName: "referrer" }),
  referred: one(users, { fields: [referrals.referredId], references: [users.id], relationName: "referred" }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  student: one(users, { fields: [reviews.studentId], references: [users.id] }),
  course: one(courses, { fields: [reviews.courseId], references: [courses.id] }),
}));

export const complaintsRelations = relations(complaints, ({ one }) => ({
  user: one(users, { fields: [complaints.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertExamSchema = createInsertSchema(exams).omit({
  id: true,
  createdAt: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
});

export const insertExamAttemptSchema = createInsertSchema(examAttempts).omit({
  id: true,
  startedAt: true,
});

export const insertPointsTransactionSchema = createInsertSchema(pointsTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Exam = typeof exams.$inferSelect;
export type InsertExam = z.infer<typeof insertExamSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type ExamAttempt = typeof examAttempts.$inferSelect;
export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;
export type PointsTransaction = typeof pointsTransactions.$inferSelect;
export type InsertPointsTransaction = z.infer<typeof insertPointsTransactionSchema>;
export type Referral = typeof referrals.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
