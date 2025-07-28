import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, Users, Star } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">أ</span>
                </div>
                <span className="mr-3 text-xl font-bold text-gray-900">الأوائل</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="text-academic-gray hover:text-gray-900 px-3 py-2 text-sm font-medium">المنصة</button>
              <button className="text-academic-gray hover:text-gray-900 px-3 py-2 text-sm font-medium">الدورات</button>
              <button className="text-academic-gray hover:text-gray-900 px-3 py-2 text-sm font-medium">من نحن</button>
              <Button onClick={handleLogin} className="btn-primary">
                تسجيل الدخول
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative academic-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              منصة تعليمية متطورة
              <span className="block text-primary-foreground">للطلاب السودانيين</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              انضم إلى آلاف الطلاب في رحلة التعلم الرقمي. دورات تفاعلية، اختبارات ذكية، ونظام نقاط محفز للتعلم المستمر
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleLogin} size="lg" className="bg-white text-primary hover:bg-gray-100">
                ابدأ التعلم الآن
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                تعرف على المنصة
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لماذا منصة الأوائل؟</h2>
            <p className="text-xl text-academic-gray">مصممة خصيصاً لاحتياجات الطلاب في السودان</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">دورات تفاعلية</h3>
                <p className="text-academic-gray">محتوى تعليمي عالي الجودة مع أنشطة تفاعلية وتقييمات مستمرة</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-academic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-academic-success" />
                </div>
                <h3 className="text-xl font-semibold mb-3">نظام النقاط</h3>
                <p className="text-academic-gray">اكسب نقاط من إنجازاتك وأنشطتك واستخدمها في شراء الدورات</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">دعوة الأصدقاء</h3>
                <p className="text-academic-gray">ادع أصدقاءك للانضمام واحصل على نقاط إضافية لكل دعوة ناجحة</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-academic-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">12,547</div>
              <div className="text-academic-gray">طالب مسجل</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">156</div>
              <div className="text-academic-gray">دورة متاحة</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">8,429</div>
              <div className="text-academic-gray">اختبار مكتمل</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.8</div>
              <div className="text-academic-gray flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                تقييم المنصة
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">ابدأ رحلتك التعليمية اليوم</h2>
          <p className="text-xl text-white/90 mb-8">انضم إلى آلاف الطلاب واكتشف عالماً جديداً من التعلم الرقمي</p>
          <Button onClick={handleLogin} size="lg" className="bg-white text-primary hover:bg-gray-100">
            انضم إلينا مجاناً
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">أ</span>
                </div>
                <span className="mr-3 text-lg font-bold">الأوائل</span>
              </div>
              <p className="text-gray-400">منصة تعليمية رائدة للطلاب السودانيين</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">المنصة</h4>
              <ul className="space-y-2 text-gray-400">
                <li>الدورات</li>
                <li>الاختبارات</li>
                <li>نظام النقاط</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2 text-gray-400">
                <li>مركز المساعدة</li>
                <li>تواصل معنا</li>
                <li>الأسئلة الشائعة</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">القانونية</h4>
              <ul className="space-y-2 text-gray-400">
                <li>شروط الاستخدام</li>
                <li>سياسة الخصوصية</li>
                <li>ملفات تعريف الارتباط</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 منصة الأوائل. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
