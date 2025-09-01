"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SafeUser, SafeListing, SaveReservation } from "@/app/types";
import { formatCurrency } from "@/app/types";

// تعريف واجهة الدفع
interface Payment {
  id: string;
  reservationId: string | null;
  userId: string;
  listingId: string;
  stripeSession: string;
  transactionId: string | null;
  paymentMethod: string | null;
  status: "PENDING" | "SUCCESS" | "FAILED" | "PAID";
  amount: number;
  currency: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  listing: {
    id: string;
    title: string;
    locationValue: string;
  };
  reservation: {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
  } | null;
}
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import UsersTable from "@/app/admin/components/UsersTable";
import ListingsTable from "@/app/admin/components/ListingsTable";
import ReservationsTable from "@/app/admin/components/ReservationsTable";
import PaymentTable from "@/app/admin/components/PaymentTable";
import { RefreshCw, Calendar, Search, ShieldCheck } from "lucide-react";

interface DashboardData {
  users: SafeUser[];
  listings: SafeListing[];
  reservations: SaveReservation[];
  payments: Payment[];
  stats: {
    totalUsers: number;
    totalListings: number;
    totalReservations: number;
    totalPayments: number;
    totalRevenue: number;
  };
}

// ---------- Helpers ----------
// دالة للتحقق من أن التاريخ ضمن النطاق المحدد
function isWithinRange(dateStr: string | Date, range: RangeKey) {
  if (range === "all") return true; // إذا كان النطاق "all" نعرض كل شيء
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return true; // إذا كان غير معروف، لا تفلتر
  const now = new Date();
  const ms = { "7d": 7, "30d": 30, "90d": 90 }[range] * 24 * 60 * 60 * 1000;
  return now.getTime() - d.getTime() <= ms;
}

function monthKey(dateStr: string | Date) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "غير معروف";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "2-digit",
  }).format(d);
}

function classNames(...arr: (string | false | null | undefined)[]) {
  return arr.filter(Boolean).join(" ");
}

type RangeKey = "7d" | "30d" | "90d" | "all";

// ---------- Page ----------
const AdminPage = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("all");
  const [query, setQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  // التحكم في الوصول (الدور)
  useEffect(() => {
    fetch("/api/admin/currentUser")
      .then((res) => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then((user: SafeUser) => setCurrentUser(user))
      .catch(() => router.push("/")); // redirect if not admin
  }, [router]);

  // جلب بيانات لوحة التحكم (useCallback -> لإصلاح exhaustive-deps)
  const fetchDashboardData = useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) setLoading(true);
        setError(null);

        const res = await fetch(`/api/admin/dashboard`);
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/");
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const payload: DashboardData = await res.json();
        setData(payload);
      } catch (e) {
        console.error(e);
        setError("فشل في تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى.");
      } finally {
        if (!isRefresh) setLoading(false);
      }
    },
    [router]
  );

  // التحميل الأولي
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // التحديث التلقائي الاختياري
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => fetchDashboardData(true), 30000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchDashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData(true);
    setRefreshing(false);
  };

  // المجموعات المفلترة للجداول والرسوم البيانية
  const filtered = useMemo(() => {
    if (!data) return null;

    const match = (text: unknown) =>
      String(text ?? "")
        .toLowerCase()
        .includes(query.trim().toLowerCase());

    // فلترة المستخدمين حسب النطاق الزمني والبحث
    const users = data.users.filter(
      (u) =>
        isWithinRange(
          (u as SafeUser & { createdAt?: string }).createdAt ?? new Date(),
          range
        ) &&
        (query ? match(u.name) || match(u.email) || match(u.id) : true)
    );

    const listings = data.listings.filter(
      (l) =>
        isWithinRange((l as SafeListing & { createdAt?: string }).createdAt ?? new Date(), range) &&
        (query
          ? match(l.title) || match(l.description) || match(l.id)
          : true)
    );

    const reservations = data.reservations.filter(
      (r) =>
        isWithinRange(
          (r as SaveReservation & { createdAt?: string; startDate?: string }).createdAt ?? 
          (r as SaveReservation & { createdAt?: string; startDate?: string }).startDate ?? new Date(),
          range
        ) &&
        (query
          ? match(r.id) ||
            match((r as SaveReservation & { guestName?: string; listingTitle?: string }).guestName ?? '') ||
            match((r as SaveReservation & { guestName?: string; listingTitle?: string }).listingTitle ?? '')
          : true)
    );

    const payments = (data.payments || []).filter(
      (p) =>
        isWithinRange(
          (p as Payment & { createdAt?: string }).createdAt ?? new Date(),
          range
        ) &&
        (query
          ? match(p.id) ||
            match(p.transactionId ?? '') ||
            match(p.user?.name ?? '') ||
            match(p.listing?.title ?? '')
          : true)
    );

    // استخراج الإحصائيات للنطاق المحدد من الحجوزات
    const computedRevenue = reservations.reduce((sum, r) => {
      const val = Number((r as SaveReservation & { totalPrice?: number; price?: number }).totalPrice ?? 
                     (r as SaveReservation & { totalPrice?: number; price?: number }).price ?? 0);
      return sum + (Number.isFinite(val) ? val : 0);
    }, 0);

    // إرجاع البيانات المفلترة مع الإحصائيات المحسوبة
    return { users, listings, reservations, payments, computedRevenue };
  }, [data, query, range]);

  // بيانات الرسم البياني (حسب الشهر)
  const chartData = useMemo(() => {
    if (!filtered)
      return [] as { month: string; reservations: number; revenue: number }[];
    const map = new Map<string, { reservations: number; revenue: number }>();
    for (const r of filtered.reservations) {
      const key = monthKey(
        (r as SaveReservation & { createdAt?: string; startDate?: string }).createdAt ?? 
        (r as SaveReservation & { createdAt?: string; startDate?: string }).startDate ?? new Date()
      );
      const prev = map.get(key) ?? { reservations: 0, revenue: 0 };
      const price = Number((r as SaveReservation & { totalPrice?: number; price?: number }).totalPrice ?? 
                     (r as SaveReservation & { totalPrice?: number; price?: number }).price ?? 0);
      map.set(key, {
        reservations: prev.reservations + 1,
        revenue: prev.revenue + (Number.isFinite(price) ? price : 0),
      });
    }
    return Array.from(map.entries()).map(([month, v]) => ({ month, ...v }));
  }, [filtered]);

  // -------------- واجهة المستخدم --------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#00B4D8] border-solid" />
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#00B4D8] border-solid" />
      </div>
    );
  }

  // السماح للمدراء فقط
  if (currentUser.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-3" dir="rtl">{error}</h2>
        <button
          onClick={onRefresh}
          className="px-5 py-2 bg-[#00B4D8] text-white rounded-lg shadow hover:bg-[#0099CC] transition"
        >
          حاول مرة أخرى
        </button>
      </div>
    );
  }

  if (!data || !filtered) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2" dir="rtl">
            لا توجد بيانات متاحة
          </h2>
          <p className="text-gray-500" dir="rtl">تعذر تحميل بيانات لوحة التحكم.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* الشريط العلوي */}
      <div className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#00B4D8]" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight" dir="rtl">
              لوحة تحكم المدير
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className={classNames(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm border",
                "bg-[#00B4D8] text-white hover:bg-[#0099CC]",
                refreshing && "opacity-60 cursor-not-allowed"
              )}
            >
              <RefreshCw
                className={classNames("w-4 h-4", refreshing && "animate-spin")}
              />
              {refreshing ? "جاري التحديث" : "تحديث"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* عناصر التحكم */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="col-span-2 flex items-center gap-2 bg-white rounded-xl border border-gray-200 shadow-sm px-3">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="البحث في المستخدمين، العقارات، الحجوزات..."
              dir="rtl"
              className="w-full py-2 outline-none text-sm"
            />
          </div>
          <div className="flex items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 shadow-sm px-3 py-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                className="text-sm bg-transparent outline-none"
                value={range}
                onChange={(e) => setRange(e.target.value as RangeKey)}
              >
                <option value="7d">آخر 7 أيام</option>
                <option value="30d">آخر 30 يوم</option>
                <option value="90d">آخر 90 يوم</option>
                <option value="all">كل الوقت</option>
              </select>
            </div>
                          <label className="flex items-center gap-2 text-sm" dir="rtl">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              تحديث تلقائي
            </label>
          </div>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="إجمالي المستخدمين"
            value={data.stats.totalUsers}
            subtitle={labelFromRange(range)}
            gradient="from-blue-400 to-blue-600"
            emoji="👥"
          />
          <StatCard
            title="إجمالي العقارات"
            value={data.stats.totalListings}
            subtitle={labelFromRange(range)}
            gradient="from-emerald-400 to-emerald-600"
            emoji="🏠"
          />
          <StatCard
            title="إجمالي الحجوزات"
            value={filtered.reservations.length}
            subtitle={labelFromRange(range)}
            gradient="from-purple-400 to-purple-600"
            emoji="📅"
          />
          <StatCard
            title="إجمالي المدفوعات"
            value={filtered.payments.length}
            subtitle={labelFromRange(range)}
            gradient="from-indigo-400 to-indigo-600"
            emoji="💳"
          />
          <StatCard
            title="الإيرادات"
            value={formatCurrency(
              filtered.computedRevenue || data.stats.totalRevenue
            )}
            subtitle={labelFromRange(range)}
            gradient="from-amber-400 to-amber-600"
            emoji="💰"
          />
        </div>

        {/* الرسوم البيانية */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800" dir="rtl">
                الحجوزات حسب الشهر
              </h3>
              <LegendBadge>خط</LegendBadge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(v: number) => [v, "الحجوزات"]} />
                  <Line type="monotone" dataKey="reservations" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800" dir="rtl">الإيرادات حسب الشهر</h3>
              <LegendBadge>أعمدة</LegendBadge>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(v: number) => [
                      formatCurrency(v || 0),
                      "الإيرادات",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#00B4D8"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* الجداول */}
        <div className="grid grid-cols-1 gap-6">
          <Card title={`أحدث المستخدمين (${filtered.users.length} من ${data.stats.totalUsers})`}>
            <UsersTable users={filtered.users} onRefresh={onRefresh} limit={5} />
          </Card>
          <Card title={`أحدث العقارات (${filtered.listings.length} من ${data.stats.totalListings})`}>
            <ListingsTable listings={filtered.listings} onRefresh={onRefresh} limit={5} />
          </Card>
          <Card title={`أحدث الحجوزات (${filtered.reservations.length} من ${data.stats.totalReservations})`}>
            <ReservationsTable
              reservations={filtered.reservations}
              onRefresh={onRefresh}
              limit={5}
            />
          </Card>
          <Card title={`أحدث المدفوعات (${filtered.payments.length} من ${data.stats.totalPayments})`}>
            <PaymentTable
              payments={filtered.payments}
              onRefresh={onRefresh}
              limit={5}
            />
          </Card>
        </div>
      </div>

      {/* رسالة التحديث */}
      {refreshing && (
        <div className="fixed bottom-4 right-4 bg-[#00B4D8] text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            <span dir="rtl">جاري تحديث بيانات لوحة التحكم...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- عناصر واجهة المستخدم الصغيرة ----------
function labelFromRange(r: RangeKey) {
  return (
    {
      "7d": "آخر 7 أيام",
      "30d": "آخر 30 يوم",
      "90d": "آخر 90 يوم",
      all: "كل الوقت",
    } as const
  )[r];
}

const LegendBadge = ({ children }: { children: string }) => (
  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
    {children}
  </span>
);

const Card = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h3 className="font-semibold text-gray-800" dir="rtl">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const StatCard = ({
  title,
  value,
  subtitle,
  gradient,
  emoji,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  gradient: string; // مثال: "from-blue-400 to-blue-600"
  emoji?: string;
}) => (
  <div
    className={
      "relative overflow-hidden rounded-2xl shadow-sm border border-gray-200 bg-white"
    }
  >
    <div
      className={"absolute inset-0 opacity-10 bg-gradient-to-r " + gradient}
    />
    <div className="p-5 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500" dir="rtl">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500" dir="rtl">{subtitle}</p>}
        </div>
        {emoji && <div className="text-4xl select-none" dir="ltr">{emoji}</div>}
      </div>
    </div>
  </div>
);

export default AdminPage;
