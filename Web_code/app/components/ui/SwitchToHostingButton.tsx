"use client";

import React from "react";
import { useHostMode } from "@/app/contexts/HostModeContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useHostRequestModal from "@/app/hooks/useHostRequestModal";
import { SafeUser } from "@/app/types";

interface SwitchToHostingButtonProps {
  hostStatus: string;
  className?: string;
}

const SwitchToHostingButton: React.FC<SwitchToHostingButtonProps> = ({
  hostStatus,
  className = "",
}) => {
  const { isHostMode, toggleMode, isLoading } = useHostMode();
  const hostRequestModal = useHostRequestModal();
  const router = useRouter();

  const handleClick = async () => {
    switch (hostStatus) {
      case "NOT_REQUESTED":
        // فتح modal طلب المضيف
        hostRequestModal.onOpen();
        break;
      
      case "PENDING":
        // رسالة أن الطلب قيد المراجعة
        toast("طلبك قيد المراجعة. سنتواصل معك قريباً!");
        break;
      
      case "APPROVED":
        // إذا كان المستخدم مضيف معتمد، نوجهه للوحة المضيف
        router.push("/host-dashboard");
        break;
      
      case "REJECTED":
        // رسالة أن الطلب مرفوض
        toast.error("تم رفض طلبك. يرجى التواصل مع الإدارة.");
        break;
      
      default:
        break;
    }
  };

  const getButtonLabel = () => {
    switch (hostStatus) {
      case "NOT_REQUESTED":
        return "أصبح مضيفاً";
      case "PENDING":
        return "طلب قيد المراجعة";
      case "APPROVED":
        return "لوحة المضيف";
      case "REJECTED":
        return "تم رفض الطلب";
      default:
        return "أصبح مضيفاً";
    }
  };

  const getButtonStyle = () => {
    switch (hostStatus) {
      case "NOT_REQUESTED":
        return "bg-rose-500 hover:bg-rose-450 text-white";
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
