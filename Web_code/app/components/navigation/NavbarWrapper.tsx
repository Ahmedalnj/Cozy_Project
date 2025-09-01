// app/components/LayoutController.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar/navbar";
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
      {!isAdminPage && <Navbar currentUser={currentUser} />}
      <div className={isAdminPage ? "" : "pt-22"}>{children}</div>
    </>
  );
}
