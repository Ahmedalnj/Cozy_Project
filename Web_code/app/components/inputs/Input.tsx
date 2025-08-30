"use client";

import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  RegisterOptions,
  Path,
} from "react-hook-form";
import { BiDollar } from "react-icons/bi";

interface InputProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  formatPrice?: boolean;
  register?: UseFormRegister<T>; // جعلها اختيارية
  errors: FieldErrors<T>;
  validation?: RegisterOptions<T>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  defaultValue?: string | null;
}

const Input = <T extends FieldValues>({
  id,
  label,
  type = "text",
  disabled,
  required,
  formatPrice,
  register,
  errors,
  validation,
  value,
  defaultValue,
  readOnly,
}: InputProps<T>) => {
  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="
            text-neutral-700
            absolute
            top-5
            left-3
            z-10
          "
        />
      )}
      <input
        id={id}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue ?? undefined}
        readOnly={readOnly}
        {...(register ? register(id, { required, ...validation }) : {})}
        placeholder=" "
        type={type}
        className={`
          peer
          w-full
          p-3
          pt-5
          font-light
          bg-white
          border-2
          rounded-lg
          outline-none
          transition-all
          duration-200
          disabled:opacity-70
          disabled:cursor-not-allowed
          shadow-sm
          ${formatPrice ? "pl-10" : "pl-4"}
          ${errors[id] 
            ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-200" 
            : "border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
          }
          hover:border-gray-400
        `}
      />
      {errors[id] && (
        <p className="text-rose-500 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors[id]?.message as string}
        </p>
      )}
      <label
        className={`
          absolute
          text-sm
          font-medium
          duration-200
          transform
          -translate-y-3
          top-4
          z-10
          origin-[0]
          ${formatPrice ? "left-10" : "left-4"}
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] 
            ? "text-rose-500 peer-focus:text-rose-500" 
            : "text-gray-500 peer-focus:text-rose-500"
          }
          ${disabled ? "text-gray-400 peer-focus:text-gray-400" : ""}
        `}
      >
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>
    </div>
  );
};

export default Input;
