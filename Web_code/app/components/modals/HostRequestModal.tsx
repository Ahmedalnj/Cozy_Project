"use client";

import React, { useState } from "react";
import Modal from "./base/modal";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useHostRequestModal from "@/app/hooks/useHostRequestModal";
import { useTranslation } from "react-i18next";

interface HostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
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
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    requestType: "",
    companyName: "",
    companyWebsite: "",
    idCardNumber: "",
    idCardType: "",
  });

  const { t } = useTranslation();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // التحقق من الحقول الأساسية
    if (!formData.fullName || !formData.email || !formData.phone || !formData.requestType) {
      toast.error(t("fill_required_fields"));
      return;
    }

    // التحقق من الحقول حسب نوع الطلب
    if (formData.requestType === "business") {
      if (!formData.companyName || !formData.companyWebsite) {
        toast.error(t("fill_company_fields"));
        return;
      }
    } else if (formData.requestType === "personal") {
      if (!formData.idCardNumber || !formData.idCardType) {
        toast.error(t("fill_identity_fields"));
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/host-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(t("request_sent_successfully"));
        onClose();
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
        value={formData.fullName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("fullName", e.target.value)}
        disabled={isLoading}
        required
        errors={{}}
      />

      <Input
        id="email"
        label={t("email")}
        type="email"
        value={formData.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
        disabled={isLoading}
        required
        errors={{}}
        
      />

      <Input
        id="phone"
        label={t("phone")}
        type="tel"
        value={formData.phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phone", e.target.value)}
        disabled={isLoading}
        required
        errors={{}}
        
      />

      {/* نوع الطلب */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("request_type")} *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange("requestType", "personal")}
            className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
              formData.requestType === "personal"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {t("personal")}
          </button>
          <button
            type="button"
            onClick={() => handleInputChange("requestType", "business")}
            className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
              formData.requestType === "business"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {t("business_or_office")}
          </button>
        </div>
      </div>

      {/* حقول الشركة */}
      {formData.requestType === "business" && (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900">{t("company_information")}</h4>
          
          <Input
            id="companyName"
            label={t("company_name")}
            value={formData.companyName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("companyName", e.target.value)}
            disabled={isLoading}
            required
            errors={{}}
            
          />

          <Input
            id="companyWebsite"
            label={t("company_website")}
            type="url"
            value={formData.companyWebsite}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("companyWebsite", e.target.value)}
            disabled={isLoading}
            required
            errors={{}}
            placeholder="https://example.com"
          />
        </div>
      )}

      {/* حقول الشخصي */}
      {formData.requestType === "personal" && (
        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900">{t("identity_information")}</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("id_card_type")} *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange("idCardType", "national")}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
                  formData.idCardType === "national"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {t("national_id")}
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("idCardType", "personal")}
                className={`p-3 text-sm font-medium rounded-lg border-2 transition-all ${
                  formData.idCardType === "personal"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {t("personal_id")}
              </button>
            </div>
          </div>

          <Input
            id="idCardNumber"
            label={t("id_card_number")}
            value={formData.idCardNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("idCardNumber", e.target.value)}
            disabled={isLoading}
            required
            errors={{}}
            placeholder={formData.idCardType === "national" ? t("enter_national_id") : t("enter_personal_id")}
          />
        </div>
      )}

      {/* ملاحظات */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-800">
          <strong>{t("note")}:</strong> 
          {formData.requestType === "business" 
            ? ` ${t("company_note")}`
            : ` ${t("identity_note")}`
          }
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
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
