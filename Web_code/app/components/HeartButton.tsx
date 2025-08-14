"use client";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { SafeUser } from "../types";
import useFavorite from "../hooks/useFavorite";
import { useState, MouseEvent } from "react";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
  label: string;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
  label,
}) => {
  const { hasFavorited, toggleFavorite } = useFavorite({
    listingId,
    currentUser,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsAnimating(true);
    await toggleFavorite(e);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-2 group cursor-pointer"
    >
      <div className="relative">
        {/* Floating circle background */}
        <div
          className={`
          absolute -inset-2 rounded-full bg-rose-100/50
          transition-all duration-500 ease-out
          ${isAnimating ? "scale-125 opacity-80" : "scale-0 opacity-0"}
        `}
        />

        {/* Heart icons */}
        <AiOutlineHeart
          size={28}
          className="
            fill-white
            absolute
            -top-[2px]
            -right-[2px]
            transition-all
            duration-300
          "
        />
        <AiFillHeart
          size={24}
          className={`
            relative z-10
            ${hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
            transition-all duration-400 ease-out
            ${isAnimating ? "scale-110 -translate-y-1" : ""}
          `}
        />
      </div>

      <span
        className={`
        text-sm transition-all duration-300
        group-hover:text-rose-500
        ${hasFavorited ? "text-rose-500 font-medium" : "text-gray-600"}`}
      >
        {hasFavorited ? "Saved" : label}
      </span>
    </div>
  );
};

export default HeartButton;
