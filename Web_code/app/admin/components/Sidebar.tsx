"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Users,
  Home,
  Calendar,
  Banknote,
  BarChart,
  FileText,
  Settings,
  LogOut,
  Search,
  User,
  Menu,
} from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";
import LanguageSwitcher from "@/app/components/navigation/LanguageSwitcher";
import Avatar from "@/app/components/ui/Avatar";

export const routes = [
  {
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    description: "نظرة عامة على النظام",
  },
  {
    label: "المستخدمين",
    icon: Users,
    href: "/admin/dashboard/users",
    description: "إدارة المستخدمين",
  },
  {
    label: "العقارات",
    icon: Home,
    href: "/admin/dashboard/listings",
    description: "إدارة العقارات",
  },
  {
    label: "الحجوزات",
    icon: Calendar,
    href: "/admin/dashboard/reservations",
    description: "إدارة الحجوزات",
  },
  {
    label: "المدفوعات",
    icon: Banknote,
    href: "/admin/dashboard/Payments",
    description: "إدارة المدفوعات",
  },
  {
    label: "طلبات المضيف",
    icon: User,
    href: "/admin/host-requests",
    description: "إدارة طلبات الانضمام كمضيف",
  },
  {
    label: "الإيرادات",
    icon: BarChart,
    href: "/admin/analysis/revenue",
    description: "تحليل الإيرادات",
  },
  {
    label: "التقارير",
    icon: FileText,
    href: "/admin/analysis/reports",
    description: "التقارير التفصيلية",
  },
];

interface SidebarProps {
  currentUser?: SafeUser | null;
}

export default function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPage = pathname?.startsWith("/admin");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((value) => !value);
  }, []);

  const handleLogout = useCallback(() => {
    signOut();
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  if (!isAdminPage) return null;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-between py-4">
          {/* Left: Logo */}
          <div className="flex items-center mr-6">
            <div
              onClick={() => router.push("/")}
              className="cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <Image
                alt="logo"
                height={40}
                width={40}
                src="/images/logo.png"
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* Center: Main Navigation */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            {routes.map((route) => {
              const isActive = pathname === route.href;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={clsx(
                    "group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-gray-50 hover:text-[#00B4D8] hover:shadow-sm",
                    isActive
                      ? "bg-[#00B4D8] text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:scale-105"
                  )}
                  title={route.description}
                >
                  <route.icon
                    className={clsx(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-[#00B4D8]"
                    )}
                  />
                  <span className="hidden lg:inline">{route.label}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Search, Language, User Menu */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00B4D8] hover:shadow-sm transition-all duration-200 hover:scale-105"
              title="البحث في العقارات"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">البحث</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00B4D8] hover:shadow-sm transition-all duration-200 hover:scale-105"
              title="الإعدادات"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">الإعدادات</span>
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00B4D8] hover:shadow-sm transition-all duration-200 hover:scale-105"
                title="قائمة المستخدم"
              >
                {currentUser?.image ? (
                  <Avatar src={currentUser.image} />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="hidden lg:inline">
                  {currentUser?.name || "المستخدم"}
                </span>
                <Menu className="h-4 w-4" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.name || "المستخدم"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.email}
                    </p>
                  </div>

                  <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    العودة للموقع الرئيسي
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-right"
                  >
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <nav className="md:hidden py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0 mr-4">
              <div
                onClick={() => router.push("/")}
                className="cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <Image
                  alt="logo"
                  height={32}
                  width={32}
                  src="/images/logo.png"
                  className="h-6 w-auto"
                />
              </div>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide flex-1 mx-2">
              {routes.map((route) => {
                const isActive = pathname === route.href;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={clsx(
                      "flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                      "hover:bg-gray-50 hover:text-[#00B4D8] hover:shadow-sm",
                      isActive
                        ? "bg-[#00B4D8] text-white shadow-md transform scale-105"
                        : "text-gray-600 hover:scale-105"
                    )}
                    title={route.description}
                  >
                    <route.icon
                      className={clsx(
                        "h-3.5 w-3.5",
                        isActive ? "text-white" : "text-gray-500"
                      )}
                    />
                    <span className="whitespace-nowrap">{route.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              {/* Search */}
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00B4D8] hover:shadow-sm transition-all duration-200 hover:scale-105"
                title="البحث"
              >
                <Search className="h-3.5 w-3.5" />
              </button>

              {/* Language */}
              <div className="flex items-center">
                <LanguageSwitcher />
              </div>

              {/* Settings */}
              <Link
                href="/admin/settings"
                className="flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00B4D8] hover:shadow-sm transition-all duration-200 hover:scale-105"
                title="الإعدادات"
              >
                <Settings className="h-3.5 w-3.5" />
              </Link>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-1 px-2 py-2 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-[#00B4D8] hover:shadow-sm transition-all duration-200 hover:scale-105"
                  title="قائمة المستخدم"
                >
                  {currentUser?.image ? (
                    <Avatar src={currentUser.image} />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                </button>

                {/* Mobile User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {currentUser?.name || "المستخدم"}
                      </p>
                    </div>

                    <Link
                      href="/"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Home className="h-3 w-3" />
                      العودة للموقع
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors w-full text-right"
                    >
                      <LogOut className="h-3 w-3" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
