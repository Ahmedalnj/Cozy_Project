"use client";

import { useCallback, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean; // إضافة required هنا
  validation?: {
    min?: number;
    message?: string;
  };
}

const Counter: React.FC<CounterProps> = ({
  title,
  subtitle,
  value,
  onChange,
  required,
  validation,
}) => {
  const [error, setError] = useState<string | null>(null);

  const onAdd = useCallback(() => {
    // تحقق من القيم
    if (validation?.min && value + 1 < validation.min) {
      setError(
        validation.message || `Value must be at least ${validation.min}`
      );
      return;
    }

    // إزالة الخطأ إذا تم التحقق بنجاح
    setError(null);
    onChange(value + 1);
  }, [onChange, value, validation]);

  const onReduce = useCallback(() => {
    if (value === 1) {
      return;
    }

    // تحقق من القيم
    if (validation?.min && value - 1 < validation.min) {
      setError(
        validation.message || `Value must be at least ${validation.min}`
      );
      return;
    }

    // إزالة الخطأ إذا تم التحقق بنجاح
    setError(null);
    onChange(value - 1);
  }, [onChange, value, validation]);

  // التحقق من الحقول المطلوبة
  if (required && value === 0 && !error) {
    setError("This field is required.");
  }

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <div className="font-medium">{title}</div>
        <div className="font-light text-gray-600">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div
          onClick={onReduce}
          className="w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition"
        >
          <AiOutlineMinus />
        </div>
        <div className="font-light text-xl text-neutral-600">{value}</div>
        <div
          onClick={onAdd}
          className="w-10 h-10 rounded-full border-[1px] border-neutral-400 flex items-center justify-center text-neutral-600 cursor-pointer hover:opacity-80 transition"
        >
          <AiOutlinePlus />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Counter;
