"use client";

import { IconType } from "react-icons";
import { useTranslation } from "react-i18next";

interface CategoryProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
  type?: "category" | "offer";
}

const CategoryInput: React.FC<CategoryProps> = ({
  icon: Icon,
  label,
  selected,
  onClick,
  type = "category",
}) => {
  const { t } = useTranslation("common");
  
  // تحديد نوع الترجمة بناءً على النوع
  const getTranslatedLabel = () => {
    // إذا كان label يحتوي على نص مترجم بالفعل، استخدمه مباشرة
    if (label && typeof label === 'string' && !label.includes('.')) {
      return label;
    }
    
    // وإلا، حاول الترجمة
    if (type === "offer") {
      // للـ offers، استخدم المفتاح مباشرة
      return t(`offers.${label}`);
    } else {
      // للـ categories، استخدم الهيكل المعتاد
      return t(`categories.${label}.label`);
    }
  };
  
  return (
    <div
      onClick={() => onClick(label)}
      className={`
        relative
        rounded-xl
        border-2
        p-2 sm:p-3
        flex
        flex-col
        items-center
        justify-center
        gap-1 sm:gap-2
        hover:border-rose-500
        hover:shadow-lg
        hover:scale-105
        transition-all
        duration-300
        cursor-pointer
        transform
        min-h-[70px] sm:min-h-[80px] md:min-h-[90px]
        ${selected 
          ? "border-rose-500 bg-rose-50 shadow-lg scale-105" 
          : "border-neutral-200 hover:bg-gray-50"
        }
      `}
    >
      <div className={`
        w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center
        ${selected 
          ? "bg-rose-500 text-white" 
          : "bg-gray-100 text-gray-600"
        }
        transition-colors duration-300
      `}>
        <Icon size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
      </div>
      <div className={`
        font-semibold text-center text-xs sm:text-sm leading-tight
        ${selected ? "text-rose-700" : "text-gray-700"}
        transition-colors duration-300
      `}>
        {getTranslatedLabel()}
      </div>
      {selected && (
        <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 bg-rose-500 rounded-full flex items-center justify-center">
          <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CategoryInput;
