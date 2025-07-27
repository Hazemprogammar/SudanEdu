import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Users, TrendingUp, Mail } from "lucide-react";
import { SiWhatsapp, SiFacebook, SiX } from "react-icons/si";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function InviteFriends() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

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

  const { data: referralStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/referrals/stats'],
    enabled: !!user,
    retry: false,
  });

  const referralLink = `https://alawael.edu.sd/invite/${user?.referralCode || 'REF123'}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط الدعوة إلى الحافظة",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ الرابط",
        variant: "destructive",
      });
    }
  };

  const shareViaTwitter = () => {
    const text = `انضم إلى منصة الأوائل التعليمية واحصل على أفضل التجارب التعليمية!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
  };

  const shareViaWhatsApp = () => {
    const text = `انضم إلى منصة الأوائل التعليمية واحصل على أفضل التجارب التعليمية! ${referralLink}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = () => {
    const subject = "دعوة للانضمام إلى منصة الأوائل التعليمية";
    const body = `مرحباً،\n\nأدعوك للانضمام إلى منصة الأوائل التعليمية - منصة تعليمية رائدة للطلاب السودانيين.\n\nاستخدم الرابط التالي للتسجيل:\n${referralLink}\n\nمع أطيب التحيات`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  };

  // Mock data for recent invites - replace with real data
  const mockRecentInvites = [
    {
      id: '1',
      name: 'سارة أحمد',
      email: 'sara@example.com',
      status: 'completed',
      joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      name: 'محمد علي',
      email: 'mohamed@example.com',
      status: 'completed',
      joinedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '3',
      name: 'فاطمة محمد',
      email: 'fatima@example.com',
      status: 'pending',
      invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: '4',
      name: 'عبدالله حسن',
      email: 'abdullah@example.com',
      status: 'completed',
      joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ];

  const stats = referralStats || {
    totalInvites: 28,
    successfulInvites: 15,
    pointsEarned: 750,
  };

  const successRate = stats.totalInvites > 0 ? ((stats.successfulInvites / stats.totalInvites) * 100).toFixed(1) : '0.0';

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <Sidebar userRole={user.role || 'student'} />
      
      <div className="main-content-rtl p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">ادع أصدقاءك واحصل على نقاط</h1>
          <p className="text-xl text-academic-gray">احصل على 50 نقطة لكل صديق ينضم عبر رابط الدعوة الخاص بك</p>
        </div>

        {/* Referral Link */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">رابط الدعوة الخاص بك</h3>
            <div className="flex items-center space-x-3 space-x-reverse">
              <Input 
                value={referralLink} 
                readOnly 
                className="flex-1 bg-gray-50 font-mono text-sm"
              />
              <Button 
                onClick={copyToClipboard}
                className={`px-6 py-3 transition-colors font-medium ${
                  copied ? 'bg-academic-success hover:bg-green-600' : 'btn-primary'
                }`}
              >
                <Copy className="w-5 h-5 ml-2" />
                {copied ? 'تم النسخ!' : 'نسخ الرابط'}
              </Button>
            </div>
            <p className="text-sm text-academic-gray mt-3">شارك هذا الرابط مع أصدقائك للحصول على نقاط عند تسجيلهم</p>
          </CardContent>
        </Card>

        {/* Share Options */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">شارك عبر</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                onClick={shareViaTwitter}
                className="flex flex-col items-center p-6 h-auto border-blue-200 hover:border-blue-400 hover:bg-blue-50"
              >
                <SiTwitter className="w-8 h-8 text-blue-500 mb-3" />
                <span className="text-sm font-medium">تويتر</span>
              </Button>

              <Button 
                variant="outline" 
                onClick={shareViaWhatsApp}
                className="flex flex-col items-center p-6 h-auto border-green-200 hover:border-green-400 hover:bg-green-50"
              >
                <SiWhatsapp className="w-8 h-8 text-green-500 mb-3" />
                <span className="text-sm font-medium">واتساب</span>
              </Button>

              <Button 
                variant="outline" 
                onClick={shareViaFacebook}
                className="flex flex-col items-center p-6 h-auto border-blue-200 hover:border-blue-400 hover:bg-blue-50"
              >
                <SiFacebook className="w-8 h-8 text-blue-600 mb-3" />
                <span className="text-sm font-medium">فيسبوك</span>
              </Button>

              <Button 
                variant="outline" 
                onClick={shareViaEmail}
                className="flex flex-col items-center p-6 h-auto border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              >
                <Mail className="w-8 h-8 text-gray-500 mb-3" />
                <span className="text-sm font-medium">بريد إلكتروني</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referral Stats */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Stats */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 ml-2 text-primary" />
                إحصائيات الدعوات
              </h3>
              {statsLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="loading-pulse h-6 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-academic-gray">إجمالي الدعوات المرسلة</span>
                    <span className="font-semibold text-gray-900">{stats.totalInvites}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-academic-gray">الأصدقاء المنضمون</span>
                    <span className="font-semibold text-gray-900">{stats.successfulInvites}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-academic-gray">النقاط المكتسبة</span>
                    <span className="font-semibold text-academic-success">{stats.pointsEarned} نقطة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-academic-gray">معدل النجاح</span>
                    <span className="font-semibold text-gray-900">{successRate}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Invites */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 ml-2 text-primary" />
                الدعوات الأخيرة
              </h3>
              <div className="space-y-3">
                {mockRecentInvites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{invite.name}</p>
                      <p className="text-sm text-academic-gray">
                        {invite.status === 'completed' 
                          ? `انضم ${invite.joinedAt ? invite.joinedAt.toLocaleDateString('ar-EG') : 'مؤخراً'}`
                          : `دعوة مرسلة ${invite.invitedAt ? invite.invitedAt.toLocaleDateString('ar-EG') : 'مؤخراً'}`
                        }
                      </p>
                    </div>
                    <Badge 
                      variant={invite.status === 'completed' ? 'default' : 'secondary'}
                      className={invite.status === 'completed' 
                        ? 'bg-academic-success/10 text-academic-success hover:bg-academic-success/20'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }
                    >
                      {invite.status === 'completed' ? 'مكتملة' : 'قيد الانتظار'}
                    </Badge>
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
