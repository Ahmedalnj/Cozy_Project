"use client";

import React from "react";
import { useHostMode } from "@/app/contexts/HostModeContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useHostRequestModal from "@/app/hooks/useHostRequestModal";
import { useSession } from "next-auth/react";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useTranslation } from "react-i18next";

interface SwitchToHostingButtonProps {
  hostStatus: string;
  className?: string;
}

const SwitchToHostingButton: React.FC<SwitchToHostingButtonProps> = ({
  hostStatus,
  className = "",
}) => {
  const { t } = useTranslation("common");
  const { isHostMode, toggleMode, isLoading } = useHostMode();
  const { data: session } = useSession();
  const hostRequestModal = useHostRequestModal();
  const loginModal = useLoginModal();
  const router = useRouter();

  const handleClick = async () => {
    // التحقق من تسجيل الدخول أولاً
    if (!session?.user) {
      loginModal.onOpen();
      return;
    }

    switch (hostStatus) {
      case "NOT_REQUESTED":
        // فتح modal طلب المضيف
        hostRequestModal.onOpen();
        break;
      
      case "PENDING":
        // رسالة أن الطلب قيد المراجعة
        toast(t("request_pending_message"));
        break;
      
      case "APPROVED":
        // إذا كان المستخدم مضيف معتمد، نوجهه للوحة المضيف
        router.push("/host-dashboard");
        break;
      
      case "REJECTED":
        // رسالة أن الطلب مرفوض
        toast.error(t("request_rejected_message"));
        break;
      
      default:
        break;
    }
  };

  const getButtonLabel = () => {
    switch (hostStatus) {
      case "NOT_REQUESTED":
        return t("become_host");
      case "PENDING":
        return t("request_pending_message");
      case "APPROVED":
        return t("host_dashboard_button");
      case "REJECTED":
        return t("request_rejected");
      default:
        return t("become_host");
    }
  };

  const getButtonStyle = () => {
    switch (hostStatus) {
      case "NOT_REQUESTED":
        return "bg-rose-500 hover:bg-rose-700 text-white";
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "APPROVED":
        return "";
      case "REJECTED":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  const isDisabled = hostStatus === "PENDING" || hostStatus === "REJECTED" || isLoading;

  return (
    <div className="flex items-center space-x-2 space-x-reverse">
      {/* الزر الرئيسي */}
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          text-sm
      font-semibold
      py-3
      px-4
      rounded-full
      
      transition
      cursor-pointer
      border-[1px]
      border-neutral-200
      hover:shadow-md
          ${getButtonStyle()}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        {getButtonLabel()}
      </button>
    </div>
  );
};

export default SwitchToHostingButton;
