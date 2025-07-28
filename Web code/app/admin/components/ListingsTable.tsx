"use client";

import { SafeListing } from "@/app/types";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface ListingsTableProps {
  listings: SafeListing[];
}

const LISTINGS_PER_PAGE = 10;

const ListingsTable: React.FC<ListingsTableProps> = ({ listings }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.success("تم حذف العقار");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "حدث خطأ أثناء الحذف");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  const filteredListings = useMemo(() => {
    return listings
      .filter(
        (listing) =>
          listing.title.toLowerCase().includes(search.toLowerCase()) ||
          listing.category.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortAsc
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [search, sortAsc, listings]);

  const totalPages = Math.ceil(filteredListings.length / LISTINGS_PER_PAGE);

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * LISTINGS_PER_PAGE;
    return filteredListings.slice(start, start + LISTINGS_PER_PAGE);
  }, [filteredListings, currentPage]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Listings</h2>

      {/* Search and Sort Bar */}
      <div className="flex flex-row-reverse items-center justify-between mb-4">
        <input
          type="text"
          placeholder="🔍 بحث بالعنوان أو الفئة..."
          className="border px-3 py-2 rounded-md w-full max-w-xs text-sm focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // إعادة للصفحة الأولى عند البحث
          }}
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center gap-1 text-sm text-gray-700 hover:text-black"
        >
          {sortAsc ? <FiChevronDown /> : <FiChevronUp />}
          ترتيب بالتاريخ
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Location</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Created At</th>
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
                  لا توجد عقارات مطابقة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
