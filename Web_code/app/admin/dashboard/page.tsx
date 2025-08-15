/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SafeUser, SafeListing, SaveReservation } from "@/app/types";
import { formatCurrency } from "@/app/types";
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
import { RefreshCw, Calendar, Search, ShieldCheck } from "lucide-react";

interface DashboardData {
  users: SafeUser[];
  listings: SafeListing[];
  reservations: SaveReservation[];
  stats: {
    totalUsers: number;
    totalListings: number;
    totalReservations: number;
    totalRevenue: number;
  };
}

// ---------- Helpers ----------
function isWithinRange(dateStr: string | Date, range: RangeKey) {
  if (range === "all") return true;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return true; // if unknown, don't filter out
  const now = new Date();
  const ms = { "7d": 7, "30d": 30, "90d": 90 }[range] * 24 * 60 * 60 * 1000;
  return now.getTime() - d.getTime() <= ms;
}

function monthKey(dateStr: string | Date) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Unknown";
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
const AdminPage = ({ currentUser }: { currentUser?: SafeUser | null }) => {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("30d");
  const [query, setQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Access control (role)
  useEffect(() => {
    if (currentUser && (currentUser as any).role !== "ADMIN") {
      router.push("/");
    }
  }, [currentUser, router]);

  // Fetch dashboard data (useCallback -> fixes exhaustive-deps)
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
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        if (!isRefresh) setLoading(false);
      }
    },
    [router]
  );

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Optional auto refresh
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

  // Filtered collections for tables & charts
  const filtered = useMemo(() => {
    if (!data) return null;

    const match = (text: unknown) =>
      String(text ?? "")
        .toLowerCase()
        .includes(query.trim().toLowerCase());

    const users = data.users.filter(
      (u) =>
        isWithinRange(
          (u as any).createdAt ?? (u as any).emailVerified ?? new Date(),
          range
        ) &&
        (query ? match(u.name) || match(u.email) || match((u as any).id) : true)
    );

    const listings = data.listings.filter(
      (l) =>
        isWithinRange((l as any).createdAt ?? new Date(), range) &&
        (query
          ? match(l.title) || match(l.description) || match((l as any).id)
          : true)
    );

    const reservations = data.reservations.filter(
      (r) =>
        isWithinRange(
          (r as any).createdAt ?? (r as any).startDate ?? new Date(),
          range
        ) &&
        (query
          ? match((r as any).id) ||
            match((r as any).guestName) ||
            match((r as any).listingTitle)
          : true)
    );

    // Derive stats for the selected range from reservations (fallback to API stats when missing fields)
    const computedRevenue = reservations.reduce((sum, r) => {
      const val = Number((r as any).totalPrice ?? (r as any).price ?? 0);
      return sum + (Number.isFinite(val) ? val : 0);
    }, 0);

    return { users, listings, reservations, computedRevenue };
  }, [data, query, range]);

  // Chart data (by month)
  const chartData = useMemo(() => {
    if (!filtered)
      return [] as { month: string; reservations: number; revenue: number }[];
    const map = new Map<string, { reservations: number; revenue: number }>();
    for (const r of filtered.reservations) {
      const key = monthKey(
        (r as any).createdAt ?? (r as any).startDate ?? new Date()
      );
      const prev = map.get(key) ?? { reservations: 0, revenue: 0 };
      const price = Number((r as any).totalPrice ?? (r as any).price ?? 0);
      map.set(key, {
        reservations: prev.reservations + 1,
        revenue: prev.revenue + (Number.isFinite(price) ? price : 0),
      });
    }
    return Array.from(map.entries()).map(([month, v]) => ({ month, ...v }));
  }, [filtered]);

  // -------------- UI --------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#00B4D8] border-solid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-3">{error}</h2>
        <button
          onClick={onRefresh}
          className="px-5 py-2 bg-[#00B4D8] text-white rounded-lg shadow hover:bg-[#0099CC] transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data || !filtered) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-500">Dashboard data could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#00B4D8]" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Admin Dashboard
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
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="col-span-2 flex items-center gap-2 bg-white rounded-xl border border-gray-200 shadow-sm px-3">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users, listings, reservations..."
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
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-refresh
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={data.stats.totalUsers}
            subtitle={labelFromRange(range)}
            gradient="from-blue-400 to-blue-600"
            emoji="👥"
          />
          <StatCard
            title="Total Listings"
            value={data.stats.totalListings}
            subtitle={labelFromRange(range)}
            gradient="from-emerald-400 to-emerald-600"
            emoji="🏠"
          />
          <StatCard
            title="Total Reservations"
            value={filtered.reservations.length}
            subtitle={labelFromRange(range)}
            gradient="from-purple-400 to-purple-600"
            emoji="📅"
          />
          <StatCard
            title="Revenue"
            value={formatCurrency(
              filtered.computedRevenue || data.stats.totalRevenue
            )}
            subtitle={labelFromRange(range)}
            gradient="from-amber-400 to-amber-600"
            emoji="💰"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                Reservations by Month
              </h3>
              <LegendBadge>Line</LegendBadge>
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
                  <Tooltip formatter={(v: any) => [v, "Reservations"]} />
                  <Line type="monotone" dataKey="reservations" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Revenue by Month</h3>
              <LegendBadge>Bars</LegendBadge>
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
                    formatter={(v: any) => [
                      formatCurrency(Number(v) || 0),
                      "Revenue",
                    ]}
                  />
                  <Bar dataKey="revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 gap-6">
          <Card title="Latest Users">
            <UsersTable users={filtered.users} onRefresh={onRefresh} />
          </Card>
          <Card title="Latest Listings">
            <ListingsTable listings={filtered.listings} onRefresh={onRefresh} />
          </Card>
          <Card title="Latest Reservations">
            <ReservationsTable
              reservations={filtered.reservations}
              onRefresh={onRefresh}
            />
          </Card>
        </div>
      </div>

      {/* Toast for refreshing */}
      {refreshing && (
        <div className="fixed bottom-4 right-4 bg-[#00B4D8] text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Refreshing dashboard data...
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- Small UI bits ----------
function labelFromRange(r: RangeKey) {
  return (
    {
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      "90d": "Last 90 days",
      all: "All time",
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
      <h3 className="font-semibold text-gray-800">{title}</h3>
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
  gradient: string; // e.g. "from-blue-400 to-blue-600"
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
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        {emoji && <div className="text-4xl select-none">{emoji}</div>}
      </div>
    </div>
  </div>
);

export default AdminPage;
