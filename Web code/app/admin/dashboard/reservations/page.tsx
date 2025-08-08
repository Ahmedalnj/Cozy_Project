// app/admin/reservations/page.tsx
import prisma from "@/app/libs/prismadb";
import { SaveReservation } from "@/app/types"; // تأكد أن لديك نوع SafeReservation في types.ts
import ReservationsTable from "@/app/admin/components/ReservationsTable"; // تحتاج تنشئ هذا الكمبوننت

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      listing: true, // لو تريد بيانات العقار مع الحجز
      user: true, // لو تريد بيانات المستخدم مع الحجز
    },
  });

  const safeReservations: SaveReservation[] = reservations.map(
    (reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      user: {
        name: reservation.user.name,
        email: reservation.user.email,
      },
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    })
  );

  return (
    <div className="p-6 space-y-4">
      <ReservationsTable reservations={safeReservations} />
    </div>
  );
}
