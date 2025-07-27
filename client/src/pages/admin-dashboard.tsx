import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, DollarSign, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import UserGrowthChart from "@/components/charts/user-growth-chart";
import RevenueChart from "@/components/charts/revenue-chart";

export default function AdminDashboard() {
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

  const { data: dashboardStats, isLoading: statsLoading, error } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    enabled: !!user && user.role === 'admin',
    retry: false,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
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
  }, [error, toast]);

  if (isLoading || statsLoading) {
    return <LoadingSpinner />;
  }

  if (!user || user.role !== 'admin') {
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

  const stats = dashboardStats || {
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    openComplaints: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Sidebar userRole="admin" />
      
      <div className="main-content-rtl p-8">
        <Header 
          title="لوحة تحكم الإدارة"
          subtitle="إدارة شاملة للمنصة والمستخدمين والمحتوى"
          pointsBalance={0}
          notificationCount={8}
        />

        {/* Admin Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-academic-success mt-1">+8.2% من الشهر الماضي</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">الدورات النشطة</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalCourses}</p>
                  <p className="text-xs text-academic-success mt-1">+3 دورات جديدة</p>
                </div>
                <div className="w-12 h-12 bg-academic-success/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-academic-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">الإيرادات الشهرية</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRevenue.toLocaleString()} ج.س</p>
                  <p className="text-xs text-academic-success mt-1">+12.5% نمو</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-academic-gray">الشكاوى المفتوحة</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.openComplaints}</p>
                  <p className="text-xs text-red-500 mt-1">تحتاج متابعة</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">نمو المستخدمين</h3>
              <UserGrowthChart />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الإيرادات</h3>
              <RevenueChart />
            </CardContent>
          </Card>
        </div>

        {/* Management Actions */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إدارة المستخدمين</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  عرض جميع المستخدمين
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  إدارة الأدوار والصلاحيات
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  تصدير بيانات المستخدمين
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">إدارة المحتوى</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  مراجعة الدورات الجديدة
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  إدارة التقييمات والمراجعات
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  إعدادات المنصة
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الدعم والتقارير</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  الشكاوى والدعم الفني
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  تقارير الأداء
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  سجل النشاط
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
