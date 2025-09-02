"use client";

import { SafeListing } from "@/app/types";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FiChevronDown, FiChevronUp, FiRefreshCw, FiSearch, FiTrash2, FiHome, FiMapPin, FiDollarSign } from "react-icons/fi";
import { useTranslation } from "react-i18next";


interface ListingsTableProps {
  listings: SafeListing[];
  onRefresh?: () => Promise<void>;
  limit?: number;
}

type SortColumn =
  | "title"
  | "category"
  | "locationValue"
  | "price"
  | "createdAt";

const LISTINGS_PER_PAGE = 10;

const ListingsTable: React.FC<ListingsTableProps> = ({
  listings,
  onRefresh,
  limit,
}) => {
  const { t } = useTranslation("common");

  const [localListings, setLocalListings] = useState(listings);

  // Update local state when props change (dashboard refresh)
  useEffect(() => {
    setLocalListings(listings);
  }, [listings]);
  const [deletingId, setDeletingId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [sortBy, setSortBy] = useState<SortColumn>("createdAt");
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      if (onRefresh) {
        await onRefresh();
      } else {
        const res = await fetch("/api/admin/listings");
        if (!res.ok) throw new Error("فشل في جلب البيانات");
        const data: SafeListing[] = await res.json();
        setLocalListings(data);
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
        .delete(`/api/listings/${id}`)
        .then(async () => {
          toast.success("تم حذف العقار");
          setLocalListings((prev) =>
            prev.filter((listing) => listing.id !== id)
          );
          // Refresh dashboard data to update stats
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "apartment":
        return "🏢";
      case "house":
        return "🏠";
      case "villa":
        return "🏰";
      case "cabin":
        return "🏡";
      case "beach":
        return "🏖️";
      case "mountain":
        return "⛰️";
      case "city":
        return "🌆";
      default:
        return "🏠";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "apartment":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "house":
        return "bg-green-50 text-green-700 border-green-200";
      case "villa":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "cabin":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "beach":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "mountain":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "city":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const filteredListings = useMemo(() => {
    return localListings
      .filter(
        (listing) =>
          listing.title.toLowerCase().includes(search.toLowerCase()) ||
          listing.category.toLowerCase().includes(search.toLowerCase()) ||
          listing.locationValue.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        let valA = "";
        let valB = "";

        switch (sortBy) {
          case "title":
            valA = a.title.toLowerCase();
            valB = b.title.toLowerCase();
            break;
          case "category":
            valA = a.category.toLowerCase();
            valB = b.category.toLowerCase();
            break;
          case "locationValue":
            valA = a.locationValue.toLowerCase();
            valB = b.locationValue.toLowerCase();
            break;
          case "price":
            return sortAsc ? a.price - b.price : b.price - a.price;
          case "createdAt":
            return sortAsc
              ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }

        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [search, sortAsc, sortBy, localListings]);

  const totalPages = limit ? Math.ceil(Math.min(filteredListings.length, limit) / LISTINGS_PER_PAGE) : Math.ceil(filteredListings.length / LISTINGS_PER_PAGE);

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * LISTINGS_PER_PAGE;
    const end = limit ? Math.min(start + LISTINGS_PER_PAGE, limit) : start + LISTINGS_PER_PAGE;
    return filteredListings.slice(start, end);
  }, [filteredListings, currentPage, limit]);

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
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">جدول العقارات</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              عرض وإدارة جميع العقارات في النظام
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="البحث في العنوان، الفئة، أو الموقع..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              onClick={fetchListings}
              disabled={loading}
              className={`p-2 rounded-lg text-white transition-all duration-200 flex-shrink-0 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
              }`}
              title={t("refresh_data")}
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
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiHome className="h-4 w-4" />
                  <span className="hidden sm:inline">العنوان</span>
                  <span className="sm:hidden">🏠</span>
                  {renderSortIcon("title")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">الفئة</span>
                  <span className="sm:hidden">📂</span>
                  {renderSortIcon("category")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("locationValue")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiMapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">الموقع</span>
                  <span className="sm:hidden">📍</span>
                  {renderSortIcon("locationValue")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiDollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">السعر</span>
                  <span className="sm:hidden">💰</span>
                  {renderSortIcon("price")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">تاريخ الإنشاء</span>
                  <span className="sm:hidden">📅</span>
                  {renderSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="hidden sm:inline">الإجراءات</span>
                <span className="sm:hidden">⚙️</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedListings.length > 0 ? (
              paginatedListings.map((listing, index) => (
                <tr
                  key={listing.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-xs">
                        {listing.title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        ID: {listing.id.slice(-8)}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-base sm:text-lg">{getCategoryIcon(listing.category)}</span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium border ${getCategoryColor(
                          listing.category
                        )}`}
                      >
                        {listing.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-900 truncate max-w-xs">
                      📍 {listing.locationValue}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">
                      ${listing.price.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      لليلة الواحدة
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(listing.createdAt), "dd/MM/yyyy")}
                      </span>
                      <span className="text-gray-500">
                        {format(new Date(listing.createdAt), "HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={deletingId === listing.id}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="حذف العقار"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 sm:px-6 py-8 sm:py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
                    <div className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      لا توجد عقارات مطابقة
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
              عرض <span className="font-medium">{(currentPage - 1) * LISTINGS_PER_PAGE + 1}</span> إلى{" "}
              <span className="font-medium">
                {Math.min(currentPage * LISTINGS_PER_PAGE, filteredListings.length)}
              </span>{" "}
              من أصل <span className="font-medium">{filteredListings.length}</span> نتيجة
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

export default ListingsTable;
