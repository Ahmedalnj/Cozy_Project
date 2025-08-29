"use client";

import { SafeUser } from "@/app/types";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import Categories from "./Categories";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const { t } = useTranslation("common");
  return (
    <div className="fixed w-full bg-white z-50 shadow-sm">
      <div className="py-2 border-b-[1px] relative">
        <Container>
          <div className="grid grid-cols-[1fr_2fr_1fr] items-center w-full gap-2">
            {/* يسار: الشعار */}
            <div className="flex justify-start">
              <Logo />
            </div>

            {/* منتصف: البحث أعرض */}
            <div className="flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl">
                <Search />
              </div>
            </div>

            {/* يمين: اللغة + المستخدم */}
            <div className="flex justify-end items-center gap-2">
              <div title={t("change_language")}>
                <LanguageSwitcher />
              </div>
              <div title="">
                {" "}
                <UserMenu currentUser={currentUser ?? null} />
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
