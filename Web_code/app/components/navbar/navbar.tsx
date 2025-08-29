"use client";

import { SafeUser } from "@/app/types";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import Categories from "./Categories";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  return (
    <div className="fixed w-full bg-white z-50 shadow-sm">
      <div className="py-2 border-b-[1px] relative">
        <Container>
          <div className="flex items-center justify-between w-full relative">
            {/* الشعار */}
            <Logo />

            {/* Search في منتصف Navbar مع حجم responsive */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4">
              <Search />
            </div>

            {/* عناصر المستخدم واللغة */}
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              <UserMenu currentUser={currentUser ?? null} />
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
