"use client";

import { PublicUser } from "@/app/types";
import { format } from "date-fns";
import { updateUserRole, deleteUser } from "@/app/actions/users.actions";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp, FiRefreshCw } from "react-icons/fi";
import Avatar from "@/app/components/ui/Avatar";
import ConfirmationModal from "@/app/components/modals/confirmations/ConfirmationModal";

interface UsersTableProps {
  users: PublicUser[];
  onRefresh?: () => Promise<void>;
}

type SortColumn = "name" | "email" | "role" | "createdAt";

const USERS_PER_PAGE = 10;

const UsersTable: React.FC<UsersTableProps> = ({ users, onRefresh }) => {
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

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

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
      <FiChevronUp className="inline ml-1" />
    ) : (
      <FiChevronDown className="inline ml-1" />
    );
  };

  return (
    <div className="mt-10">
      <h2 className="text-5xl font-semibold mb-4 text-center p-4">
        User Table
      </h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by Name or Email"
          className="border px-3 py-2 rounded-md w-full max-w-xs text-sm focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={fetchUsers}
          disabled={loading}
          className={`p-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } transition`}
          title="تحديث"
          aria-label="تحديث"
        >
          <FiRefreshCw size={20} />
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs tracking-wider">
              <th
                className="py-3 px-6 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                User {renderSortIcon("name")}
              </th>
              <th
                className="py-3 px-6 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email {renderSortIcon("email")}
              </th>
              <th
                className="py-3 px-6 cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role {renderSortIcon("role")}
              </th>
              <th
                className="py-3 px-6 cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Created At {renderSortIcon("createdAt")}
              </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6 flex items-center gap-3">
                    <Avatar src={user?.image} />
                    <span>{user.name || "No name"}</span>
                  </td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    {format(new Date(user.createdAt), "yyyy-MM-dd")}
                  </td>
                  <td className="py-3 px-6 flex justify-center items-center gap-3">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-5 py-3 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <select
                      value={user.role || "USER"}
                      onChange={(e) =>
                        handleRoleSelect(user.id, e.target.value)
                      }
                      className="text-sm border rounded px-2 py-1 focus:outline-none"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-6 font-semibold"
                >
                  🚫 لا يوجد مستخدمون مطابقون
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 hover:bg-blue-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
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
