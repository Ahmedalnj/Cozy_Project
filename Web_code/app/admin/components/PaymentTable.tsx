"use client";

import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp, FiRefreshCw, FiSearch } from "react-icons/fi";
import Avatar from "@/app/components/ui/Avatar";
import { useTranslation } from "react-i18next";


interface Payment {
  id: string;
  reservationId: string | null;
  userId: string;
  listingId: string;
  stripeSession: string;
  transactionId: string | null;
  paymentMethod: string | null;
  status: "PENDING" | "SUCCESS" | "FAILED" | "PAID";
  amount: number;
  currency: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  listing: {
    id: string;
    title: string;
    locationValue: string;
  };
  reservation: {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
  } | null;
}

interface PaymentTableProps {
  payments: Payment[];
  onRefresh?: () => Promise<void>;
  limit?: number;
}

type SortColumn = "user" | "listing" | "amount" | "status" | "paymentMethod" | "createdAt";

const PAYMENTS_PER_PAGE = 10;

const PaymentTable: React.FC<PaymentTableProps> = ({ payments, onRefresh, limit }) => {
  const { t } = useTranslation("common");
  const [localPayments, setLocalPayments] = useState(payments);

  // Update local state when props change (dashboard refresh)
  useEffect(() => {
    setLocalPayments(payments);
  }, [payments]);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [sortBy, setSortBy] = useState<SortColumn>("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);



  const fetchPayments = async () => {
    if (loading) return;
    try {
      setLoading(true);
      if (onRefresh) {
        await onRefresh();
      } else {
        const res = await fetch("/api/admin/payments");
        if (!res.ok) throw new Error("فشل في جلب البيانات");
        const data: Payment[] = await res.json();
        setLocalPayments(data);
        setSearch("");
        setCurrentPage(1);
        toast.success("تم تحديث البيانات");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء جلب البيانات"
      );
    } finally {
      setLoading(false);
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SUCCESS":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "FAILED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "مدفوع";
      case "SUCCESS":
        return "ناجح";
      case "PENDING":
        return "معلق";
      case "FAILED":
        return "فشل";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string | null) => {
    switch (method) {
      case "card":
        return "بطاقة ائتمان";
      case "cash":
        return "نقدي";
      default:
        return method || "غير محدد";
    }
  };

  const getPaymentMethodIcon = (method: string | null) => {
    switch (method) {
      case "card":
        return "💳";
      case "cash":
        return "💰";
      default:
        return "❓";
    }
  };

  const filteredPayments = useMemo(() => {
    return localPayments
      .filter(
        (payment) =>
          payment.user.name?.toLowerCase().includes(search.toLowerCase()) ||
          payment.user.email?.toLowerCase().includes(search.toLowerCase()) ||
          payment.listing.title.toLowerCase().includes(search.toLowerCase()) ||
          payment.transactionId?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        let valA = "";
        let valB = "";

        switch (sortBy) {
          case "user":
            valA = a.user.name?.toLowerCase() || "";
            valB = b.user.name?.toLowerCase() || "";
            break;
          case "listing":
            valA = a.listing.title.toLowerCase();
            valB = b.listing.title.toLowerCase();
            break;
          case "amount":
            return sortAsc ? a.amount - b.amount : b.amount - a.amount;
          case "status":
            valA = a.status.toLowerCase();
            valB = b.status.toLowerCase();
            break;
          case "paymentMethod":
            valA = (a.paymentMethod || "").toLowerCase();
            valB = (b.paymentMethod || "").toLowerCase();
            break;
          case "createdAt":
            return sortAsc
              ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [search, sortAsc, sortBy, localPayments]);

  const totalPages = limit ? Math.ceil(Math.min(filteredPayments.length, limit) / PAYMENTS_PER_PAGE) : Math.ceil(filteredPayments.length / PAYMENTS_PER_PAGE);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * PAYMENTS_PER_PAGE;
    const end = limit ? Math.min(start + PAYMENTS_PER_PAGE, limit) : start + PAYMENTS_PER_PAGE;
    return filteredPayments.slice(start, end);
  }, [filteredPayments, currentPage, limit]);

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) return null;
    return sortAsc ? (
      <FiChevronUp className="inline ml-1 h-4 w-4" />
    ) : (
      <FiChevronDown className="inline ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">جدول المدفوعات</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              عرض وإدارة جميع معاملات الدفع في النظام
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في المستخدمين، العقارات، أو معرف المعاملة..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              onClick={fetchPayments}
              disabled={loading}
              className={`p-2 rounded-lg text-white transition-all duration-200 flex-shrink-0 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
              }`}
              title="تحديث البيانات"
              aria-label={t("refresh_data")}
            >
              <FiRefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("user")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">المستخدم</span>
                  <span className="sm:hidden">👤</span>
                  {renderSortIcon("user")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("listing")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">العقار</span>
                  <span className="sm:hidden">🏠</span>
                  {renderSortIcon("listing")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">المبلغ</span>
                  <span className="sm:hidden">💰</span>
                  {renderSortIcon("amount")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">الحالة</span>
                  <span className="sm:hidden">📊</span>
                  {renderSortIcon("status")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("paymentMethod")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">طريقة الدفع</span>
                  <span className="sm:hidden">💳</span>
                  {renderSortIcon("paymentMethod")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">التاريخ</span>
                  <span className="sm:hidden">📅</span>
                  {renderSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="hidden sm:inline">معرف المعاملة</span>
                <span className="sm:hidden">🆔</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-shrink-0">
                        <Avatar src={payment.user?.image} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {payment.user.name || "بدون اسم"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          {payment.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-xs">
                        {payment.listing.title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        📍 {payment.listing.locationValue}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">
                      ${payment.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.currency.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium border ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-base sm:text-lg">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                      <span className="text-xs sm:text-sm text-gray-900">
                        {getPaymentMethodText(payment.paymentMethod)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(payment.createdAt), "dd/MM/yyyy")}
                      </span>
                      <span className="text-gray-500">
                        {format(new Date(payment.createdAt), "HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-md text-xs font-mono bg-gray-100 text-gray-800">
                      {payment.transactionId ? 
                        payment.transactionId.slice(-12) : 
                        "غير متوفر"
                      }
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 sm:px-6 py-8 sm:py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
                    <div className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      لا توجد مدفوعات مطابقة
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      جرب تغيير معايير البحث
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              عرض <span className="font-medium">{(currentPage - 1) * PAYMENTS_PER_PAGE + 1}</span> إلى{" "}
              <span className="font-medium">
                {Math.min(currentPage * PAYMENTS_PER_PAGE, filteredPayments.length)}
              </span>{" "}
              من أصل <span className="font-medium">{filteredPayments.length}</span> نتيجة
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                السابق
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default PaymentTable;
