"use client";

import { SaveReservation } from "@/app/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useMemo, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp, FiRefreshCw } from "react-icons/fi";

interface ReservationsTableProps {
  reservations: SaveReservation[];
  onRefresh?: () => Promise<void>;
}

type SortColumn = "listing" | "guest" | "startDate" | "endDate" | "totalPrice";

const RESERVATIONS_PER_PAGE = 10;

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations,
  onRefresh,
}) => {
  const [search, setSearch] = useState("");

  // Update local state when props change (dashboard refresh)
  useEffect(() => {
    // Reset search and pagination when data changes
    setSearch("");
    setCurrentPage(1);
  }, [reservations]);
  const [sortAsc, setSortAsc] = useState(true);
  const [sortBy, setSortBy] = useState<SortColumn>("startDate");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // وظيفة تغيير الفرز عند الضغط على رؤوس الأعمدة
  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc); // عكس اتجاه الفرز إذا نفس العمود
    } else {
      setSortBy(column);
      setSortAsc(true); // فرز تصاعدي بشكل افتراضي
    }
  };

  // إظهار الأيقونة المناسبة للفرز
  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) return null;
    return sortAsc ? (
      <FiChevronUp className="inline ml-1" />
    ) : (
      <FiChevronDown className="inline ml-1" />
    );
  };

  // تصفية وفرز الحجوزات
  const filteredReservations = useMemo(() => {
    return reservations
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
            valA = new Date(a.startDate).getTime();
            valB = new Date(b.startDate).getTime();
            break;
          case "endDate":
            valA = new Date(a.endDate).getTime();
            valB = new Date(b.endDate).getTime();
            break;
          case "totalPrice":
            valA = a.totalPrice;
            valB = b.totalPrice;
            break;
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [search, sortAsc, sortBy, reservations]);

  const totalPages = Math.ceil(
    filteredReservations.length / RESERVATIONS_PER_PAGE
  );

  const paginatedReservations = useMemo(() => {
    const start = (currentPage - 1) * RESERVATIONS_PER_PAGE;
    return filteredReservations.slice(start, start + RESERVATIONS_PER_PAGE);
  }, [filteredReservations, currentPage]);

  const [CancelId, setCancelId] = useState("");

  const handleCancel = useCallback(
    (id: string) => {
      setCancelId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(async () => {
          toast.success("تم إلغاء الحجز");
          // Refresh dashboard data to update stats
          if (onRefresh) {
            await onRefresh();
          } else {
            router.refresh();
          }
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.error || "حدث خطأ أثناء إلغاء الحجز"
          );
        })
        .finally(() => {
          setCancelId("");
        });
    },
    [router, onRefresh]
  );

  return (
    <div className="mt-10">
      <h2 className="text-5xl font-semibold mb-4 text-center p-4">
        Reservations
      </h2>

      {/* شريط البحث */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by Guest or Email or Name"
          className="border px-3 py-2 rounded-md w-full max-w-xs text-sm focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={onRefresh || (() => window.location.reload())}
          disabled={!onRefresh}
          className={`p-2 rounded text-white ${
            !onRefresh
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } transition`}
          title="تحديث"
          aria-label="تحديث"
        >
          <FiRefreshCw size={20} />
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs tracking-wider">
              <th
                className="py-3 px-6 cursor-pointer select-none"
                onClick={() => handleSort("listing")}
              >
                Listing {renderSortIcon("listing")}
              </th>
              <th
                className="py-3 px-6 cursor-pointer select-none"
                onClick={() => handleSort("guest")}
              >
                Guest {renderSortIcon("guest")}
              </th>
              <th
                className="py-3 px-6 cursor-pointer select-none"
                onClick={() => handleSort("startDate")}
              >
                Start Date {renderSortIcon("startDate")}
              </th>
              <th
                className="py-3 px-6 cursor-pointer select-none"
                onClick={() => handleSort("endDate")}
              >
                End Date {renderSortIcon("endDate")}
              </th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReservations.map((res) => (
              <tr key={res.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-6">{res.listing?.title || "Unknown"}</td>
                <td className="py-3 px-6">
                  {res.user?.name || res.user?.email || "Unknown"}
                </td>
                <td className="py-3 px-6">
                  {new Date(res.startDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-6">
                  {new Date(res.endDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleCancel(res.id)}
                    disabled={CancelId === res.id}
                    className={`px-3 py-1 text-sm rounded text-white ${
                      CancelId === res.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {CancelId === res.id
                      ? "Cancelling..."
                      : "Cancel Reservation"}
                  </button>
                </td>
              </tr>
            ))}
            {paginatedReservations.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-400 py-6 font-semibold"
                >
                  No Reservations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* أزرار التنقل بين الصفحات */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 hover:bg-blue-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsTable;
