import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  FileText, 
  Wallet, 
  Users, 
  Star,
  Settings,
  LogOut,
  User,
  BarChart3,
  MessageSquare,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  userRole: 'student' | 'teacher' | 'institution' | 'parent' | 'admin';
}

export default function Sidebar({ userRole }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getNavigationItems = () => {
    const baseItems = [
      {
        icon: Home,
        label: "لوحة التحكم",
        href: `/${userRole}`,
        roles: ['student', 'teacher', 'admin']
      },
    ];

    const roleSpecificItems: Record<string, Array<{ icon: any; label: string; href: string }>> = {
      student: [
        { icon: BookOpen, label: "الدورات", href: "/courses" },
        { icon: FileText, label: "الاختبارات", href: "/exams" },
        { icon: Wallet, label: "المحفظة", href: "/wallet" },
        { icon: Users, label: "دعوة الأصدقاء", href: "/invite" },
        { icon: Star, label: "التقييمات", href: "/reviews" },
        { icon: Bell, label: "الإشعارات", href: "/notifications" },
      ],
      teacher: [
        { icon: BookOpen, label: "دوراتي", href: "/my-courses" },
        { icon: FileText, label: "الاختبارات", href: "/my-exams" },
        { icon: Users, label: "الطلاب", href: "/students" },
        { icon: Star, label: "التقييمات", href: "/course-reviews" },
        { icon: BarChart3, label: "الإحصائيات", href: "/analytics" },
      ],
      admin: [
        { icon: Users, label: "إدارة المستخدمين", href: "/manage-users" },
        { icon: BookOpen, label: "إدارة الدورات", href: "/manage-courses" },
        { icon: MessageSquare, label: "الشكاوى", href: "/complaints" },
        { icon: BarChart3, label: "التقارير", href: "/reports" },
        { icon: Settings, label: "الإعدادات", href: "/settings" },
      ],
      institution: [
        { icon: BookOpen, label: "الدورات", href: "/courses" },
        { icon: BarChart3, label: "الإحصائيات", href: "/analytics" },
      ],
      parent: [
        { icon: Users, label: "أطفالي", href: "/children" },
        { icon: BarChart3, label: "التقارير", href: "/reports" },
      ],
    };

    return [
      ...baseItems.filter(item => item.roles.includes(userRole)),
      ...(roleSpecificItems[userRole] || [])
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg border-l border-gray-200 sidebar-rtl">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">أ</span>
          </div>
          <span className="mr-3 text-lg font-bold text-gray-900">الأوائل</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location === item.href || 
                           (item.href !== `/${userRole}` && location.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "nav-active"
                      : "nav-inactive"
                  )}
                >
                  <item.icon className="w-5 h-5 ml-3" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'م'}
              </span>
            </div>
            <div className="mr-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName || user?.email?.split('@')[0] || 'مستخدم'}
              </p>
              <p className="text-xs text-academic-gray">
                {userRole === 'student' ? 'طالب' : 
                 userRole === 'teacher' ? 'معلم' :
                 userRole === 'admin' ? 'مدير' : 'مستخدم'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start text-sm">
              <User className="w-4 h-4 ml-2" />
              الملف الشخصي
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
