"use client";

import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  large?: boolean;
  icon?: IconType;
  isLoading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  large,
  icon: Icon,
  isLoading,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative
        disabled:opacity-70
        disabled:cursor-not-allowed
        rounded-lg
        hover:opacity-90
        transition-all
        duration-200
        transform
        hover:scale-[1.02]
        active:scale-[0.98]
        w-full
        font-semibold
        shadow-sm
        hover:shadow-md
        ${
          outline
            ? "bg-white border-2 border-gray-300 text-gray-700 hover:border-rose-400 hover:text-rose-600"
            : "bg-gradient-to-r from-rose-500 to-pink-500 border-2 border-rose-500 text-white hover:from-rose-600 hover:to-pink-600"
        }
        ${
          small
            ? "py-1.5 px-3 text-sm sm:py-2 sm:px-4 sm:text-sm"
            : large
            ? "py-2.5 px-4 text-base sm:py-3 sm:px-5 sm:text-lg lg:py-4 lg:px-7 lg:text-xl"
            : "py-2 px-4 text-sm sm:py-2.5 sm:px-5 sm:text-base md:py-3 md:px-6 md:text-lg"
        }
        ${className}
      `}
    >
      {isLoading ? (
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      ) : (
        Icon && (
          <Icon
            size={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
          />
        )
      )}
      <span className={`${Icon ? "ml-8" : ""} ${isLoading ? "invisible" : ""}`}>
        {label}
      </span>
    </button>
  );
};

export default Button;
