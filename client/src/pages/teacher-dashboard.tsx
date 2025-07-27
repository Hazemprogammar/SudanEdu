import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Star, FileText } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function TeacherDashboard() {
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'teacher') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح</h1>
            <p className="text-academic-gray">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mockStats = {
    activeCourses: 8,
    totalStudents: 247,
    overallRating: 4.8,
    newExams: 12,
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Sidebar userRole="teacher" />
      
      <div className="main-content-rtl p-8">
        <Header 
          title={`مرحباً ${user.firstName || 'دكتور'} 👨‍🏫`}
          subtitle="إدارة الدورات والطلاب وتتبع الأداء"
          pointsBalance={0}
          notificationCount={5}
        />

        {/* Teacher Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">الدورات النشطة</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.activeCourses}</p>
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
                  <p className="text-sm text-academic-gray">إجمالي الطلاب</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-academic-success/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-academic-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">التقييم العام</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.overallRating}</p>
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
                  <p className="text-sm text-academic-gray">الاختبارات الجديدة</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.newExams}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses and Student Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Courses */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">دوراتي</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">الرياضيات المتقدمة</h4>
                    <p className="text-sm text-academic-gray">45 طالب مسجل</p>
                  </div>
                  <div className="text-academic-success text-sm font-medium">نشطة</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">الفيزياء التطبيقية</h4>
                    <p className="text-sm text-academic-gray">38 طالب مسجل</p>
                  </div>
                  <div className="text-academic-success text-sm font-medium">نشطة</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">الكيمياء العضوية</h4>
                    <p className="text-sm text-academic-gray">52 طالب مسجل</p>
                  </div>
                  <div className="text-academic-success text-sm font-medium">نشطة</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Student Activity */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">نشاط الطلاب الأخير</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-academic-success rounded-full mt-2 ml-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">أحمد محمد اكتمل اختبار الرياضيات</p>
                    <p className="text-xs text-academic-gray">منذ ساعة - درجة 92%</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 ml-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">سارة علي بدأت الدرس الثالث في الفيزياء</p>
                    <p className="text-xs text-academic-gray">منذ ساعتين</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 ml-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">محمد أحمد قيم دورة الكيمياء بـ 5 نجوم</p>
                    <p className="text-xs text-academic-gray">منذ 3 ساعات</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">فاطمة حسن سجلت في دورة الرياضيات</p>
                    <p className="text-xs text-academic-gray">أمس</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
