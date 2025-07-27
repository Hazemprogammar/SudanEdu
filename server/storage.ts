import {
  users,
  courses,
  exams,
  questions,
  examAttempts,
  pointsTransactions,
  referrals,
  reviews,
  complaints,
  notifications,
  enrollments,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type Exam,
  type InsertExam,
  type Question,
  type InsertQuestion,
  type ExamAttempt,
  type InsertExamAttempt,
  type PointsTransaction,
  type InsertPointsTransaction,
  type Referral,
  type Review,
  type Complaint,
  type InsertComplaint,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, role: string): Promise<User>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course>;
  
  // Exam operations
  getExamsByCourse(courseId: string): Promise<Exam[]>;
  getExam(id: string): Promise<Exam | undefined>;
  createExam(exam: InsertExam): Promise<Exam>;
  
  // Question operations
  getQuestionsByExam(examId: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Exam attempt operations
  createExamAttempt(attempt: InsertExamAttempt): Promise<ExamAttempt>;
  getExamAttempt(id: string): Promise<ExamAttempt | undefined>;
  updateExamAttempt(id: string, attempt: Partial<InsertExamAttempt>): Promise<ExamAttempt>;
  
  // Points operations
  getUserPointsBalance(userId: string): Promise<number>;
  createPointsTransaction(transaction: InsertPointsTransaction): Promise<PointsTransaction>;
  getPointsTransactions(userId: string): Promise<PointsTransaction[]>;
  transferPoints(fromUserId: string, toUserId: string, amount: number, description?: string): Promise<void>;
  
  // Referral operations
  createReferral(referrerId: string, referredId: string): Promise<Referral>;
  getReferralStats(userId: string): Promise<{ totalInvites: number; successfulInvites: number; pointsEarned: number }>;
  
  // Review operations
  createReview(review: { studentId: string; courseId: string; rating: number; comment?: string }): Promise<Review>;
  getReviewsByCourse(courseId: string): Promise<Review[]>;
  
  // Complaint operations
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  getComplaints(userId?: string): Promise<Complaint[]>;
  updateComplaintStatus(id: string, status: string): Promise<Complaint>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Enrollment operations
  enrollStudent(studentId: string, courseId: string): Promise<void>;
  getStudentEnrollments(studentId: string): Promise<Course[]>;
  
  // Dashboard analytics
  getDashboardStats(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    openComplaints: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Generate referral code if not provided
    if (!userData.referralCode) {
      userData.referralCode = `REF_${randomUUID().slice(0, 8).toUpperCase()}`;
    }

    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isActive, true)).orderBy(desc(courses.createdAt));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set(course)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  // Exam operations
  async getExamsByCourse(courseId: string): Promise<Exam[]> {
    return await db.select().from(exams).where(eq(exams.courseId, courseId));
  }

  async getExam(id: string): Promise<Exam | undefined> {
    const [exam] = await db.select().from(exams).where(eq(exams.id, id));
    return exam;
  }

  async createExam(exam: InsertExam): Promise<Exam> {
    const [newExam] = await db.insert(exams).values(exam).returning();
    return newExam;
  }

  // Question operations
  async getQuestionsByExam(examId: string): Promise<Question[]> {
    return await db.select().from(questions).where(eq(questions.examId, examId)).orderBy(questions.order);
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db.insert(questions).values(question).returning();
    return newQuestion;
  }

  // Exam attempt operations
  async createExamAttempt(attempt: InsertExamAttempt): Promise<ExamAttempt> {
    const [newAttempt] = await db.insert(examAttempts).values(attempt).returning();
    return newAttempt;
  }

  async getExamAttempt(id: string): Promise<ExamAttempt | undefined> {
    const [attempt] = await db.select().from(examAttempts).where(eq(examAttempts.id, id));
    return attempt;
  }

  async updateExamAttempt(id: string, attempt: Partial<InsertExamAttempt>): Promise<ExamAttempt> {
    const [updatedAttempt] = await db
      .update(examAttempts)
      .set(attempt)
      .where(eq(examAttempts.id, id))
      .returning();
    return updatedAttempt;
  }

  // Points operations
  async getUserPointsBalance(userId: string): Promise<number> {
    const user = await this.getUser(userId);
    return user?.pointsBalance || 0;
  }

  async createPointsTransaction(transaction: InsertPointsTransaction): Promise<PointsTransaction> {
    const [newTransaction] = await db.insert(pointsTransactions).values(transaction).returning();
    
    // Update user's points balance
    const balanceChange = transaction.type === 'spent' || transaction.type === 'transferred_out' 
      ? -transaction.amount 
      : transaction.amount;
    
    await db
      .update(users)
      .set({ pointsBalance: sql`${users.pointsBalance} + ${balanceChange}` })
      .where(eq(users.id, transaction.userId));

    return newTransaction;
  }

  async getPointsTransactions(userId: string): Promise<PointsTransaction[]> {
    return await db
      .select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.userId, userId))
      .orderBy(desc(pointsTransactions.createdAt));
  }

  async transferPoints(fromUserId: string, toUserId: string, amount: number, description?: string): Promise<void> {
    // Check if sender has enough points
    const senderBalance = await this.getUserPointsBalance(fromUserId);
    if (senderBalance < amount) {
      throw new Error('Insufficient points balance');
    }

    // Create transactions for both users
    await this.createPointsTransaction({
      userId: fromUserId,
      amount,
      type: 'transferred_out',
      description: description || `Transfer to user ${toUserId}`,
    });

    await this.createPointsTransaction({
      userId: toUserId,
      amount,
      type: 'transferred_in',
      description: description || `Transfer from user ${fromUserId}`,
    });
  }

  // Referral operations
  async createReferral(referrerId: string, referredId: string): Promise<Referral> {
    const [referral] = await db.insert(referrals).values({
      referrerId,
      referredId,
      pointsEarned: 50,
    }).returning();

    // Award points to referrer
    await this.createPointsTransaction({
      userId: referrerId,
      amount: 50,
      type: 'earned',
      description: 'Referral bonus',
      referenceId: referral.id,
    });

    return referral;
  }

  async getReferralStats(userId: string): Promise<{ totalInvites: number; successfulInvites: number; pointsEarned: number }> {
    const referralsResult = await db
      .select({
        count: sql<number>`count(*)`,
        totalPoints: sql<number>`sum(${referrals.pointsEarned})`,
      })
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    const result = referralsResult[0];
    return {
      totalInvites: result.count || 0,
      successfulInvites: result.count || 0,
      pointsEarned: result.totalPoints || 0,
    };
  }

  // Review operations
  async createReview(review: { studentId: string; courseId: string; rating: number; comment?: string }): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReviewsByCourse(courseId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.courseId, courseId));
  }

  // Complaint operations
  async createComplaint(complaint: InsertComplaint): Promise<Complaint> {
    const [newComplaint] = await db.insert(complaints).values(complaint).returning();
    return newComplaint;
  }

  async getComplaints(userId?: string): Promise<Complaint[]> {
    const query = db.select().from(complaints);
    if (userId) {
      return await query.where(eq(complaints.userId, userId)).orderBy(desc(complaints.createdAt));
    }
    return await query.orderBy(desc(complaints.createdAt));
  }

  async updateComplaintStatus(id: string, status: "open" | "in_progress" | "resolved" | "closed"): Promise<Complaint> {
    const [updatedComplaint] = await db
      .update(complaints)
      .set({ status, updatedAt: new Date() })
      .where(eq(complaints.id, id))
      .returning();
    return updatedComplaint;
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  // Enrollment operations
  async enrollStudent(studentId: string, courseId: string): Promise<void> {
    await db.insert(enrollments).values({
      studentId,
      courseId,
    });
  }

  async getStudentEnrollments(studentId: string): Promise<Course[]> {
    const enrolledCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        teacherId: courses.teacherId,
        pointsCost: courses.pointsCost,
        isActive: courses.isActive,
        createdAt: courses.createdAt,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.studentId, studentId));

    return enrolledCourses;
  }

  // Dashboard analytics
  async getDashboardStats(): Promise<{
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    openComplaints: number;
  }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
    const [complaintCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(complaints)
      .where(eq(complaints.status, 'open'));

    // Calculate revenue from points purchases (assuming 1000 points = 99 SDG)
    const [revenueResult] = await db
      .select({ total: sql<number>`sum(${pointsTransactions.amount})` })
      .from(pointsTransactions)
      .where(eq(pointsTransactions.type, 'purchased'));

    const totalPointsPurchased = revenueResult.total || 0;
    const totalRevenue = Math.floor((totalPointsPurchased / 1000) * 99);

    return {
      totalUsers: userCount.count,
      totalCourses: courseCount.count,
      totalRevenue,
      openComplaints: complaintCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
