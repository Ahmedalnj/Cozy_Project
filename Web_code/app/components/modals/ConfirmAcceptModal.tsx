"use client";

import { useState } from "react";
import Modal from "./modal";
import { useTranslation } from "react-i18next";
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaUser,
  FaShieldAlt,
} from "react-icons/fa";

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
    reservationCode: string; // رقم الحجز المكون من 8 أرقام
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
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const handleVerify = () => {
    if (verificationCode === reservationData?.reservationCode) {
      setIsVerified(true);
      setVerificationError("");
    } else {
      setIsVerified(false);
      setVerificationError(t("invalid_reservation_code"));
    }
  };

  const handleConfirm = () => {
    if (isVerified) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setVerificationCode("");
    setIsVerified(false);
    setVerificationError("");
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

      {/* Verification Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <FaShieldAlt className="text-blue-600" />
          <h4 className="font-medium text-blue-900">
            {t("verification_required")}
          </h4>
        </div>

        <p className="text-sm text-blue-800 mb-3">
          {t("verification_description")}
        </p>

        <div className="space-y-3">
          {/* Reservation Code Display */}
          <div className="bg-white rounded-lg p-3 border border-blue-300">
            <div className="text-xs text-blue-600 mb-1">
              {t("reservation_code")}
            </div>
            <div className="text-lg font-mono font-bold text-blue-900 tracking-wider">
              {reservationData?.reservationCode}
            </div>
          </div>

          {/* Verification Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 8)
                  );
                  setIsVerified(false);
                  setVerificationError("");
                }}
                placeholder={t("enter_reservation_code")}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isVerified
                    ? "border-green-300 bg-green-50"
                    : verificationError
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                maxLength={8}
                disabled={isVerified}
              />
              {verificationError && (
                <p className="text-xs text-red-600 mt-1">{verificationError}</p>
              )}
            </div>
            <button
              onClick={handleVerify}
              disabled={verificationCode.length !== 8 || isVerified}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                verificationCode.length === 8 && !isVerified
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isVerified ? t("verified") : t("verify")}
            </button>
          </div>

          {isVerified && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-md">
              <FaCheckCircle className="text-green-600" />
              <span className="text-sm font-medium">
                {t("verification_successful")}
              </span>
            </div>
          )}
        </div>
      </div>

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
      disabled={isLoading || !isVerified}
    />
  );
};

export default ConfirmAcceptModal;
