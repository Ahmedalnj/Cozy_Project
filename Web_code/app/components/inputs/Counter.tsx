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
        <div className="font-semibold text-lg text-gray-800">{title}</div>
        <div className="font-light text-gray-600 text-sm">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div
          onClick={onReduce}
          className={`
            w-12 h-12 rounded-full border-2 flex items-center justify-center 
            cursor-pointer transition-all duration-200 transform hover:scale-110
            ${value === 1 
              ? "border-gray-200 text-gray-300 cursor-not-allowed" 
              : "border-rose-500 text-rose-500 hover:bg-rose-50"
            }
          `}
        >
          <AiOutlineMinus size={20} />
        </div>
        <div className="font-bold text-2xl text-gray-800 min-w-[3rem] text-center">
          {value}
        </div>
        <div
          onClick={onAdd}
          className="w-12 h-12 rounded-full border-2 border-rose-500 flex items-center justify-center text-rose-500 cursor-pointer hover:bg-rose-50 transition-all duration-200 transform hover:scale-110"
        >
          <AiOutlinePlus size={20} />
        </div>
      </div>
      {error && (
        <div className="absolute -bottom-6 left-0">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Counter;

