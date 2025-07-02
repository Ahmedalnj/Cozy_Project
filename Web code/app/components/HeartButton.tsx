"use client";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { SafeUser } from "../types";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser,
}) => {
  // Use currentUser to determine if the listing is a favorite
  const hasFavorite = currentUser?.favoriteIds?.includes(listingId) ?? false;

  // Use listingId and currentUser in the toggle function
  const toggleFavorite = () => {
    if (!currentUser) {
      // Optionally, show a login prompt here
      return;
    }
    // Here you would add/remove the favorite using listingId and currentUser
    // For now, just log them to show usage
    console.log(
      "Toggling favorite for listing:",
      listingId,
      "User:",
      currentUser.id
    );
  };

  return (
    <div
      onClick={toggleFavorite}
      className="
          relative
          hover:opacity-80
          transition
          cursor-pointer
          "
    >
      <AiOutlineHeart
        size={28}
        className="
        fill-white
        absolute
        -top-[2px]
        -right-[2px]
        "
      />
      <AiFillHeart
        size={24}
        className={hasFavorite ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default HeartButton;
