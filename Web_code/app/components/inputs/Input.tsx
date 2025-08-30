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
            left-2
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
          p-4
          pt-6
          font-light
          bg-white
          border-2
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"}
          ${errors[id] ? "border-rose-500" : "border-neutral-300"}
          ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
        `}
      />
      {errors[id] && (
        <p className="text-rose-500 text-sm mt-1">
          {errors[id]?.message as string}
        </p>
      )}
      <label
        className={`
          absolute
          text-md
          duration-150
          transform
          -translate-y-3
          top-5
          z-10
          origin-[0]
          ${formatPrice ? "left-9" : "left-4"}
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? "text-rose-500" : "text-zinc-400"}
          ${errors[id] ? "peer-focus:text-rose-500" : "peer-focus:text-black"}
          ${disabled ? "text-neutral-400" : "text-zinc-400"}
          ${disabled ? "peer-focus:text-neutral-400" : "peer-focus:text-black"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
