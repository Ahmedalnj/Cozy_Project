"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface AvatarProps {
  src: string | null | undefined;
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({ src, size = "md" }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6 sm:w-7 sm:h-7",
    md: "w-7 h-7 sm:w-9 sm:h-9",
    lg: "w-8 h-8 sm:w-10 sm:h-10",
  };

  const pixelSizes = {
    sm: 15,
    md: 25,
    lg: 35,
  };

  const fallbackImage = "/images/user.png";

  // إعادة تعيين imageError عند تغيير src
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const imageSrc = src && !imageError ? src : fallbackImage;

  return (
    <Image
      className={`rounded-full ${sizeClasses[size]}`}
      height={pixelSizes[size]}
      width={pixelSizes[size]}
      alt="avatar"
      src={imageSrc}
      onError={() => setImageError(true)}
    />
  );
};

export default Avatar;
