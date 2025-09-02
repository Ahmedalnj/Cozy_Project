"use client";

import { SaveReservation } from "@/app/types";
import axios from "axios";

import { useState, useMemo, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp, FiRefreshCw, FiSearch, FiTrash2, FiCalendar, FiUser, FiHome, FiDollarSign } from "react-icons/fi";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface ReservationsTableProps {
  reservations: SaveReservation[];
  onRefresh?: () => Promise<void>;
  limit?: number;
}

type SortColumn = "listing" | "guest" | "startDate" | "endDate" | "totalPrice" | "createdAt";

const RESERVATIONS_PER_PAGE = 10;

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations,
  onRefresh,
  limit,
}) => {
  const { t } = useTranslation("common");
  const [localReservations, setLocalReservations] = useState(reservations);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [sortBy, setSortBy] = useState<SortColumn>("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");


  // Update local state when props change (dashboard refresh)
  useEffect(() => {
    setLocalReservations(reservations);
  }, [reservations]);

  const fetchReservations = async () => {
    if (loading) return;
    try {
      setLoading(true);
      if (onRefresh) {
        await onRefresh();
      } else {
        const res = await fetch("/api/admin/reservations");
        if (!res.ok) throw new Error("فشل في جلب البيانات");
        const data: SaveReservation[] = await res.json();
        setLocalReservations(data);
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

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingId(id);
      axios
        .delete(`/api/reservations/${id}`)
        .then(async () => {
          toast.success("تم حذف الحجز بنجاح");
          setLocalReservations((prev) =>
            prev.filter((reservation) => reservation.id !== id)
          );
          if (onRefresh) {
            await onRefresh();
          }
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "حدث خطأ أثناء الحذف");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [onRefresh]
  );

  const getStatusColor = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "bg-blue-50 text-blue-700 border-blue-200"; // قادم
    } else if (now >= start && now <= end) {
      return "bg-green-50 text-green-700 border-green-200"; // نشط
    } else {
      return "bg-gray-50 text-gray-700 border-gray-200"; // منتهي
    }
  };

  const getStatusText = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "قادم";
    } else if (now >= start && now <= end) {
      return "نشط";
    } else {
      return "منتهي";
    }
  };

  const getStatusIcon = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "⏳";
    } else if (now >= start && now <= end) {
      return "✅";
    } else {
      return "📅";
    }
  };

  // وظيفة تغيير الفرز عند الضغط على رؤوس الأعمدة
  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  // إظهار الأيقونة المناسبة للفرز
  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) return null;
    return sortAsc ? (
      <FiChevronUp className="inline ml-1 h-4 w-4" />
    ) : (
      <FiChevronDown className="inline ml-1 h-4 w-4" />
    );
  };

  // تصفية وفرز الحجوزات
  const filteredReservations = useMemo(() => {
    return localReservations
      .filter((res) => {
        const guestName = res.user?.name?.toLowerCase() || "";
        const guestEmail = res.user?.email?.toLowerCase() || "";
        const listingTitle = res.listing?.title.toLowerCase() || "";
        const term = search.toLowerCase();

        return (
          guestName.includes(term) ||
          guestEmail.includes(term) ||
          listingTitle.includes(term)
        );
      })
      .sort((a, b) => {
        let valA: string | number = "";
        let valB: string | number = "";

        switch (sortBy) {
          case "listing":
            valA = a.listing?.title.toLowerCase() || "";
            valB = b.listing?.title.toLowerCase() || "";
            break;
          case "guest":
            valA = a.user?.name?.toLowerCase() || "";
            valB = b.user?.name?.toLowerCase() || "";
            break;
          case "startDate":
            return sortAsc
              ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
              : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
          case "endDate":
            return sortAsc
              ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
              : new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
          case "totalPrice":
            return sortAsc ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
          case "createdAt":
            return sortAsc
              ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return sortAsc ? valA.toString().localeCompare(valB.toString()) : valB.toString().localeCompare(valA.toString());
      });
  }, [search, sortAsc, sortBy, localReservations]);

  const totalPages = limit ? Math.ceil(Math.min(filteredReservations.length, limit) / RESERVATIONS_PER_PAGE) : Math.ceil(filteredReservations.length / RESERVATIONS_PER_PAGE);

  const paginatedReservations = useMemo(() => {
    const start = (currentPage - 1) * RESERVATIONS_PER_PAGE;
    const end = limit ? Math.min(start + RESERVATIONS_PER_PAGE, limit) : start + RESERVATIONS_PER_PAGE;
    return filteredReservations.slice(start, end);
  }, [filteredReservations, currentPage, limit]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">جدول الحجوزات</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              عرض وإدارة جميع الحجوزات في النظام
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في الضيف أو العقار..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              onClick={fetchReservations}
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
                onClick={() => handleSort("listing")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiHome className="h-4 w-4" />
                  <span className="hidden sm:inline">العقار</span>
                  <span className="sm:hidden">🏠</span>
                  {renderSortIcon("listing")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("guest")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiUser className="h-4 w-4" />
                  <span className="hidden sm:inline">الضيف</span>
                  <span className="sm:hidden">👤</span>
                  {renderSortIcon("guest")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("startDate")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiCalendar className="h-4 w-4" />
                  <span className="hidden sm:inline">تاريخ البداية</span>
                  <span className="sm:hidden">📅</span>
                  {renderSortIcon("startDate")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("endDate")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiCalendar className="h-4 w-4" />
                  <span className="hidden sm:inline">تاريخ النهاية</span>
                  <span className="sm:hidden">📅</span>
                  {renderSortIcon("endDate")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("totalPrice")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiDollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">السعر الإجمالي</span>
                  <span className="sm:hidden">💰</span>
                  {renderSortIcon("totalPrice")}
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="hidden sm:inline">الحالة</span>
                <span className="sm:hidden">📊</span>
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="hidden sm:inline">الإجراءات</span>
                <span className="sm:hidden">⚙️</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedReservations.length > 0 ? (
              paginatedReservations.map((reservation, index) => (
                <tr
                  key={reservation.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-xs">
                        {reservation.listing?.title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        ID: {reservation.id.slice(-8)}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {reservation.user?.name || "غير محدد"}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        {reservation.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(reservation.startDate), "dd/MM/yyyy")}
                      </span>
                      <span className="text-gray-500">
                        {format(new Date(reservation.startDate), "HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(reservation.endDate), "dd/MM/yyyy")}
                      </span>
                      <span className="text-gray-500">
                        {format(new Date(reservation.endDate), "HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">
                      ${reservation.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      إجمالي
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <span className="text-base sm:text-lg">{getStatusIcon(reservation.startDate, reservation.endDate)}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium border ${getStatusColor(
                          reservation.startDate,
                          reservation.endDate
                        )}`}
                      >
                        {getStatusText(reservation.startDate, reservation.endDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      disabled={deletingId === reservation.id}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="حذف الحجز"
                    >
                      <FiTrash2 size={16} />
                    </button>
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
                      لا توجد حجوزات مطابقة
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
              عرض <span className="font-medium">{(currentPage - 1) * RESERVATIONS_PER_PAGE + 1}</span> إلى{" "}
              <span className="font-medium">
                {Math.min(currentPage * RESERVATIONS_PER_PAGE, filteredReservations.length)}
              </span>{" "}
              من أصل <span className="font-medium">{filteredReservations.length}</span> نتيجة
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

export default ReservationsTable;
