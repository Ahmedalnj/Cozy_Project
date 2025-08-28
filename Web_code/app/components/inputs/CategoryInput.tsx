"use client";

import { IconType } from "react-icons";

interface CategoryProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  onClick: (value: string) => void;
}
const CategoryInput: React.FC<CategoryProps> = ({
  icon: Icon,
  label,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`
        rounded-xl
        border-2
        p-6
        flex
        flex-col
        gap-4
        hover:border-rose-500
        hover:shadow-lg
        hover:scale-105
        transition-all
        duration-300
        cursor-pointer
        transform
        ${selected 
          ? "border-rose-500 bg-rose-50 shadow-lg scale-105" 
          : "border-neutral-200 hover:bg-gray-50"
        }
      `}
    >
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center
        ${selected 
          ? "bg-rose-500 text-white" 
          : "bg-gray-100 text-gray-600"
        }
        transition-colors duration-300
      `}>
        <Icon size={24} />
      </div>
      <div className={`
        font-semibold text-center
        ${selected ? "text-rose-700" : "text-gray-700"}
        transition-colors duration-300
      `}>
        {label}
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CategoryInput;
