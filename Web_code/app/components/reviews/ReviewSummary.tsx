"use client";

import { FaStar } from "react-icons/fa";

interface ReviewSummaryProps {
  size?: "sm" | "md";
  reviewStats?: {
    count: number;
    averageRating: number;
  };
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ 
  size = "sm",
  reviewStats
}) => {
  // إذا كانت البيانات متوفرة مسبقاً، استخدمها
  if (reviewStats) {
    if (reviewStats.count === 0) {
      return null; // لا تعرض شيئاً إذا لم تكن هناك مراجعات
    }

    const sizeClasses = {
      sm: "text-xs",
      md: "text-sm",
    };

    const starSize = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
    };

    return (
      <div className={`flex items-center gap-1 ${sizeClasses[size]} text-gray-600`}>
        <FaStar className={`${starSize[size]} text-yellow-400`} />
        <span className="font-medium">{reviewStats.averageRating.toFixed(1)}</span>
        <span className="text-gray-500">({reviewStats.count})</span>
      </div>
    );
  }

  // Fallback للتوافق مع الإصدارات السابقة (إذا لم تكن البيانات متوفرة)
  return (
    <div className={`flex items-center gap-1 ${size === "sm" ? "text-xs" : "text-sm"} text-gray-400`}>
      <FaStar className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`} />
      <span>--</span>
    </div>
  );
};

export default ReviewSummary;
