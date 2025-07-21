"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Users,
  Home,
  Calendar,
  Banknote,
  BarChart,
  FileText,
} from "lucide-react";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Users", icon: Users, href: "/admin/dashboard/users" },
  { label: "Listings", icon: Home, href: "/admin/dashboard/listings" },
  {
    label: "Reservations",
    icon: Calendar,
    href: "/admin/dashboard/reservations",
  },
  {
    label: "Transactions",
    icon: Banknote,
    href: "/admin/dashboard/transactions",
  },
  { label: "Revenue", icon: BarChart, href: "/admin/analysis/revenue" },
  { label: "Reports", icon: FileText, href: "/admin/analysis/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-white border-r p-4 shadow-sm fixed left-0 top-0">
      <nav className="space-y-2 mt-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition",
              pathname === route.href && "bg-gray-200 font-semibold"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
