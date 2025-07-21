import { formatCurrency } from "@/app/types/index"; // سنضيفها بعد قليل
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import EmptyState from "@/app/components/EmptyState";
import UsersTable from "@/app/(admin)/admin/components/UsersTable";
import ListingsTable from "@/app/(admin)/admin/components/ListingsTable";
import ReservationsTable from "@/app/(admin)/admin/components/ReservationsTable";

const AdminPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You do not have access to the admin dashboard."
      />
    );
  }

  // جلب البيانات من قاعدة البيانات
  const users = await prisma.user.count();
  const listings = await prisma.listing.count();
  const reservations = await prisma.reservation.count();
  const revenueData = await prisma.reservation.findMany({
    select: { totalPrice: true },
  });

  const totalRevenue = revenueData.reduce(
    (sum, r) => sum + (r.totalPrice || 0),
    0
  );

  const allUsersRaw = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const allUsers = allUsersRaw.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
  }));

  const allListingsRaw = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
  });

  const allListings = allListingsRaw.map((listing) => ({
    ...listing,
    createdAt: listing.createdAt.toISOString(),
  }));

  const allReservationsRaw = await prisma.reservation.findMany({
    include: {
      user: true,
      listing: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const allReservations = allReservationsRaw.map((reservation) => ({
    ...reservation,
    createdAt: reservation.createdAt.toISOString(),
    startDate: reservation.startDate.toISOString(),
    endDate: reservation.endDate.toISOString(),
    user: {
      name: reservation.user?.name ?? "",
      email: reservation.user?.email ?? "",
    },
    listing: {
      ...reservation.listing,
      createdAt: reservation.listing.createdAt.toISOString(),
    },
  }));

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" icon="👥" value={users} />
        <StatCard title="Total Listings " icon="🏠" value={listings} />
        <StatCard title="Total Reservations" icon="📅" value={reservations} />
        <StatCard
          title="Total Revenue"
          icon="💰"
          value={formatCurrency(totalRevenue)}
        />
      </div>
      <UsersTable users={allUsers} />
      <ListingsTable listings={allListings} />
      <ReservationsTable reservations={allReservations} />
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon?: string;
}) => (
  <div className="p-6 bg-white rounded-2xl shadow text-center">
    {icon && <div className="text-3xl mb-2">{icon}</div>}
    <h2 className="text-sm text-neutral-500">{title}</h2>
    <p className="text-2xl font-semibold text-black mt-2">{value}</p>
  </div>
);

export default AdminPage;
