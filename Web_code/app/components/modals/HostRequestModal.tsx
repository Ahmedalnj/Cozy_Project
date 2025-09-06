/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Modal from "./base/modal";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useHostRequestModal from "@/app/hooks/useHostRequestModal";
import { useTranslation } from "react-i18next";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

interface HostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData extends FieldValues {
  fullName: string;
  email: string;
  phone: string;
  requestType: "personal" | "business" | "";
  // حقول الشركة
  companyName: string;
  companyWebsite: string;
  // حقول الشخصي
  idCardNumber: string;
  idCardType: "national" | "personal" | "";
}

const HostRequestModal: React.FC<HostRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation("common");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      requestType: "",
      companyName: "",
      companyWebsite: "",
      idCardNumber: "",
      idCardType: "",
    },
  });

  const requestType = watch("requestType");
  const idCardType = watch("idCardType");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // التحقق من نوع الطلب
    if (!data.requestType) {
      toast.error(t("request_type_required"));
      return;
    }

    // التحقق من نوع بطاقة الهوية إذا كان الطلب شخصي
    if (data.requestType === "personal" && !data.idCardType) {
      toast.error(t("id_card_type_required"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/host-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(t("request_sent_successfully"));
        onClose();
        reset();
        router.refresh();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || t("error_sending_request"));
      }
    } catch (error) {
      toast.error(t("error_sending_request"));
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("host_request_title")}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {t("host_request_description")}
        </p>
      </div>

      {/* الحقول الأساسية */}
      <Input
        id="fullName"
        label={t("full_name")}
        disabled={isLoading}
        required
        register={register}
        errors={errors}
        validation={{
          required: t("full_name_required"),
          minLength: { value: 2, message: t("full_name_min_length") },
          maxLength: { value: 50, message: t("full_name_max_length") },
          pattern: {
            value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
            message: t("full_name_invalid_chars"),
          },
        }}
      />

      <Input
        id="email"
        label={t("email")}
        type="email"
        disabled={isLoading}
        required
        register={register}
        errors={errors}
        validation={{
          required: t("email_required"),
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: t("email_invalid_format"),
          },
        }}
      />

      <Input
        id="phone"
        label={t("phone")}
        type="tel"
        disabled={isLoading}
        required
        register={register}
        errors={errors}
        validation={{
          required: t("phone_required"),
          pattern: {
            value: /^[\+]?[0-9\s\-\(\)]{8,15}$/,
            message: t("phone_invalid_format"),
          },
        }}
      />

      {/* نوع الطلب */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("request_type")} *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue("requestType", "personal")}
            className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
              requestType === "personal"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {t("personal")}
          </button>
          <button
            type="button"
            onClick={() => setValue("requestType", "business")}
            className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
              requestType === "business"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {t("business_or_office")}
          </button>
        </div>
        {errors.requestType && (
          <p className="text-red-500 text-xs mt-1">
            {errors.requestType.message}
          </p>
        )}
      </div>

      {/* حقول الشركة */}
      {requestType === "business" && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900">
            {t("company_information")}
          </h4>

          <Input
            id="companyName"
            label={t("company_name")}
            disabled={isLoading}
            required
            register={register}
            errors={errors}
            validation={{
              required: t("company_name_required"),
              minLength: { value: 2, message: t("company_name_min_length") },
              maxLength: { value: 100, message: t("company_name_max_length") },
            }}
          />

          <Input
            id="companyWebsite"
            label={t("company_website")}
            type="url"
            disabled={isLoading}
            required
            register={register}
            errors={errors}
            validation={{
              required: t("company_website_required"),
              pattern: {
                value: /^https?:\/\/.+/,
                message: t("company_website_invalid_format"),
              },
            }}
          />
        </div>
      )}

      {/* حقول الشخصي */}
      {requestType === "personal" && (
        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900">
            {t("identity_information")}
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("id_card_type")} *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("idCardType", "national")}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
                  idCardType === "national"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {t("national_id")}
              </button>
              <button
                type="button"
                onClick={() => setValue("idCardType", "personal")}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
                  idCardType === "personal"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {t("personal_id")}
              </button>
            </div>
            {errors.idCardType && (
              <p className="text-red-500 text-xs mt-1">
                {errors.idCardType.message}
              </p>
            )}
          </div>

          {/* حقل رقم الهوية يظهر فقط عند اختيار نوع الهوية */}
          {idCardType && (
            <Input
              id="idCardNumber"
              label={t("id_card_number")}
              disabled={isLoading}
              required
              register={register}
              errors={errors}
              validation={{
                required: t("id_card_number_required"),
                minLength: {
                  value: 5,
                  message: t("id_card_number_min_length"),
                },
                maxLength: {
                  value: 20,
                  message: t("id_card_number_max_length"),
                },
                pattern: {
                  value: /^[0-9A-Za-z]+$/,
                  message: t("id_card_number_invalid_chars"),
                },
              }}
            />
          )}
        </div>
      )}

      {/* ملاحظات */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-800">
          <strong>{t("note")}:</strong>
          {requestType === "business"
            ? ` ${t("company_note")}`
            : ` ${t("identity_note")}`}
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      title={t("host_request_title")}
      body={bodyContent}
      actionLabel={t("send_request")}
      secondaryAction={onClose}
      secondaryActionLabel={t("cancel")}
      isLoading={isLoading}
    />
  );
};

export default HostRequestModal;
