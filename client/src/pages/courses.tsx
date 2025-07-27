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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Star, Users, Clock, Search, Filter } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Courses() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

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

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    enabled: !!user,
    retry: false,
  });

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/students', user?.id, 'enrollments'],
    enabled: !!user?.id,
    retry: false,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      await apiRequest('POST', `/api/courses/${courseId}/enroll`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students', user?.id, 'enrollments'] });
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم تسجيلك في الدورة بنجاح",
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
        description: "فشل في التسجيل في الدورة",
        variant: "destructive",
      });
    },
  });

  const isEnrolled = (courseId: string) => {
    return enrollments?.some((enrollment: any) => enrollment.id === courseId);
  };

  const filteredCourses = courses?.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === "enrolled") {
      return matchesSearch && isEnrolled(course.id);
    } else if (filterBy === "available") {
      return matchesSearch && !isEnrolled(course.id);
    }
    
    return matchesSearch;
  });

  // Mock data for course images and additional info - replace with real data
  const getCourseImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=300&h=200&fit=crop', // Math
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=200&fit=crop', // Physics
      'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=300&h=200&fit=crop', // Chemistry
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop', // Biology
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop', // Literature
    ];
    return images[index % images.length];
  };

  const getCourseStats = () => ({
    students: Math.floor(Math.random() * 100) + 20,
    rating: (Math.random() * 2 + 3).toFixed(1),
    duration: Math.floor(Math.random() * 20) + 5,
  });

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">الدورات التعليمية</h1>
          <p className="text-xl text-academic-gray">اكتشف مجموعة واسعة من الدورات التعليمية عالية الجودة</p>
        </div>

        {/* Search and Filter */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-gray w-5 h-5" />
                <Input
                  placeholder="ابحث عن الدورات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 ml-2" />
                  <SelectValue placeholder="تصفية النتائج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الدورات</SelectItem>
                  <SelectItem value="enrolled">الدورات المسجلة</SelectItem>
                  <SelectItem value="available">الدورات المتاحة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        {coursesLoading || enrollmentsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <div className="loading-pulse h-48 rounded-t-xl"></div>
                <CardContent className="p-6">
                  <div className="loading-pulse h-6 mb-3 rounded"></div>
                  <div className="loading-pulse h-4 mb-4 rounded"></div>
                  <div className="loading-pulse h-10 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCourses && filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: any, index: number) => {
              const stats = getCourseStats();
              const enrolled = isEnrolled(course.id);
              
              return (
                <Card key={course.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={getCourseImage(index)}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                    {enrolled && (
                      <Badge className="absolute top-3 right-3 bg-academic-success/90 text-white">
                        مسجل
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-academic-gray mb-4 line-clamp-2">
                      {course.description || "وصف الدورة سيتم إضافته قريباً..."}
                    </p>
                    
                    {/* Course Stats */}
                    <div className="flex items-center justify-between text-sm text-academic-gray mb-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 ml-1" />
                        <span>{stats.students} طالب</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 ml-1 text-yellow-500" />
                        <span>{stats.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 ml-1" />
                        <span>{stats.duration} ساعة</span>
                      </div>
                    </div>

                    {/* Course Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {course.pointsCost > 0 ? (
                          <span className="text-lg font-bold text-primary">{course.pointsCost} نقطة</span>
                        ) : (
                          <span className="text-lg font-bold text-academic-success">مجاني</span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    {enrolled ? (
                      <Button variant="outline" className="w-full">
                        <BookOpen className="w-4 h-4 ml-2" />
                        متابعة التعلم
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => enrollMutation.mutate(course.id)}
                        disabled={enrollMutation.isPending}
                        className="w-full btn-primary"
                      >
                        {enrollMutation.isPending ? "جاري التسجيل..." : "التسجيل في الدورة"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-academic-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد دورات</h3>
              <p className="text-academic-gray">
                {searchTerm ? "لم يتم العثور على دورات تطابق البحث" : "لا توجد دورات متاحة حالياً"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
