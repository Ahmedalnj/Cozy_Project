"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  showText = false,
}) => {
  const { t } = useTranslation("common");
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return t("reviews.excellent");
    if (rating >= 4.0) return t("reviews.very_good");
    if (rating >= 3.0) return t("reviews.good");
    if (rating >= 2.0) return t("reviews.fair");
    return t("reviews.poor");
  };

  const handleMouseEnter = (starRating: number) => {
    if (!readonly) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const handleClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`${sizeClasses[size]} cursor-pointer transition-colors ${
              readonly ? "cursor-default" : ""
            } ${
              star <= displayRating
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(star)}
          />
        ))}
      </div>
      {showText && (
        <span className="text-sm text-gray-600">
          {getRatingText(rating)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
