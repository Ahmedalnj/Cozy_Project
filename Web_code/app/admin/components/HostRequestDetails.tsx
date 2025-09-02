"use client";

import React from "react";

interface HostRequestDetailsProps {
  request: {
    id: string;
    status: string;
    fullName: string;
    phone: string;
    idCardUrl: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      hostStatus: string;
    };
  };
  onClose: () => void;
}

interface ParsedHostRequestData {
  requestType: string;
  email: string;
  companyName?: string;
  companyWebsite?: string;
  idCardNumber?: string;
  idCardType?: string;
}

const HostRequestDetails: React.FC<HostRequestDetailsProps> = ({
  request,
  onClose,
}) => {
  const parseHostRequestData = (idCardUrl: string): ParsedHostRequestData => {
    try {
      return JSON.parse(idCardUrl);
    } catch {
      return {
        requestType: "غير محدد",
        email: "",
      };
    }
  };

  const parsedData = parseHostRequestData(request.idCardUrl);

  const getRequestTypeLabel = (requestType: string) => {
    switch (requestType) {
      case "personal":
        return "شخصي";
      case "business":
        return "شركة أو مكتب";
      default:
        return "غير محدد";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING":
        return "قيد المراجعة";
      case "APPROVED":
        return "تمت الموافقة";
      case "REJECTED":
        return "تم الرفض";
      default:
        return "غير محدد";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "APPROVED":
        return "text-green-600 bg-green-50";
      case "REJECTED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            تفاصيل طلب المضيف
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* معلومات المستخدم */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">معلومات المستخدم</h4>
            <div className="flex items-center space-x-4 space-x-reverse">
              <img
                className="h-16 w-16 rounded-full"
                src={request.user.image || "/images/user.png"}
                alt={request.user.name || "مستخدم"}
              />
              <div>
                <p className="text-sm text-gray-600">اسم المستخدم</p>
                <p className="font-medium text-gray-900">{request.user.name || "بدون اسم"}</p>
                <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                <p className="font-medium text-gray-900">{request.user.email}</p>
              </div>
            </div>
          </div>

          {/* معلومات الطلب الأساسية */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">معلومات الطلب الأساسية</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700">الاسم الكامل</p>
                <p className="font-medium text-blue-900">{request.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">رقم الهاتف</p>
                <p className="font-medium text-blue-900">{request.phone}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">نوع الطلب</p>
                <p className="font-medium text-blue-900">{getRequestTypeLabel(parsedData.requestType)}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">البريد الإلكتروني</p>
                <p className="font-medium text-blue-900">{parsedData.email}</p>
              </div>
            </div>
          </div>

          {/* معلومات إضافية حسب نوع الطلب */}
          {parsedData.requestType === "business" && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-3">معلومات الشركة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-700">اسم الشركة</p>
                  <p className="font-medium text-green-900">{parsedData.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">موقع الشركة</p>
                  <a 
                    href={parsedData.companyWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-green-900 hover:underline"
                  >
                    {parsedData.companyWebsite}
                  </a>
                </div>
              </div>
            </div>
          )}

          {parsedData.requestType === "personal" && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-3">معلومات الهوية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-purple-700">نوع بطاقة الهوية</p>
                  <p className="font-medium text-purple-900">
                    {parsedData.idCardType === "national" ? "رقم وطني" : "بطاقة شخصية"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-purple-700">رقم بطاقة الهوية</p>
                  <p className="font-medium text-purple-900">{parsedData.idCardNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* حالة الطلب والتاريخ */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">معلومات إضافية</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">حالة الطلب</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">تاريخ الطلب</p>
                <p className="font-medium text-gray-900">{formatDate(request.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostRequestDetails;


