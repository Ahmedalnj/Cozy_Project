"use client";

import {
  AiOutlineDashboard,
  AiOutlineHome,
  AiOutlineLogout,
  AiOutlineMenu,
} from "react-icons/ai";
import { FiKey } from "react-icons/fi";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import MenuItem from "./MenuItem";
import Avatar from "@/app/components/Avatar";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={() => router.push("/")}
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Back To Cozy
        </div>

        <div
          onClick={toggleOpen}
          className="p-0.5 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div
            className="
              fixed
              top-[80px] sm:top-12
              right-0 sm:right-0
              w-[250px] sm:w-[200px]
              bg-white
              rounded
              shadow-md
              overflow-hidden
              text-sm
              z-[9999]
              
            "
          >
            <div className="flex flex-col cursor-pointer">
              {currentUser && (
                <>
                  <MenuItem
                    onClick={() => router.push("/properties")}
                    label="My Properties"
                    Icon={FiKey}
                  />
                  <MenuItem
                    onClick={() => router.push("/admin/dashboard")}
                    label="My Dashboard"
                    Icon={AiOutlineDashboard}
                  />
                  <MenuItem
                    onClick={rentModal.onOpen}
                    label="Cozy my home"
                    Icon={AiOutlineHome}
                  />
                  <hr />
                  <MenuItem
                    onClick={() => signOut()}
                    label="Logout"
                    variant="logout"
                    Icon={AiOutlineLogout}
                  />
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default UserMenu;
