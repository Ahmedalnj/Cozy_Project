"use client";

import { PublicUser } from "@/app/types";
import { format } from "date-fns";
import { updateUserRole, deleteUser } from "@/app/actions/users.actions";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import Avatar from "@/app/components/ui/Avatar";
import ConfirmationModal from "@/app/components/modals/confirmations/ConfirmationModal";
import { useTranslation } from "react-i18next";

interface UsersTableProps {
  users: PublicUser[];
  onRefresh?: () => Promise<void>;
  limit?: number;
}

type SortColumn = "name" | "email" | "role" | "createdAt";

const USERS_PER_PAGE = 10;

const UsersTable: React.FC<UsersTableProps> = ({ users, onRefresh, limit }) => {
  const { t } = useTranslation("common");
  const [localUsers, setLocalUsers] = useState(users);

  // Update local state when props change (dashboard refresh)
  useEffect(() => {
    setLocalUsers(users);
  }, [users]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [sortBy, setSortBy] = useState<SortColumn>("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const fetchUsers = async () => {
    if (loading) return;
    try {
      setLoading(true);
      if (onRefresh) {
        await onRefresh();
      } else {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("فشل في جلب البيانات");
        const data: PublicUser[] = await res.json();
        setLocalUsers(data);
        setSearch("");
        setCurrentPage(1);
        toast.success("تم تحديث البيانات");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء جلب البيانات"
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmModal = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setModalContent({ title, message, onConfirm });
    setShowModal(true);
  };

  const handleRoleSelect = (userId: string, newRole: string) => {
    confirmModal(
      "تأكيد تغيير الدور",
      `هل تريد حقًا تغيير دور المستخدم إلى ${newRole}؟`,
      () => handleConfirmRoleChange(userId, newRole)
    );
  };

  const handleConfirmRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setLocalUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("تم تحديث الدور بنجاح");
      // Refresh dashboard data to update stats
      if (onRefresh) {
        await onRefresh();
      }
    } catch {
      toast.error("حدث خطأ أثناء تحديث الدور");
    }
  };

  const handleDelete = (userId: string) => {
    confirmModal(
      "تأكيد الحذف",
      "هل أنت متأكد أنك تريد حذف هذا المستخدم؟",
      async () => {
        try {
          await deleteUser(userId);
          setLocalUsers((prev) => prev.filter((user) => user.id !== userId));
          toast.success("تم حذف المستخدم بنجاح");
          // Refresh dashboard data to update stats
          if (onRefresh) {
            await onRefresh();
          }
        } catch {
          toast.error("حدث خطأ أثناء حذف المستخدم");
        }
      }
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "USER":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "👑";
      case "USER":
        return "👤";
      default:
        return "❓";
    }
  };

  const filteredUsers = useMemo(() => {
    return localUsers
      .filter(
        (user) =>
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        let valA = "";
        let valB = "";

        switch (sortBy) {
          case "name":
            valA = a.name?.toLowerCase() || "";
            valB = b.name?.toLowerCase() || "";
            break;
          case "email":
            valA = a.email?.toLowerCase() || "";
            valB = b.email?.toLowerCase() || "";
            break;
          case "role":
            valA = a.role?.toLowerCase() || "";
            valB = b.role?.toLowerCase() || "";
            break;
          case "createdAt":
            return sortAsc
              ? new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime();
        }

        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [search, sortAsc, sortBy, localUsers]);

  const totalPages = limit ? Math.ceil(Math.min(filteredUsers.length, limit) / USERS_PER_PAGE) : Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    const end = limit ? Math.min(start + USERS_PER_PAGE, limit) : start + USERS_PER_PAGE;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, limit]);

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) return null;
    return sortAsc ? (
      <FiChevronUp className="inline ml-1 h-4 w-4" />
    ) : (
      <FiChevronDown className="inline ml-1 h-4 w-4" />
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              جدول المستخدمين
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              عرض وإدارة جميع المستخدمين في النظام
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:flex-none">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                             <input
                 type="text"
                 placeholder="البحث في الاسم أو البريد الإلكتروني..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className={`p-2 rounded-lg text-white transition-all duration-200 flex-shrink-0 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
              }`}
              title={t("refresh_data")}
              aria-label={t("refresh_data")}
            >
              <FiRefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">المستخدم</span>
                  <span className="sm:hidden">👤</span>
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">البريد الإلكتروني</span>
                  <span className="sm:hidden">📧</span>
                  {renderSortIcon("email")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">الدور</span>
                  <span className="sm:hidden">👑</span>
                  {renderSortIcon("role")}
                </div>
              </th>
              <th
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="hidden sm:inline">تاريخ الإنشاء</span>
                  <span className="sm:hidden">📅</span>
                  {renderSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="hidden sm:inline">الإجراءات</span>
                <span className="sm:hidden">⚙️</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user: PublicUser, index: number) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  }`}
                >
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex-shrink-0">
                        <Avatar src={user?.image} />
                      </div>
                      <div className="min-w-0">
                                                 <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                           {user.name || "بدون اسم"}
                         </div>
                         <div className="text-xs sm:text-sm text-gray-500 truncate">
                           ID: {user.id.slice(-8)}
                         </div>
                      </div>
                    </div>
                  </td>
                                     <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                     <div className="text-xs sm:text-sm text-gray-900 truncate max-w-xs">
                       {user.email}
                     </div>
                   </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-base sm:text-lg">
                        {getRoleIcon(user.role || "USER")}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 rounded-full text-xs font-medium border ${getRoleColor(
                          user.role || "USER"
                        )}`}
                      >
                        {user.role || "USER"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {format(new Date(user.createdAt), "dd/MM/yyyy")}
                      </span>
                      <span className="text-gray-500">
                        {format(new Date(user.createdAt), "HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <select
                        value={user.role || "USER"}
                        onChange={(e) =>
                          handleRoleSelect(user.id, e.target.value)
                        }
                        className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="USER">مستخدم</option>
                        <option value="ADMIN">مدير</option>
                      </select>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف المستخدم"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 sm:px-6 py-8 sm:py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
                    <div className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      لا يوجد مستخدمون مطابقون
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      جرب تغيير معايير البحث
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              عرض{" "}
              <span className="font-medium">
                {(currentPage - 1) * USERS_PER_PAGE + 1}
              </span>{" "}
              إلى{" "}
              <span className="font-medium">
                {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)}
              </span>{" "}
              من أصل <span className="font-medium">{filteredUsers.length}</span>{" "}
              نتيجة
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                السابق
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && modalContent && (
        <ConfirmationModal
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UsersTable;
