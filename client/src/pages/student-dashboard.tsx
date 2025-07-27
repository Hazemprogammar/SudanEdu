import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Star, Users } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function StudentDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "غير مصرح",
        description: "تم تسجيل خروجك. جاري تسجيل الدخول مرة أخرى...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/students', user?.id, 'enrollments'],
    enabled: !!user?.id,
    retry: false,
  });

  const { data: walletBalance, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/wallet/balance'],
    enabled: !!user?.id,
    retry: false,
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: !!user?.id,
    retry: false,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  // Mock data for demonstration - replace with real data when available
  const mockStats = {
    enrolledCourses: enrollments?.length || 12,
    completedExams: 28,
    averageGrade: 87,
    referredFriends: 15,
  };

  const mockRecentCourses = [
    {
      id: '1',
      title: 'الرياضيات المتقدمة',
      image: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=80&h=80&fit=crop',
      progress: 42,
      lesson: '5 من 12',
    },
    {
      id: '2', 
      title: 'الفيزياء التطبيقية',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=80&h=80&fit=crop',
      progress: 53,
      lesson: '8 من 15',
    },
    {
      id: '3',
      title: 'الكيمياء العضوية', 
      image: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=80&h=80&fit=crop',
      progress: 30,
      lesson: '3 من 10',
    },
  ];

  const mockRecentActivity = [
    {
      id: '1',
      type: 'success',
      title: 'اكتملت اختبار الرياضيات بنجاح',
      time: 'منذ ساعتين - حصلت على 85 نقطة',
    },
    {
      id: '2',
      type: 'primary',
      title: 'بدأت دورة جديدة في الفيزياء',
      time: 'أمس - الفصل الأول: المفاهيم الأساسية',
    },
    {
      id: '3',
      type: 'yellow',
      title: 'تم دعوة صديق جديد بنجاح',
      time: 'منذ 3 أيام - حصلت على 50 نقطة إضافية',
    },
    {
      id: '4',
      type: 'purple',
      title: 'تم تقييم دورة الكيمياء',
      time: 'منذ أسبوع - قيمت بـ 5 نجوم',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Sidebar userRole="student" />
      
      <div className="main-content-rtl p-8">
        <Header 
          title={`مرحباً ${user.firstName || 'أحمد'} 👋`}
          subtitle="إليك ملخص نشاطك التعليمي اليوم"
          pointsBalance={walletBalance?.balance || 2450}
          notificationCount={notifications?.filter((n: any) => !n.isRead).length || 3}
        />

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">الدورات المسجلة</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.enrolledCourses}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">الاختبارات المكتملة</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.completedExams}</p>
                </div>
                <div className="w-12 h-12 bg-academic-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-academic-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">المعدل العام</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.averageGrade}%</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">الأصدقاء المدعوون</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.referredFriends}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses and Activities */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Courses */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الدورات الحالية</h3>
              <div className="space-y-4">
                {mockRecentCourses.map((course) => (
                  <div key={course.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-12 h-12 rounded-lg object-cover ml-3" 
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-academic-gray">الدرس {course.lesson}</p>
                      <Progress value={course.progress} className="mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
              <div className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className={`w-2 h-2 rounded-full mt-2 ml-3 ${
                      activity.type === 'success' ? 'bg-academic-success' :
                      activity.type === 'primary' ? 'bg-primary' :
                      activity.type === 'yellow' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{activity.title}</p>
                      <p className="text-xs text-academic-gray">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
