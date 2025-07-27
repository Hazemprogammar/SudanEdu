import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertCourseSchema,
  insertExamSchema,
  insertQuestionSchema,
  insertExamAttemptSchema,
  insertPointsTransactionSchema,
  insertComplaintSchema,
  insertNotificationSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Course routes
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'teacher' && user?.role !== 'admin') {
        return res.status(403).json({ message: "Only teachers and admins can create courses" });
      }

      const courseData = insertCourseSchema.parse({ ...req.body, teacherId: userId });
      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Exam routes
  app.get('/api/courses/:courseId/exams', async (req, res) => {
    try {
      const exams = await storage.getExamsByCourse(req.params.courseId);
      res.json(exams);
    } catch (error) {
      console.error("Error fetching exams:", error);
      res.status(500).json({ message: "Failed to fetch exams" });
    }
  });

  app.get('/api/exams/:id', async (req, res) => {
    try {
      const exam = await storage.getExam(req.params.id);
      if (!exam) {
        return res.status(404).json({ message: "Exam not found" });
      }
      res.json(exam);
    } catch (error) {
      console.error("Error fetching exam:", error);
      res.status(500).json({ message: "Failed to fetch exam" });
    }
  });

  app.get('/api/exams/:id/questions', async (req, res) => {
    try {
      const questions = await storage.getQuestionsByExam(req.params.id);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  app.post('/api/exams/:id/attempt', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const examId = req.params.id;
      
      const attempt = await storage.createExamAttempt({
        studentId: userId,
        examId,
        answers: {},
        score: 0,
        totalPoints: 0,
      });
      
      res.json(attempt);
    } catch (error) {
      console.error("Error starting exam attempt:", error);
      res.status(500).json({ message: "Failed to start exam attempt" });
    }
  });

  app.patch('/api/exam-attempts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const attemptId = req.params.id;
      
      const existingAttempt = await storage.getExamAttempt(attemptId);
      if (!existingAttempt || existingAttempt.studentId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to exam attempt" });
      }

      const attemptData = insertExamAttemptSchema.partial().parse(req.body);
      const updatedAttempt = await storage.updateExamAttempt(attemptId, attemptData);

      // Award points if exam is completed
      if (attemptData.completedAt && attemptData.score) {
        await storage.createPointsTransaction({
          userId,
          amount: attemptData.score,
          type: 'earned',
          description: 'Exam completion bonus',
          referenceId: existingAttempt.examId,
        });

        // Create notification
        await storage.createNotification({
          userId,
          title: 'تم إكمال الاختبار',
          message: `لقد حصلت على ${attemptData.score} نقطة من الاختبار`,
          type: 'grade',
        });
      }

      res.json(updatedAttempt);
    } catch (error) {
      console.error("Error updating exam attempt:", error);
      res.status(500).json({ message: "Failed to update exam attempt" });
    }
  });

  // Points and wallet routes
  app.get('/api/wallet/balance', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const balance = await storage.getUserPointsBalance(userId);
      res.json({ balance });
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      res.status(500).json({ message: "Failed to fetch wallet balance" });
    }
  });

  app.get('/api/wallet/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getPointsTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/wallet/purchase', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount } = req.body;
      
      // For now, we'll assume the purchase is successful
      // In a real implementation, this would integrate with a payment gateway
      const transaction = await storage.createPointsTransaction({
        userId,
        amount: amount || 1000,
        type: 'purchased',
        description: 'Points purchase',
      });

      // Create notification
      await storage.createNotification({
        userId,
        title: 'تم شراء النقاط',
        message: `تم إضافة ${amount || 1000} نقطة إلى محفظتك`,
        type: 'points',
      });

      res.json(transaction);
    } catch (error) {
      console.error("Error purchasing points:", error);
      res.status(500).json({ message: "Failed to purchase points" });
    }
  });

  app.post('/api/wallet/transfer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { toUserId, amount, description } = req.body;

      await storage.transferPoints(userId, toUserId, amount, description);

      // Create notifications for both users
      await storage.createNotification({
        userId,
        title: 'تم تحويل النقاط',
        message: `تم تحويل ${amount} نقطة بنجاح`,
        type: 'points',
      });

      await storage.createNotification({
        userId: toUserId,
        title: 'تم استلام النقاط',
        message: `تم استلام ${amount} نقطة من مستخدم آخر`,
        type: 'points',
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error transferring points:", error);
      res.status(500).json({ message: error?.message || "Failed to transfer points" });
    }
  });

  // Referral routes
  app.get('/api/referrals/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getReferralStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ message: "Failed to fetch referral stats" });
    }
  });

  app.post('/api/referrals/register/:referralCode', async (req, res) => {
    try {
      const { referralCode } = req.params;
      const { newUserId } = req.body;

      // Find the referrer by their referral code
      const referrer = await storage.getUser(referralCode);
      if (!referrer) {
        return res.status(404).json({ message: "Invalid referral code" });
      }

      await storage.createReferral(referrer.id, newUserId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error processing referral:", error);
      res.status(500).json({ message: "Failed to process referral" });
    }
  });

  // Review routes
  app.post('/api/courses/:courseId/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = req.params.courseId;
      const { rating, comment } = req.body;

      const review = await storage.createReview({
        studentId: userId,
        courseId,
        rating,
        comment,
      });

      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/courses/:courseId/reviews', async (req, res) => {
    try {
      const reviews = await storage.getReviewsByCourse(req.params.courseId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Complaint routes
  app.post('/api/complaints', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const complaintData = insertComplaintSchema.parse({ ...req.body, userId });
      const complaint = await storage.createComplaint(complaintData);
      res.json(complaint);
    } catch (error) {
      console.error("Error creating complaint:", error);
      res.status(500).json({ message: "Failed to create complaint" });
    }
  });

  app.get('/api/complaints', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Admins can see all complaints, others see only their own
      const complaints = user?.role === 'admin' 
        ? await storage.getComplaints()
        : await storage.getComplaints(userId);
      
      res.json(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  // Admin routes - only accessible by admins
  app.post('/api/admin/users/promote', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin role required." });
      }

      const { userId, newRole } = req.body;
      if (!userId || !newRole) {
        return res.status(400).json({ message: "userId and newRole are required" });
      }

      const targetUser = await storage.getUser(userId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.updateUserRole(userId, newRole);
      res.json(updatedUser);
    } catch (error: any) {
      console.error("Error promoting user:", error);
      res.status(500).json({ message: error?.message || "Failed to promote user" });
    }
  });

  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin role required." });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: error?.message || "Failed to fetch users" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Enrollment routes
  app.post('/api/courses/:courseId/enroll', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = req.params.courseId;

      await storage.enrollStudent(userId, courseId);
      
      await storage.createNotification({
        userId,
        title: 'تم التسجيل في الدورة',
        message: 'تم تسجيلك بنجاح في دورة جديدة',
        type: 'activity',
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error enrolling student:", error);
      res.status(500).json({ message: "Failed to enroll student" });
    }
  });

  app.get('/api/students/:studentId/enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const studentId = req.params.studentId;

      // Users can only see their own enrollments unless they're admin
      const user = await storage.getUser(userId);
      if (user?.role !== 'admin' && userId !== studentId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const enrollments = await storage.getStudentEnrollments(studentId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Admin dashboard routes
  app.get('/api/admin/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
