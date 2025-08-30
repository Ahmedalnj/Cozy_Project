"use client";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { SafeUser } from "../types";
import useFavorite from "../hooks/useFavorite";
import { useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
  label?: string;
  showLabel?: boolean; // أضفنا خاصية جديدة للتحكم في عرض النص
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
  label, // قيمة افتراضية
  showLabel = true, // افتراضيًا يعرض النص
}) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
    currentUser,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const { t } = useTranslation("common");

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsAnimating(true);
    await toggleFavorite(e);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-1 sm:gap-2 group cursor-pointer ${
        !showLabel ? "justify-center" : ""
      }`}
    >
      <div className="relative">
        {/* Heart icons */}
        <AiOutlineHeart
          size={20}
          className="
            fill-white
            absolute
            -top-[1px]
            -right-[1px]
            transition-all
            duration-80
            sm:w-7 sm:h-7
            md:w-7 md:h-7
          "
        />
        <AiFillHeart
          size={16}
          className={`
            relative z-auto
            ${hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
            transition-all duration-70 ease-out
            ${isAnimating ? "scale-110 -translate-y-1" : ""}
            sm:w-6 sm:h-6
            md:w-6 md:h-6
          `}
        />
      </div>

      {showLabel && (
        <span
          className={`
          text-xs sm:text-sm transition-all duration-50
          group-hover:text-rose-500
          ${hasFavorited ? "text-rose-500 font-medium" : "text-gray-600"}`}
        >
          {hasFavorited ? t("Added_to_Favorites") : label}
        </span>
      )}
    </div>
  );
};

export default HeartButton;
