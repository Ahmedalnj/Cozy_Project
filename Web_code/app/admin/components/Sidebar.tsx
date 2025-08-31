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
    label: "Payments",
    icon: Banknote,
    href: "/admin/dashboard/Payments",
  },
  { label: "Revenue", icon: BarChart, href: "/admin/analysis/revenue" },
  { label: "Reports", icon: FileText, href: "/admin/analysis/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  if (!isAdminPage) return null;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-20">
      <nav className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={clsx(
                "flex items-center gap-1 sm:gap-2 whitespace-nowrap px-2 sm:px-3 py-2 rounded-md hover:bg-gray-100 transition text-sm sm:text-base",
                isActive && "bg-gray-200 font-semibold"
              )}
            >
              <route.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">{route.label}</span>
              <span className="sm:hidden">{route.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
