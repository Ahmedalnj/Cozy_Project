"use client";

import { useTranslation } from "react-i18next";
import { SafeReview } from "@/app/types";
import { FaStar, FaSprayCan, FaCheck, FaKey, FaComments, FaMapMarkerAlt, FaDollarSign, FaCrown } from "react-icons/fa";

interface DetailedReviewStatsProps {
  reviews: SafeReview[];
}

const DetailedReviewStats: React.FC<DetailedReviewStatsProps> = ({ reviews }) => {
  const { t } = useTranslation("common");

  // Calculate average ratings for each category
  const calculateCategoryAverage = (category: keyof SafeReview) => {
    const validRatings = reviews
      .map(review => review[category])
      .filter((rating): rating is number => typeof rating === 'number' && rating > 0);
    
    if (validRatings.length === 0) return 0;
    return validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length;
  };

  const overallRating = calculateCategoryAverage('rating');
  const cleanliness = calculateCategoryAverage('cleanliness');
  const accuracy = calculateCategoryAverage('accuracy');
  const checkIn = calculateCategoryAverage('checkIn');
  const communication = calculateCategoryAverage('communication');
  const location = calculateCategoryAverage('location');
  const value = calculateCategoryAverage('value');

  // Calculate rating distribution
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
    }
  });

  const maxRating = Math.max(...ratingDistribution);
  const totalReviews = reviews.length;

  // Check if this is a guest favourite (4.8+ rating with 10+ reviews)
  const isGuestFavourite = overallRating >= 4.8 && totalReviews >= 10;

  const categories = [
    { key: 'cleanliness', value: cleanliness, icon: FaSprayCan, label: t("review_categories.cleanliness"), color: 'bg-blue-500' },
    { key: 'accuracy', value: accuracy, icon: FaCheck, label: t("review_categories.accuracy"), color: 'bg-green-500' },
    { key: 'check_in', value: checkIn, icon: FaKey, label: t("review_categories.check_in"), color: 'bg-purple-500' },
    { key: 'communication', value: communication, icon: FaComments, label: t("review_categories.communication"), color: 'bg-indigo-500' },
    { key: 'location', value: location, icon: FaMapMarkerAlt, label: t("review_categories.location"), color: 'bg-red-500' },
    { key: 'value', value: value, icon: FaDollarSign, label: t("review_categories.value"), color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Guest Favourite Badge */}
      {isGuestFavourite && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 shadow-sm">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
          
          <div className="relative text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="relative">
                <FaCrown className="text-amber-500 text-xl animate-pulse" />
                <FaStar className="text-amber-400 text-sm absolute -top-0.5 -right-0.5" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {overallRating.toFixed(1)}
              </span>
            </div>
            <h3 className="text-sm font-bold text-amber-800 mb-1">
              {t("guest_favourite.title")}
            </h3>
            <p className="text-xs text-amber-700 max-w-sm mx-auto">
              {t("guest_favourite.description")}
            </p>
          </div>
        </div>
      )}

      {/* Overall Rating Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
            <FaStar className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {t("review_categories.overall")}
            </h3>
            <p className="text-xs text-gray-600">
              {totalReviews} {t("reviews.total_reviews")}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3 group hover:bg-gray-50 p-1 rounded transition-colors">
              <div className="flex items-center gap-1 w-12">
                <span className="text-xs font-medium text-gray-700">{rating}</span>
                <FaStar className="text-yellow-400 text-xs" />
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${maxRating > 0 ? (ratingDistribution[rating - 1] / maxRating) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="text-xs font-medium text-gray-700 w-8 text-right">
                {ratingDistribution[rating - 1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Ratings */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <FaStar className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {t("reviews.title")}
            </h3>
            <p className="text-xs text-gray-600">
              تقييمات مفصلة
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map(({ key, value, icon: Icon, label, color }) => (
            <div key={key} className="group relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 hover:from-white hover:to-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${color} rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="text-white text-xs" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-800">{label}</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-xs ${
                            star <= (value || 0) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">
                    {value > 0 ? value.toFixed(1) : '-'}
                  </span>
                  {value > 0 && (
                    <div className="text-xs text-gray-500">
                      من 5
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedReviewStats;
