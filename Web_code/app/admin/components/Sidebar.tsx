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

export const routes = [
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
  const isAdminPage = pathname?.startsWith("/admin");
  if (!isAdminPage) return null;

  return (
    <div
      className="max-w-screen-2xl  // Similar to Airbnb's very wide container
      mx-auto
      xl:px-20         // Larger padding on extra large screens
      lg:px-10         // Standard padding on large screens
      md:px-8          // Medium padding on tablets
      sm:px-6          // Small padding on small tablets
      px-4 "
    >
      <nav
        className="pt-4
      flex 
      flex-row
      items-center
      justify-between
      overflow-x-auto"
      >
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={clsx(
                "flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-md hover:bg-gray-100 transition",
                isActive && "bg-gray-200 font-semibold"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
