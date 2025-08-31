// app/(admin)/layout.tsx
import { ReactNode } from "react";
import Sidebar from "@/app/admin/components/Sidebar";
import { Nunito } from "next/font/google";
import getCurrentUser from "@/app/actions/getCurrentUser";

const font = Nunito({
  subsets: ["latin"],
});

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <div className={`${font.className} min-h-screen bg-gradient-to-b from-gray-50 to-white`}>
      {/* Sidebar Navigation */}
      <Sidebar currentUser={currentUser} />
      
      {/* Main Content */}
      <main className="flex-1 pt-0">
        {children}
      </main>
    </div>
  );
}
