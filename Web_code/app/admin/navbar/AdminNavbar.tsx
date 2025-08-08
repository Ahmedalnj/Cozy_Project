"use client";

import { SafeUser } from "@/app/types";
import Logo from "./Logo";
import UserMenu from "./UserMenu";
import Container from "@/app/components/Container";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  return (
    <div
      className="
            fixed 
            w-full 
            bg-white 
            z-10
            shadow-sm"
    >
      <div
        className="
            py-2 
            border-b-[1]
            "
      >
        <Container>
          <div
            className="
                   flex
                   flex-row
                   items-center
                   justify-between
                   gap-3
                   md:gap-0
                   "
          >
            <Logo />
            <UserMenu currentUser={currentUser ?? null} />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
