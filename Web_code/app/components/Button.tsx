"use client";

import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
  isLoading,
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
        ${outline 
          ? "bg-white border-2 border-gray-300 text-gray-700 hover:border-rose-400 hover:text-rose-600" 
          : "bg-gradient-to-r from-rose-500 to-pink-500 border-2 border-rose-500 text-white hover:from-rose-600 hover:to-pink-600"
        }
        ${small ? "py-2 px-4 text-sm" : "py-4 px-6 text-lg"}
      `}
    >
      {isLoading ? (
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      ) : (
        Icon && <Icon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2" />
      )}
      <span className={`${Icon ? "ml-8" : ""} ${isLoading ? "invisible" : ""}`}>
        {label}
      </span>
    </button>
  );
};

export default Button;
