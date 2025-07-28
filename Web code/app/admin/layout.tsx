// app/(admin)/layout.tsx
import { ReactNode } from "react";
import Sidebar from "@/app/admin/components/Sidebar"; // أو حسب المسار الصحيح

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="mr-64 flex-1 bg-white min-h-screen p-6">{children}</main>
    </div>
  );
}
