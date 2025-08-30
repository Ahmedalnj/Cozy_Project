// app/(admin)/layout.tsx
import { ReactNode } from "react";
import Sidebar from "@/app/admin/components/Sidebar"; // أو حسب المسار الصحيح
import { Nunito } from "next/font/google";
const font = Nunito({
  subsets: ["latin"],
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={font.className}>
      <Sidebar />
      <main className="flex-1 bg-white min-h-screen p-6">{children}</main>
    </div>
  );
}
