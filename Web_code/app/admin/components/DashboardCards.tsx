// app/components/admin/DashboardCards.tsx
import prisma from "@/app/libs/prismadb";

export default async function DashboardCards() {
  try {
    // اجلب عدد المستخدمين، العقارات، الحجوزات، والإيرادات من جدول الحجوزات
    const [usersCount, listingsCount, reservationsCount, totalRevenue] =
      await Promise.all([
        prisma.user.count(),
        prisma.listing.count(),
        prisma.reservation.count(),
        prisma.reservation
          .findMany({
            select: { totalPrice: true },
          })
          .then((reservations) =>
            reservations.reduce((sum, r) => sum + (r.totalPrice ?? 0), 0)
          ),
      ]);

    const cards = [
      {
        title: "المستخدمين",
        value: usersCount,
        icon: "👥",
      },
      {
        title: "العقارات",
        value: listingsCount,
        icon: "🏠",
      },
      {
        title: "الحجوزات",
        value: reservationsCount,
        icon: "📅",
      },
      {
        title: "الإيرادات",
        value: `د.ل${totalRevenue}`,
        icon: "💰",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <div className="text-4xl">{card.icon}</div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("DashboardCards Error:", error);
    return (
      <div className="text-red-500">
        ⚠️ حدث خطأ أثناء تحميل بطاقات الإحصائيات.
      </div>
    );
  }
}
