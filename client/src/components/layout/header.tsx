import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title: string;
  subtitle?: string;
  pointsBalance?: number;
  notificationCount?: number;
  showSearch?: boolean;
}

export default function Header({ 
  title, 
  subtitle, 
  pointsBalance, 
  notificationCount = 0,
  showSearch = false 
}: HeaderProps) {
  return (
    <div className="flex justify-between items-start mb-8">
      {/* Title Section */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-academic-gray mt-1">{subtitle}</p>
        )}
      </div>

      {/* Actions Section */}
      <div className="flex items-center space-x-4 space-x-reverse">
        {/* Search (if enabled) */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-gray w-4 h-4" />
            <Input
              placeholder="بحث..."
              className="pr-10 w-64"
            />
          </div>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="w-5 h-5 text-academic-gray" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -left-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </Badge>
          )}
        </Button>

        {/* Points Balance (if provided) */}
        {typeof pointsBalance === 'number' && (
          <div className="points-badge">
            <span>{pointsBalance.toLocaleString()} نقطة</span>
          </div>
        )}
      </div>
    </div>
  );
}
