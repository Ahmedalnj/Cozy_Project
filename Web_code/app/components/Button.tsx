"use client";
import React from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small,
  icon: Icon,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
      relative
      disabled:opacity-70
      disabled:cursor-not-allowed
      rounded-lg
      transition
      w-full
      ${
        outline
          ? "bg-white border-black text-black hover:bg-black hover:text-white"
          : "bg-rose-500 border-rose-500 text-white hover:bg-rose-600"
      }
      ${small ? "py-1 text-sm" : "py-3 text-md"}
      ${small ? "border-[1px]" : "border-2"}
      ${small ? "font-light" : "font-semibold"}  
      `}
    >
      {Icon && <Icon size={24} className="absolute left-4 top-3" />}
      {label}
    </button>
  );
};

export default Button;
