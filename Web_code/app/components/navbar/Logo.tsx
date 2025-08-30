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
      src="/images/Cozy_logo.png"
      style={{
        width: "clamp(40px, 10vw, 100px)",
        height: "auto",
      }}
    />
  );
};

export default Logo;
