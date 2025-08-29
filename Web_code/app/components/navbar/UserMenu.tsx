"use client";

import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

//icons imports
import {
  AiOutlineHome,
  AiOutlineHeart,
  AiOutlineCalendar,
  AiOutlineDashboard,
  AiOutlineLogout,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { AiOutlineMenu } from "react-icons/ai";
import { FiKey } from "react-icons/fi";
import { PiAirplaneTiltFill } from "react-icons/pi";
import { TbHome } from "react-icons/tb";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

interface UserMenuProps {
  currentUser: SafeUser | null;
}
const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  // Translation hook
  const { t } = useTranslation("common");

  const router = useRouter();

  const registerModal = useRegisterModal();

  const loginModal = useLoginModal();

  const rentModal = useRentModal();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const handleMenuItemClick = useCallback((callback: () => void) => {
    setIsOpen(false);
    callback();
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    // open rent modal
    rentModal.onOpen();
  }, [currentUser, loginModal, rentModal]);
  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="
      hidden
      md:block
      text-sm
      font-semibold
      py-3
      px-4
      rounded-full
      hover:bg-neutral-100
      transition
      cursor-pointer
    "
        >
          {t("cozy_my_home")}
        </div>
        <div
          onClick={toggleOpen}
          className="
      p-0.5
      md:py-1
      md:px-2
      border-[1px]
      border-neutral-200
      flex
      flex-row    
      items-center
      gap-3
      rounded-full
      cursor-pointer
      hover:shadow-md
      transition
    "
        >
          <AiOutlineMenu className="block" />
          <div className="md:hidden">
            <Avatar src={currentUser?.image} />
          </div>
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
            absolute
            rounded
            shadow-md
            w-[40vw]
            md:w-3/4
            bg-white
            overflow-hidden
            right-0
            top-12
            text-sm
            "
        >
          <div className=" flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => handleMenuItemClick(() => router.push("/"))}
                  label={t("Home")}
                  Icon={TbHome}
                />
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick(() => router.push("/trips"))
                  }
                  label={t("my_trips")}
                  Icon={PiAirplaneTiltFill}
                />
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick(() => router.push("/favorites"))
                  }
                  label={t("my_favorites")}
                  Icon={AiOutlineHeart}
                />
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick(() => router.push("/reservations"))
                  }
                  label={t("my_reservations")}
                  Icon={AiOutlineCalendar}
                />
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick(() => router.push("/properties"))
                  }
                  label={t("my_properties")}
                  Icon={FiKey}
                />
                {currentUser.role === "ADMIN" && (
                  <MenuItem
                    onClick={() =>
                      handleMenuItemClick(() => router.push("/admin/dashboard"))
                    }
                    label={t("my_dashboard")}
                    Icon={AiOutlineDashboard}
                  />
                )}
                <MenuItem
                  onClick={() => handleMenuItemClick(rentModal.onOpen)}
                  label={t("cozy_my_home")}
                  Icon={AiOutlineHome}
                />
                <div className="px-3 py-2">
                  <LanguageSwitcher fullLabel />
                </div>
                <hr />
                <MenuItem
                  onClick={() => handleMenuItemClick(() => signOut())}
                  label={t("logout")}
                  Icon={AiOutlineLogout}
                />
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => handleMenuItemClick(loginModal.onOpen)}
                  label={t("login")}
                  Icon={AiOutlineLogin}
                />
                <MenuItem
                  onClick={() => handleMenuItemClick(registerModal.onOpen)}
                  label={t("sign_up")}
                  Icon={AiOutlineUserAdd}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
