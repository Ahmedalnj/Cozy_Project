"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  return (
    <Image
      onClick={() => router.push("/")}
      alt="logo"
      className="cursor-pointer transition-all duration-300"
      height={100}
      width={100}
      src="/images/logo.png"
      style={{
        width: "clamp(25px, 5vw, 120px)",
        height: "auto",
      }}
    />
  );
};

export default Logo;
