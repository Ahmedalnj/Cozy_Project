"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { SafeUser } from "@/app/types";
import { signOut } from "next-auth/react";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";
import {
  AiOutlineHome,
  AiOutlineHeart,
  AiOutlineCalendar,
  AiOutlineDashboard,
  AiOutlineLogout,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { FiKey } from "react-icons/fi";
import { PiAirplaneTiltFill } from "react-icons/pi";

interface UserMenuProps {
  currentUser: SafeUser | null;
}
const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
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
          Cozy your home
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
          {/* تعديل هنا: إظهار Avatar في الهاتف وإخفاء AiOutlineMenu */}
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
                  onClick={() => router.push("/trips")}
                  label="My Trips"
                  Icon={PiAirplaneTiltFill}
                />
                <MenuItem
                  onClick={() => router.push("/favorites")}
                  label="My Favorites"
                  Icon={AiOutlineHeart}
                />
                <MenuItem
                  onClick={() => router.push("/reservations")}
                  label="My Reservations"
                  Icon={AiOutlineCalendar}
                />
                <MenuItem
                  onClick={() => router.push("/properties")}
                  label="My Properties"
                  Icon={FiKey}
                />
                {currentUser.role === "ADMIN" && (
                  <MenuItem
                    onClick={() => router.push("/admin/dashboard")}
                    label="My Dashboard"
                    Icon={AiOutlineDashboard}
                  />
                )}
                <MenuItem
                  onClick={rentModal.onOpen}
                  label="Cozy my home"
                  Icon={AiOutlineHome}
                />
                <hr />
                <MenuItem
                  onClick={() => signOut()}
                  label="Logout"
                  Icon={AiOutlineLogout}
                />
              </>
            ) : (
              <>
                <MenuItem
                  onClick={loginModal.onOpen}
                  label="Login"
                  Icon={AiOutlineLogin}
                />
                <MenuItem
                  onClick={registerModal.onOpen}
                  label="Sign Up"
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
