"use client";

import { PublicUser } from "@/app/types";
import { format } from "date-fns";
import { updateUserRole, deleteUser } from "@/app/actions/users.actions";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Avatar from "@/app/components/Avatar";

interface UsersTableProps {
  users: PublicUser[];
}

const USERS_PER_PAGE = 10;

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  const [localUsers, setLocalUsers] = useState(users);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      setLocalUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      toast.success("تم تحديث الدور بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء تحديث الدور");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    try {
      await deleteUser(userId);
      setLocalUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("تم حذف المستخدم بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء حذف المستخدم");
    }
  };

  const filteredUsers = useMemo(() => {
    return localUsers
      .filter(
        (user) =>
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) =>
        sortAsc
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [search, sortAsc, localUsers]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  return (
    <div className="mt-10">
      {/* Search and Sort Bar */}
      <div className="flex flex-row-reverse items-center justify-between mb-4">
        <input
          type="text"
          placeholder="🔍 بحث باسم أو بريد المستخدم..."
          className="border px-3 py-2 rounded-md w-full max-w-xs text-sm focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // إعادة الصفحة الأولى عند البحث
          }}
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="ml-4 flex items-center gap-1 text-sm text-gray-700 hover:text-black"
        >
          {sortAsc ? <FiChevronDown /> : <FiChevronUp />}
          ترتيب بالتاريخ
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border shadow-sm">
        <table className="min-w-full bg-white text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-xs tracking-wider">
              <th className="py-3 px-6">User</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6">Created At</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
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
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                  <select
                    value={user.role || "USER"}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm border rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
            {paginatedUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-400 py-6 font-semibold"
                >
                  لا توجد نتائج مطابقة.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
};

export default UsersTable;
