"use client";

import { SafeListing } from "@/app/types";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
// import { useRouter } from "next/navigation";
import { FiChevronDown, FiChevronUp, FiRefreshCw } from "react-icons/fi";

interface ListingsTableProps {
  listings: SafeListing[];
  onRefresh?: () => Promise<void>;
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
}) => {
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

  const filteredListings = useMemo(() => {
    return localListings
      .filter(
        (listing) =>
          listing.title.toLowerCase().includes(search.toLowerCase()) ||
          listing.category.toLowerCase().includes(search.toLowerCase()) ||
          listing.locationValue.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (sortBy === "price") {
          return sortAsc
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number);
        }

        if (sortBy === "createdAt") {
          return sortAsc
            ? new Date(valA as string).getTime() -
                new Date(valB as string).getTime()
            : new Date(valB as string).getTime() -
                new Date(valA as string).getTime();
        }

        // لباقي الأعمدة نصية: title, category, locationValue
        if (typeof valA === "string" && typeof valB === "string") {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }

        return 0;
      });
  }, [search, sortAsc, sortBy, localListings]);

  const totalPages = Math.ceil(filteredListings.length / LISTINGS_PER_PAGE);

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * LISTINGS_PER_PAGE;
    return filteredListings.slice(start, start + LISTINGS_PER_PAGE);
  }, [filteredListings, currentPage]);

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc); // إذا ضغط على نفس العمود غير اتجاه الترتيب
    } else {
      setSortBy(column); // غير العمود المرتب عليه
      setSortAsc(true); // بدء بترتيب تصاعدي
    }
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) return null;
    return sortAsc ? (
      <FiChevronUp className="inline" />
    ) : (
      <FiChevronDown className="inline" />
    );
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [filteredListings, totalPages, currentPage]);

  return (
    <div className="mt-5">
      <h2 className="text-5xl font-semibold mb-4 text-center p-4">
        Listing Table
      </h2>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by Title or Category"
          className="border px-3 py-2 rounded-md w-full max-w-xs text-sm focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={fetchListings}
          disabled={loading}
          className={`p-2 rounded text-white ${
            loading
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
                className="py-2 px-4 cursor-pointer select-none"
                onClick={() => handleSort("title")}
              >
                Title {renderSortIcon("title")}
              </th>
              <th
                className="py-2 px-4 cursor-pointer select-none"
                onClick={() => handleSort("category")}
              >
                Category {renderSortIcon("category")}
              </th>
              <th
                className="py-2 px-4 cursor-pointer select-none"
                onClick={() => handleSort("locationValue")}
              >
                Location {renderSortIcon("locationValue")}
              </th>
              <th
                className="py-2 px-4 cursor-pointer select-none"
                onClick={() => handleSort("price")}
              >
                Price {renderSortIcon("price")}
              </th>
              <th
                className="py-2 px-4 cursor-pointer select-none"
                onClick={() => handleSort("createdAt")}
              >
                Created At {renderSortIcon("createdAt")}
              </th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedListings.map((listing) => (
              <tr key={listing.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{listing.title}</td>
                <td className="py-2 px-4">{listing.category}</td>
                <td className="py-2 px-4">{listing.locationValue}</td>
                <td className="py-2 px-4">${listing.price}</td>
                <td className="py-2 px-4">
                  {format(new Date(listing.createdAt), "yyyy-MM-dd")}
                </td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleDelete(listing.id)}
                    disabled={deletingId === listing.id}
                    className={`px-3 py-1 text-sm rounded text-white ${
                      deletingId === listing.id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {deletingId === listing.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {paginatedListings.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-gray-400 py-6 font-semibold"
                >
                  No Listings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

export default ListingsTable;
