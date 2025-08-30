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
import Avatar from "@/app/components/ui/Avatar";
import useRentModal from "@/app/hooks/useRentModal";
import { SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";

interface UserMenuProps {
  currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar";

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
          {t("back_to_cozy")}
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
            className={`
              fixed
              top-[80px] sm:top-12
              w-[250px] sm:w-[200px]
              bg-white
              rounded
              shadow-md
              overflow-hidden
              text-sm
              z-[9999]
              ${isRTL ? "left-0 sm:left-0" : "right-0 sm:right-0"}
            `}
          >
            <div className="flex flex-col cursor-pointer">
              {currentUser && (
                <>
                  <MenuItem
                    onClick={() => router.push("/properties")}
                    label={t("my_properties")}
                    Icon={FiKey}
                    isRTL={isRTL}
                  />
                  <MenuItem
                    onClick={() => router.push("/admin/dashboard")}
                    label={t("my_dashboard")}
                    Icon={AiOutlineDashboard}
                    isRTL={isRTL}
                  />
                  <MenuItem
                    onClick={rentModal.onOpen}
                    label={t("cozy_my_home")}
                    Icon={AiOutlineHome}
                    isRTL={isRTL}
                  />
                  <hr />
                  <MenuItem
                    onClick={() => signOut()}
                    label={t("logout")}
                    variant="logout"
                    Icon={AiOutlineLogout}
                    isRTL={isRTL}
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
