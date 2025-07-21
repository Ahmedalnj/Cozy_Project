"use client";

import { SaveReservation } from "@/app/types";

interface ReservationsTableProps {
  reservations: SaveReservation[];
}

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations,
}) => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Reservations</h2>
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Listing</th>
              <th className="py-2 px-4">Guest</th>
              <th className="py-2 px-4">Start</th>
              <th className="py-2 px-4">End</th>
              <th className="py-2 px-4">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{res.listing?.title || "Unknown"}</td>
                <td className="py-2 px-4">
                  {res.user?.name || res.user?.email}
                </td>
                <td className="py-2 px-4">
                  {new Date(res.startDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">
                  {new Date(res.endDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4">${res.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsTable;
