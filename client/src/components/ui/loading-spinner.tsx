import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ 
  className, 
  size = 'md',
  text = "جاري التحميل..."
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className={cn("text-center", className)}>
        <div 
          className={cn(
            "border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4",
            sizeClasses[size]
          )}
        ></div>
        <p className="text-academic-gray">{text}</p>
      </div>
    </div>
  );
}
