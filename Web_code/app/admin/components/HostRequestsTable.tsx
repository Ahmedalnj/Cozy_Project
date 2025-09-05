"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Button from "@/app/components/ui/Button";
import HostRequestDetails from "./HostRequestDetails";
import { useTranslation } from "react-i18next";

interface HostRequest {
  id: string;
  status: string;
  fullName: string;
  phone: string;
  idCardUrl: string; // يحتوي على JSON مع جميع البيانات
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    hostStatus: string;
  };
}

interface ParsedHostRequestData {
  requestType: string;
  email: string;
  companyName?: string;
  companyWebsite?: string;
  idCardNumber?: string;
  idCardType?: string;
}

const HostRequestsTable: React.FC = () => {
  const [hostRequests, setHostRequests] = useState<HostRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<HostRequest | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchHostRequests();
  }, []);

  const fetchHostRequests = async () => {
    try {
      const response = await fetch("/api/admin/host-requests");
      if (response.ok) {
        const data = await response.json();
        setHostRequests(data);
      } else {
        toast.error("فشل في جلب طلبات المضيف");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (hostRequestId: string) => {
    setProcessingId(hostRequestId);
    try {
      const response = await fetch("/api/admin/host-requests/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostRequestId }),
      });

      if (response.ok) {
        toast.success("تمت الموافقة على الطلب بنجاح");
        fetchHostRequests(); // تحديث القائمة
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "فشل في الموافقة على الطلب");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الموافقة على الطلب");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (hostRequestId: string) => {
    setProcessingId(hostRequestId);
    try {
      const response = await fetch("/api/admin/host-requests/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostRequestId }),
      });

      if (response.ok) {
        toast.success("تم رفض الطلب بنجاح");
        fetchHostRequests(); // تحديث القائمة
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "فشل في رفض الطلب");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء رفض الطلب");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { text: t("request_pending"), className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { text: t("request_approved"), className: "bg-green-100 text-green-800" },
      REJECTED: { text: t("request_rejected"), className: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.text}
      </span>
    );
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

  const parseHostRequestData = (idCardUrl: string): ParsedHostRequestData => {
    try {
      return JSON.parse(idCardUrl);
    } catch {
      return {
        requestType: t("not_specified"),
        email: "",
      };
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      PENDING: { text: t("request_pending"), className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { text: t("request_approved"), className: "bg-green-100 text-green-800" },
      REJECTED: { text: t("request_rejected"), className: "bg-red-100 text-red-800" },
    };
    return configs[status as keyof typeof configs] || { text: status, className: "bg-gray-100 text-gray-800" };
  };

  const getRequestTypeLabel = (type: string) => {
    if (type === "personal") {
      return t("personal");
    } else if (type === "business") {
      return t("business_or_office");
    }
    return t("not_specified");
  };

  const getRequestTypeBadge = (requestType: string) => {
    const isPersonal = requestType === "personal";
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isPersonal 
          ? "bg-green-100 text-green-800" 
          : "bg-blue-100 text-blue-800"
      }`}>
        {getRequestTypeLabel(requestType)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (hostRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          لا توجد طلبات مضيف
        </h3>
        <p className="text-gray-500">
          لم يتم تقديم أي طلبات للانضمام كمضيف بعد.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          طلبات الانضمام كمضيف
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          إدارة طلبات المستخدمين للانضمام كمضيفين
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المستخدم
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نوع الطلب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الاسم الكامل
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الهاتف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ الطلب
              </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التفاصيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hostRequests.map((request) => {
              const parsedData = parseHostRequestData(request.idCardUrl);
              
              return (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={request.user.image || "/images/user.png"}
                          alt={request.user.name || "مستخدم"}
                        />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.user.name || "بدون اسم"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRequestTypeBadge(parsedData.requestType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {parsedData.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      label="عرض التفاصيل"
                      onClick={() => setSelectedRequest(request)}
                      small
                      outline
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === "PENDING" && (
                      <div className="flex space-x-2 space-x-reverse">
                        <Button
                          label="موافقة"
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                          small
                          className="bg-green-500 hover:bg-green-600 text-white"
                        />
                        <Button
                          label="رفض"
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                          small
                          outline
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        />
                      </div>
                    )}
                    {request.status === "APPROVED" && (
                      <span className="text-green-600 font-medium">تمت الموافقة</span>
                    )}
                    {request.status === "REJECTED" && (
                      <span className="text-red-600 font-medium">تم الرفض</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hostRequests.some(r => r.status === "PENDING") && (
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm text-blue-800">
                <strong>ملاحظة:</strong> يمكنك الموافقة أو رفض الطلبات المعلقة فقط.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* مكون عرض التفاصيل */}
      {selectedRequest && (
        <HostRequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default HostRequestsTable;
