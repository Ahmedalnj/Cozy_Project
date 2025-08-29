"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";
import { SafeReview, SafeUser } from "@/app/types";
import { FaUser, FaStar, FaSprayCan, FaCheck, FaKey, FaComments, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa";

interface ReviewFormProps {
  listingId: string;
  currentUser?: SafeUser | null;
  existingReview?: SafeReview | null;
  onSubmit: (rating: number, comment: string, detailedRatings: Record<string, number>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  currentUser,
  existingReview,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useTranslation("common");
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [detailedRatings, setDetailedRatings] = useState({
    cleanliness: existingReview?.cleanliness || 0,
    accuracy: existingReview?.accuracy || 0,
    checkIn: existingReview?.checkIn || 0,
    communication: existingReview?.communication || 0,
    location: existingReview?.location || 0,
    value: existingReview?.value || 0,
  });
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { rating?: string; comment?: string } = {};
    
    if (rating === 0) {
      newErrors.rating = t("reviews.rating_required");
    }
    
    if (comment.trim().length < 10) {
      newErrors.comment = t("reviews.comment_min_length");
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await onSubmit(rating, comment, detailedRatings);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const categories = [
    { key: 'cleanliness', label: t("review_categories.cleanliness"), icon: FaSprayCan, color: 'bg-blue-500' },
    { key: 'accuracy', label: t("review_categories.accuracy"), icon: FaCheck, color: 'bg-green-500' },
    { key: 'checkIn', label: t("review_categories.check_in"), icon: FaKey, color: 'bg-purple-500' },
    { key: 'communication', label: t("review_categories.communication"), icon: FaComments, color: 'bg-indigo-500' },
    { key: 'location', label: t("review_categories.location"), icon: FaMapMarkerAlt, color: 'bg-red-500' },
    { key: 'value', label: t("review_categories.value"), icon: FaDollarSign, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <FaUser className="text-white text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {existingReview ? t("reviews.edit_review") : t("reviews.write_review")}
          </h3>
          <p className="text-xs text-gray-500">
            {currentUser?.name || "Anonymous"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Overall Rating */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-md flex items-center justify-center">
              <FaStar className="text-white text-xs" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                {t("reviews.rating")}
              </label>
              <p className="text-xs text-gray-600">التقييم العام</p>
            </div>
          </div>
          
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size="md"
            showText
          />
          {errors.rating && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {errors.rating}
            </p>
          )}
        </div>

        {/* Detailed Ratings */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
              <FaStar className="text-white text-xs" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                {t("review_categories.overall")}
              </label>
              <p className="text-xs text-gray-600">تقييمات مفصلة</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="group">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-5 h-5 ${color} rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="text-white text-xs" />
                  </div>
                  <label className="text-xs font-medium text-gray-700">{label}</label>
                </div>
                <StarRating
                  rating={detailedRatings[key as keyof typeof detailedRatings]}
                  onRatingChange={(newRating) => 
                    setDetailedRatings(prev => ({ ...prev, [key]: newRating }))
                  }
                  size="sm"
                  showText={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                {t("reviews.comment")}
              </label>
              <p className="text-xs text-gray-600">شارك تجربتك</p>
            </div>
          </div>
          
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("reviews.comment_placeholder")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-sm"
            rows={3}
            maxLength={500}
          />
          {errors.comment && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              {errors.comment}
            </p>
          )}
          <div className="flex justify-between items-center mt-2">
            <p className="text-gray-500 text-xs">
              {comment.length}/500 حرف
            </p>
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200"
                style={{ width: `${(comment.length / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading || rating === 0}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-blue-500 text-white hover:from-blue-600 hover:to-purple-600 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] font-semibold shadow-md hover:shadow-lg py-2 px-4 text-sm"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t("loading_states.saving")}
              </div>
            ) : (
              existingReview ? t("reviews.update_review") : t("reviews.submit_review")
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600 disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] font-semibold shadow-md hover:shadow-lg py-2 px-4 text-sm"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
