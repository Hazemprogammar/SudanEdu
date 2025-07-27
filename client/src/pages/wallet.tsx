import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeftRight, DollarSign, TrendingUp } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Wallet() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [transferEmail, setTransferEmail] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");

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

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/wallet/balance'],
    enabled: !!user,
    retry: false,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/wallet/transactions'],
    enabled: !!user,
    retry: false,
  });

  const purchasePointsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/wallet/purchase', { amount: 1000 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/transactions'] });
      toast({
        title: "تم شراء النقاط بنجاح",
        description: "تم إضافة 1000 نقطة إلى محفظتك",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
      toast({
        title: "خطأ",
        description: "فشل في شراء النقاط",
        variant: "destructive",
      });
    },
  });

  const transferPointsMutation = useMutation({
    mutationFn: async () => {
      if (!transferEmail || !transferAmount) {
        throw new Error("يجب ملء جميع الحقول المطلوبة");
      }
      
      const amount = parseInt(transferAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("يجب أن يكون المبلغ رقماً صحيحاً وأكبر من صفر");
      }

      await apiRequest('POST', '/api/wallet/transfer', {
        toUserId: transferEmail, // In a real app, you'd resolve email to userId
        amount,
        description: transferNote || 'تحويل نقاط',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/transactions'] });
      setTransferEmail("");
      setTransferAmount("");
      setTransferNote("");
      toast({
        title: "تم تحويل النقاط بنجاح",
        description: `تم تحويل ${transferAmount} نقطة`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحويل النقاط",
        variant: "destructive",
      });
    },
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="w-5 h-5 text-academic-success" />;
      case 'spent':
        return <ArrowLeftRight className="w-5 h-5 text-red-500" />;
      case 'purchased':
        return <Plus className="w-5 h-5 text-primary" />;
      case 'transferred_out':
        return <ArrowLeftRight className="w-5 h-5 text-red-500" />;
      case 'transferred_in':
        return <ArrowLeftRight className="w-5 h-5 text-academic-success" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
      case 'purchased':
      case 'transferred_in':
        return 'text-academic-success';
      case 'spent':
      case 'transferred_out':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatTransactionAmount = (amount: number, type: string) => {
    const sign = ['spent', 'transferred_out'].includes(type) ? '-' : '+';
    return `${sign}${amount} نقطة`;
  };

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
        {/* Wallet Header */}
        <div className="wallet-card mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">محفظة النقاط</h1>
              <p className="text-white/90">إدارة نقاطك واستخدمها في شراء الدورات والخدمات</p>
            </div>
            <div className="text-left">
              <p className="text-white/80 text-sm">الرصيد الحالي</p>
              <p className="text-4xl font-bold">
                {balanceLoading ? "..." : (balance?.balance || 0).toLocaleString()}
              </p>
              <p className="text-white/80 text-sm">نقطة</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">إجراءات سريعة</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={() => purchasePointsMutation.mutate()}
                    disabled={purchasePointsMutation.isPending}
                    className="w-full btn-primary"
                  >
                    <Plus className="w-5 h-5 ml-2" />
                    {purchasePointsMutation.isPending ? "جاري الشراء..." : "شراء نقاط"}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ArrowLeftRight className="w-5 h-5 ml-2" />
                    تحويل نقاط
                  </Button>
                  <Button variant="outline" className="w-full">
                    <DollarSign className="w-5 h-5 ml-2" />
                    تاريخ المعاملات
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Points Purchase Package */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">شراء النقاط</h3>
                <div className="bg-gradient-to-br from-academic-success/10 to-academic-success/5 border border-academic-success/20 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-academic-success mb-2">1,000</div>
                    <div className="text-sm text-academic-gray mb-3">نقطة</div>
                    <div className="text-2xl font-bold text-gray-900 mb-4">99 ج.س</div>
                    <Button 
                      onClick={() => purchasePointsMutation.mutate()}
                      disabled={purchasePointsMutation.isPending}
                      className="w-full bg-academic-success text-white hover:bg-green-600"
                    >
                      {purchasePointsMutation.isPending ? "جاري الشراء..." : "شراء الآن"}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-academic-gray mt-3 text-center">
                  * يمكن استخدام النقاط في شراء الدورات والخدمات
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions and Transfer */}
          <div className="lg:col-span-2">
            {/* Transfer Points */}
            <Card className="border-0 shadow-sm mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">تحويل النقاط</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="transferEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        إلى المستخدم
                      </Label>
                      <Input
                        id="transferEmail"
                        type="email"
                        placeholder="البريد الإلكتروني أو اسم المستخدم"
                        value={transferEmail}
                        onChange={(e) => setTransferEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="transferAmount" className="block text-sm font-medium text-gray-700 mb-2">
                        عدد النقاط
                      </Label>
                      <Input
                        id="transferAmount"
                        type="number"
                        placeholder="أدخل عدد النقاط"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="transferNote" className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظة (اختيارية)
                    </Label>
                    <Textarea
                      id="transferNote"
                      placeholder="أضف ملاحظة للمرسل إليه..."
                      value={transferNote}
                      onChange={(e) => setTransferNote(e.target.value)}
                      className="h-20 resize-none"
                    />
                  </div>
                  <Button 
                    onClick={() => transferPointsMutation.mutate()}
                    disabled={transferPointsMutation.isPending || !transferEmail || !transferAmount}
                    className="btn-primary"
                  >
                    {transferPointsMutation.isPending ? "جاري التحويل..." : "تحويل النقاط"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المعاملات الأخيرة</h3>
                {transactionsLoading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="loading-pulse h-16 rounded-lg"></div>
                    ))}
                  </div>
                ) : transactions && transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center ml-3 shadow-sm">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-academic-gray">
                              {new Date(transaction.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                        </div>
                        <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                          {formatTransactionAmount(transaction.amount, transaction.type)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-academic-gray mx-auto mb-4" />
                    <p className="text-academic-gray">لا توجد معاملات حتى الآن</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
