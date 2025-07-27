import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock, Award } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Exam() {
  const { examId } = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isExamStarted, setIsExamStarted] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  const { data: exam, isLoading: examLoading } = useQuery({
    queryKey: ['/api/exams', examId],
    enabled: !!examId,
    retry: false,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['/api/exams', examId, 'questions'],
    enabled: !!examId,
    retry: false,
  });

  // Start exam attempt
  const startExamMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/exams/${examId}/attempt`, {});
      return response.json();
    },
    onSuccess: (attempt) => {
      setAttemptId(attempt.id);
      setIsExamStarted(true);
      setTimeLeft((exam?.duration || 30) * 60); // Convert minutes to seconds
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
        description: "فشل في بدء الاختبار",
        variant: "destructive",
      });
    },
  });

  // Submit exam attempt
  const submitExamMutation = useMutation({
    mutationFn: async () => {
      if (!attemptId) throw new Error("No attempt ID");
      
      // Calculate score (simplified)
      let score = 0;
      let totalPoints = 0;
      
      questions?.forEach((question: any) => {
        totalPoints += question.points || 1;
        if (answers[question.id] === question.correctAnswer) {
          score += question.points || 1;
        }
      });

      await apiRequest('PATCH', `/api/exam-attempts/${attemptId}`, {
        answers,
        score,
        totalPoints,
        completedAt: new Date().toISOString(),
      });

      return { score, totalPoints };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/balance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      
      toast({
        title: "تم إكمال الاختبار",
        description: `حصلت على ${result.score} من ${result.totalPoints} نقطة`,
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/student";
      }, 2000);
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
        description: "فشل في إرسال الاختبار",
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (isExamStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isExamStarted) {
      // Auto-submit when time runs out
      submitExamMutation.mutate();
    }
  }, [timeLeft, isExamStarted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (authLoading || examLoading || questionsLoading) {
    return <LoadingSpinner />;
  }

  if (!exam || !questions) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">الاختبار غير موجود</h1>
            <p className="text-academic-gray">لم يتم العثور على الاختبار المطلوب</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-gray-50 rtl">
        <div className="max-w-4xl mx-auto p-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{exam.title}</h1>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                  <Clock className="w-8 h-8 text-primary ml-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{exam.duration}</div>
                    <div className="text-academic-gray">دقيقة</div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                  <Award className="w-8 h-8 text-academic-success ml-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
                    <div className="text-academic-gray">سؤال</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-academic-gray">
                  أنت على وشك بدء اختبار {exam.title}. تأكد من أن لديك اتصال إنترنت مستقر.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ بمجرد بدء الاختبار، سيبدأ العد التنازلي ولا يمكن إيقافه
                  </p>
                </div>
                <Button 
                  onClick={() => startExamMutation.mutate()}
                  disabled={startExamMutation.isPending}
                  size="lg"
                  className="btn-primary"
                >
                  {startExamMutation.isPending ? "جاري البدء..." : "بدء الاختبار"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 rtl">
      <div className="max-w-4xl mx-auto p-6">
        {/* Exam Header */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{exam.title}</h1>
                <p className="text-academic-gray mt-1">
                  السؤال {currentQuestionIndex + 1} من {questions.length}
                </p>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* Timer */}
                <div className="exam-timer">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 ml-2" />
                    <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                {/* Score */}
                <div className="points-badge">
                  <span>{Object.keys(answers).length}/{questions.length} مجاب</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-bar mt-4">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-8">
            <div className="mb-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {currentQuestion.points || 1} نقطة
              </span>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <RadioGroup 
              value={answers[currentQuestion.id] || ""} 
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              <div className="space-y-4">
                {currentQuestion.options?.map((option: string, index: number) => (
                  <div key={index} className="exam-question-card">
                    <div className="flex items-center space-x-3 space-x-reverse p-4">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {/* Question Actions */}
            <div className="flex justify-between items-center mt-8">
              <Button 
                variant="outline" 
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                السؤال السابق
              </Button>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <Button variant="outline">
                  تمييز للمراجعة
                </Button>
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button 
                    onClick={() => submitExamMutation.mutate()}
                    disabled={submitExamMutation.isPending}
                    className="btn-primary"
                  >
                    {submitExamMutation.isPending ? "جاري الإرسال..." : "إنهاء الاختبار"}
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} className="btn-primary">
                    السؤال التالي
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigator */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">الانتقال السريع للأسئلة</h3>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 p-0 ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-white border-primary'
                      : answers[questions[index].id]
                      ? 'bg-academic-success text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 space-x-reverse mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-academic-success rounded ml-2"></div>
                <span className="text-academic-gray">مجاب عليه</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary rounded ml-2"></div>
                <span className="text-academic-gray">السؤال الحالي</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 rounded ml-2"></div>
                <span className="text-academic-gray">لم يُجب عليه</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
