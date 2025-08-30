// app/components/LayoutController.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar/navbar";
import AdminNavbar from "@/app/admin/navbar/AdminNavbar";
import { ReactNode } from "react";

// Import SafeUser type from the appropriate location
import { SafeUser } from "@/app/types"; // Adjust the path as needed

export default function LayoutController({
  currentUser,
  children,
}: {
  currentUser: SafeUser | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      {isAdminPage ? (
        <AdminNavbar currentUser={currentUser} />
      ) : (
        <Navbar currentUser={currentUser} />
      )}
      <div className="pt-12">
        {isAdminPage ? (
          <div>{children}</div>
        ) : (
          <div className="pt-12">{children}</div>
        )}
      </div>
    </>
  );
}
