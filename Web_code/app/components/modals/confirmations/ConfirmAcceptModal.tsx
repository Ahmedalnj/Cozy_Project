"use client";

import Modal from "../base/modal";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaMoneyBillWave, FaUser } from "react-icons/fa";

interface ConfirmAcceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  reservationData?: {
    guestName: string;
    listingTitle: string;
    totalPrice: number;
    startDate: string;
    endDate: string;
  };
}

const ConfirmAcceptModal: React.FC<ConfirmAcceptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  reservationData,
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
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <FaCheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t("confirm_accept_reservation")}
        </h3>
        <p className="text-sm text-gray-500">
          {t("confirm_accept_description")}
        </p>
      </div>

      {/* Reservation Details */}
      {reservationData && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FaUser className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              {t("guest")}: {reservationData.guestName}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <strong>{t("property")}:</strong> {reservationData.listingTitle}
          </div>

          <div className="text-sm text-gray-600">
            <strong>{t("dates")}:</strong> {reservationData.startDate} -{" "}
            {reservationData.endDate}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <FaMoneyBillWave className="text-green-600" />
            <span className="text-lg font-bold text-green-600">
              ${reservationData.totalPrice}
            </span>
            <span className="text-sm text-gray-500">{t("cash_payment")}</span>
          </div>
        </div>
      )}

      {/* Warning Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-800">
              <strong>{t("important_note")}:</strong> {t("accept_cash_note")}
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
      title={t("confirm_accept_reservation")}
      body={bodyContent}
      actionLabel={t("accept_reservation")}
      secondaryActionLabel={t("cancel")}
      secondaryAction={handleClose}
      isLoading={isLoading}
      disabled={isLoading}
    />
  );
};

export default ConfirmAcceptModal;
