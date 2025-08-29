"use client";

import StarRating from "./StarRating";
import Avatar from "./Avatar";
import { SafeReview, SafeUser } from "@/app/types";
import { format } from "date-fns";
import { FaTrash, FaEdit, FaCalendarAlt, FaUser } from "react-icons/fa";
import Button from "./Button";

interface ReviewCardProps {
  review: SafeReview;
  currentUser?: SafeUser | null;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  currentUser,
  onEdit,
  onDelete,
  isDeleting = false,
}) => {
  const isOwner = currentUser?.id === review.userId;

  // Check if review has detailed ratings
  const hasDetailedRatings = review.cleanliness || review.accuracy || review.checkIn || 
                            review.communication || review.location || review.value;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar src={review.user.image} />
            {isOwner && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xs" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm">
                {review.user.name || "Anonymous"}
              </h4>
              {isOwner && (
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  أنت
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <FaCalendarAlt className="text-gray-400" />
              <span>{format(new Date(review.createdAt), "MMMM yyyy")}</span>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              label=""
              onClick={onEdit}
              disabled={isDeleting}
              outline
              small
              className="p-1.5 hover:bg-blue-50"
              icon={FaEdit}
            />
            <Button
              label=""
              onClick={onDelete}
              disabled={isDeleting}
              outline
              small
              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
              icon={FaTrash}
            />
          </div>
        )}
      </div>

      {/* Main Rating */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <StarRating
            rating={review.rating}
            readonly
            size="sm"
            showText
          />
          <span className="text-sm font-bold text-gray-900">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Detailed Ratings (if available) */}
      {hasDetailedRatings && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <h5 className="text-xs font-semibold text-gray-700 mb-2">التقييمات المفصلة:</h5>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'cleanliness', label: 'النظافة', value: review.cleanliness },
              { key: 'accuracy', label: 'الدقة', value: review.accuracy },
              { key: 'checkIn', label: 'تسجيل الدخول', value: review.checkIn },
              { key: 'communication', label: 'التواصل', value: review.communication },
              { key: 'location', label: 'الموقع', value: review.location },
              { key: 'value', label: 'القيمة', value: review.value },
            ].map(({ key, label, value }) => (
              value && (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{label}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-gray-900">{value}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-1.5 h-1.5 rounded-full ${
                            star <= value ? 'bg-yellow-400' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Comment */}
      {review.comment && (
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border-l-2 border-blue-500">
          <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-line">
            "{review.comment}"
          </p>
        </div>
      )}

      {/* Loading state for delete */}
      {isDeleting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
