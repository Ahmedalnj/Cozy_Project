"use client";

import Modal from "../base/modal";
import { useTranslation } from "react-i18next";
import { FaExclamationTriangle, FaTrash, FaUser, FaStar } from "react-icons/fa";

interface ConfirmDeleteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  reviewData?: {
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
}

const ConfirmDeleteReviewModal: React.FC<ConfirmDeleteReviewModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  reviewData,
}) => {
  const { t } = useTranslation("common");

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    onClose();
  };

  const bodyContent = (
    <div className="space-y-6">
      {/* Icon and Title */}
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <FaExclamationTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("confirm_delete_review")}
        </h3>
        <p className="text-sm text-gray-500">
          {t("confirm_delete_review_description")}
        </p>
      </div>

      {/* Review Details */}
      {reviewData && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full"
                src={reviewData.userImage || "/images/user.png"}
                alt={reviewData.userName}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FaUser className="text-gray-400 text-sm" />
                <span className="text-sm font-medium text-gray-700">
                  {reviewData.userName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="text-sm font-bold text-gray-900">
                  {reviewData.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {reviewData.comment && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic">
                "
                {reviewData.comment.length > 100
                  ? `${reviewData.comment.substring(0, 100)}...`
                  : reviewData.comment}
                "
              </p>
            </div>
          )}
        </div>
      )}

      {/* Warning Note */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaExclamationTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-800">
              <strong>{t("warning")}:</strong> {t("delete_review_warning")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleConfirm}
      title={t("confirm_delete_review")}
      body={bodyContent}
      actionLabel={t("delete_review")}
      secondaryActionLabel={t("cancel")}
      secondaryAction={handleClose}
      isLoading={isLoading}
      disabled={isLoading}
      actionButtonClassName="bg-red-600 hover:bg-red-700 text-white"
    />
  );
};

export default ConfirmDeleteReviewModal;
