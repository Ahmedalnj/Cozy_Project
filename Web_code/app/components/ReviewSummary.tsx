"use client";

import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

interface ReviewSummaryProps {
  listingId: string;
  size?: "sm" | "md";
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ 
  listingId, 
  size = "sm" 
}) => {
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await axios.get(`/api/listings/${listingId}/reviews`);
        const reviews = response.data;
        
        if (reviews.length > 0) {
          const avg = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / reviews.length;
          setAverageRating(avg);
          setReviewCount(reviews.length);
        }
      } catch (error) {
        console.error("Error fetching review stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewStats();
  }, [listingId]);

  if (loading) {
    return (
      <div className="flex items-center gap-1 text-xs text-gray-400">
        <FaStar className="w-3 h-3" />
        <span>--</span>
      </div>
    );
  }

  if (!averageRating) {
    return null; // Don't show anything if no reviews
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
      <span className="font-medium">{averageRating.toFixed(1)}</span>
      <span className="text-gray-500">({reviewCount})</span>
    </div>
  );
};

export default ReviewSummary;
