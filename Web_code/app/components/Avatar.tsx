"use client";
import Image from "next/image";

interface AvatarProps {
  src: string | null | undefined;
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({ src, size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6 sm:w-8 sm:h-8",
    md: "w-8 h-8 sm:w-10 sm:h-10",
    lg: "w-10 h-10 sm:w-12 sm:h-12",
  };

  const pixelSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  return (
    <Image
      className={`rounded-full ${sizeClasses[size]}`}
      height={pixelSizes[size]}
      width={pixelSizes[size]}
      alt="avatar"
      src={src || "/images/user.png"}
    />
  );
};

export default Avatar;
