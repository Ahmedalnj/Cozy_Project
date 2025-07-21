"use client";

import { SafeListing } from "@/app/types";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ListingsTableProps {
  listings: SafeListing[];
}

const ListingsTable: React.FC<ListingsTableProps> = ({ listings }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/listings/${id}`)
        .then(() => {
          toast.success("Listing deleted");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "Error deleting listing");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Listings</h2>
      <div className="overflow-x-auto rounded-xl border">
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
            {listings.map((listing) => (
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListingsTable;
