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
        hover:opacity-80
        transition
        w-full
        ${outline ? "bg-white" : "bg-rose-500"}
        ${outline ? "border-black" : "border-rose-500"}
        ${outline ? "text-black" : "text-white"}
        ${small ? "py-1" : "py-3"}
        ${small ? "text-sm" : "text-md"}
        ${small ? "font-light" : "font-semibold"}
        ${small ? "border-[1px]" : "border-2"}
      `}
    >
      {isLoading ? (
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center">
          <span className="animate-spin">{Icon && <Icon size={24} />}</span>
        </div>
      ) : (
        Icon && <Icon size={24} className="absolute left-4" />
      )}
      <span className={`${Icon ? "ml-8" : ""} ${isLoading ? "invisible" : ""}`}>
        {label}
      </span>
    </button>
  );
};

export default Button;
