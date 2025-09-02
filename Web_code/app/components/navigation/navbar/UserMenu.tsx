"use client";

import Avatar from "../../ui/Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";

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
import LanguageSwitcher from "@/app/components/navigation/LanguageSwitcher";

import { SwitchToHostingButton } from "@/app/components/ui";


interface UserMenuProps {
  currentUser: SafeUser | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  // Translation hook
  const { t, i18n } = useTranslation("common");
  const isRTL = i18n.language === "ar" || i18n.language === "ar-EG";
  
  // للتأكد من أن RTL يعمل
  console.log("UserMenu - Current language:", i18n.language, "isRTL:", isRTL);
  


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
        <div className="hidden md:block">
          <SwitchToHostingButton
            hostStatus={currentUser?.hostStatus || "NOT_REQUESTED"}
            className="text-sm font-semibold py-3 px-4 rounded-full transition cursor-pointer border-[1px] border-neutral-200 hover:shadow-md"
          />
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
          <div className="md:hidden">
            <Avatar src={currentUser?.image} />
          </div>
          <AiOutlineMenu className="hidden md:block" />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className={`
            absolute
            rounded
            shadow-md
            w-[40vw]
            md:w-3/4
            bg-white
            overflow-hidden
            top-12
            text-sm
            z-50
            ${isRTL ? "left-0" : "right-0"}
          `}
        >
          <div className="flex flex-col cursor-pointer">
            {currentUser ? (
              <>
                <MenuItem
                  onClick={() => handleMenuItemClick(() => router.push("/"))}
                  label={t("Home")}
                  Icon={TbHome}
                  isRTL={isRTL}
                />
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick(() => router.push("/trips"))}
                  label={t("my_trips")}
                  Icon={PiAirplaneTiltFill}
                  isRTL={isRTL}
                />
                <MenuItem
                  onClick={() =>
                    handleMenuItemClick(() => router.push("/favorites"))
                  }
                  label={t("my_favorites")}
                  Icon={AiOutlineHeart}
                  isRTL={isRTL}
                />

                {currentUser.role === "ADMIN" && (
                  <MenuItem
                    onClick={() =>
                      handleMenuItemClick(() => router.push("/admin/dashboard"))
                    }
                    label={t("my_dashboard")}
                    Icon={AiOutlineDashboard}
                    isRTL={isRTL}
                  />
                )}

                {currentUser?.hostStatus === "APPROVED" && (
                  <MenuItem
                    onClick={() =>
                      handleMenuItemClick(() => router.push("/host-dashboard"))
                    }
                    label={t("host_dashboard")}
                    Icon={AiOutlineHome}
                    isRTL={isRTL}
                  />
                )}

                <div className="px-3 py-2">
                  <LanguageSwitcher fullLabel />
                </div>
                <hr />
                <MenuItem
                  onClick={() => handleMenuItemClick(() => signOut())}
                  label={t("logout")}
                  Icon={AiOutlineLogout}
                  isRTL={isRTL}
                />
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => handleMenuItemClick(loginModal.onOpen)}
                  label={t("login")}
                  Icon={AiOutlineLogin}
                  isRTL={isRTL}
                />
                <MenuItem
                  onClick={() => handleMenuItemClick(registerModal.onOpen)}
                  label={t("sign_up")}
                  Icon={AiOutlineUserAdd}
                  isRTL={isRTL}
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
