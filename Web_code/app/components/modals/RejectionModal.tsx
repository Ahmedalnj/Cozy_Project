"use client";

import { useState } from "react";
import Modal from "./modal";
import { useTranslation } from "react-i18next";

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const { t } = useTranslation("common");

  const handleSubmit = () => {
    onConfirm(rejectionReason);
    setRejectionReason("");
  };

  const handleClose = () => {
    setRejectionReason("");
    onClose();
  };

  const bodyContent = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("rejection_reason")}
        </label>
        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder={t("enter_rejection_reason")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
          rows={4}
          maxLength={500}
        />
        <div className="text-xs text-gray-500 mt-1">
          {rejectionReason.length}/500 {t("characters")}
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          <strong>{t("note")}:</strong> {t("rejection_note")}
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={t("reject_reservation")}
      body={bodyContent}
      actionLabel={t("confirm_rejection")}
      secondaryActionLabel={t("cancel")}
      secondaryAction={handleClose}
      isLoading={isLoading}
      disabled={isLoading}
    />
  );
};

export default RejectionModal;



