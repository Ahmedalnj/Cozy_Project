"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import DetailedReviewStats from "./DetailedReviewStats";
import Button from "../ui/Button";
import { SafeReview, SafeUser } from "@/app/types";
import toast from "react-hot-toast";
import axios from "axios";

interface ReviewsSectionProps {
  listingId: string;
  currentUser?: SafeUser | null;
  isOwner: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  listingId,
  currentUser,
  isOwner,
}) => {
  const { t } = useTranslation("common");
  const [reviews, setReviews] = useState<SafeReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<SafeReview | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const userReview = reviews.find(
    (review) => review.userId === currentUser?.id
  );

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/listings/${listingId}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(t("reviews.load_error"));
    } finally {
      setLoading(false);
    }
  }, [listingId, t]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (
    rating: number,
    comment: string,
    detailedRatings: Record<string, number>
  ) => {
    try {
      setSubmitting(true);

      if (editingReview) {
        // Update existing review
        const response = await axios.put(`/api/reviews/${editingReview.id}`, {
          rating,
          comment,
          ...detailedRatings,
        });
        console.log("Update response:", response.data);
        toast.success(t("reviews.review_updated"));
      } else {
        // Create new review
        const response = await axios.post(
          `/api/listings/${listingId}/reviews`,
          {
            rating,
            comment,
            ...detailedRatings,
          }
        );
        console.log("Create response:", response.data);
        toast.success(t("reviews.review_submitted"));
      }

      await fetchReviews();
      setShowForm(false);
      setEditingReview(null);
    } catch (error: unknown) {
      console.error("Error submitting review:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error("Error details:", (error as any).response?.data);
      }

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "error" in error.response.data
      ) {
        toast.error((error.response.data as { error: string }).error);
      } else {
        toast.error(t("reviews.submit_error"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review: SafeReview) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm(t("delete_confirmation"))) {
      return;
    }

    try {
      setDeletingId(reviewId);
      await axios.delete(`/api/reviews/${reviewId}`);
      toast.success(t("reviews.review_deleted"));
      await fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(t("reviews.delete_error"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("reviews.title")}
              </h3>
              {reviews.length > 0 ? (
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-2">
                    <StarRating
                      rating={averageRating}
                      readonly
                      size="sm"
                      showText
                    />
                    <span className="text-xs font-medium text-gray-600">
                      {averageRating.toFixed(1)} {t("reviews.stars")}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {reviews.length} {t("reviews.total_reviews")}
                  </span>
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  كن أول من يكتب تقييماً
                </p>
              )}
            </div>
          </div>

          {/* Write Review Button - Only show when there are existing reviews */}
          {currentUser &&
            !isOwner &&
            !showForm &&
            reviews.length > 0 &&
            !userReview && (
              <Button
                label={t("reviews.write_review")}
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              />
            )}
        </div>
      </div>

      {/* Detailed Review Stats */}
      {reviews.length > 0 && !showForm && (
        <DetailedReviewStats reviews={reviews} />
      )}

      {/* Review Form */}
      {showForm && (
        <ReviewForm
          listingId={listingId}
          currentUser={currentUser}
          existingReview={editingReview}
          onSubmit={handleSubmitReview}
          onCancel={handleCancelForm}
          isLoading={submitting}
        />
      )}

      {/* User's Review */}
      {userReview && !showForm && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900">
                  {t("your_review")}
                </h4>
                <p className="text-xs text-blue-700">تقييمك الخاص</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                label={t("reviews.edit_review")}
                onClick={() => handleEditReview(userReview)}
                outline
                small
                className="bg-white hover:bg-blue-50 border-blue-300 text-blue-700 hover:text-blue-800 text-xs px-2 py-1"
              />
              <Button
                label={t("reviews.delete_review")}
                onClick={() => handleDeleteReview(userReview.id)}
                outline
                small
                className="bg-white hover:bg-red-50 border-red-300 text-red-600 hover:text-red-700 text-xs px-2 py-1"
              />
            </div>
          </div>
          <ReviewCard
            review={userReview}
            currentUser={currentUser}
            isDeleting={deletingId === userReview.id}
          />
        </div>
      )}

      {/* Other Reviews */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          {reviews
            .filter((review) => review.userId !== currentUser?.id)
            .map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUser={currentUser}
                onEdit={() => handleEditReview(review)}
                onDelete={() => handleDeleteReview(review.id)}
                isDeleting={deletingId === review.id}
              />
            ))}
        </div>
      )}

      {/* No Reviews Message - Only show when there are no reviews */}
      {reviews.length === 0 && !showForm && (
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 p-6 text-center shadow-sm">
          <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            {t("reviews.no_reviews")}
          </h3>
          <p className="text-gray-500 mb-4 text-xs">
            كن أول من يشارك تجربته مع هذا المكان
          </p>
          {currentUser && !isOwner ? (
            <Button
              label={t("reviews.write_review")}
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 text-xs"
            />
          ) : !currentUser ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 font-medium text-xs">
                {t("login_to_review")}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
