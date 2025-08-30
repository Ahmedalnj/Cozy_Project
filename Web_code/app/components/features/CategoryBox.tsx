"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { IconType } from "react-icons";
import qs from "query-string";
import { useTranslation } from "react-i18next";

interface CategoryBoxProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  value?: string;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
  value,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useTranslation("common");
  const [iconSize, setIconSize] = useState(20);
  
  useEffect(() => {
    const updateIconSize = () => {
      if (window.innerWidth >= 1024) { // lg
        setIconSize(26);
      } else if (window.innerWidth >= 768) { // md
        setIconSize(24);
      } else { // mobile
        setIconSize(20);
      }
    };
    
    updateIconSize();
    window.addEventListener('resize', updateIconSize);
    return () => window.removeEventListener('resize', updateIconSize);
  }, []);
  
  // الحصول على النص المترجم
  const getTranslatedLabel = () => {
    // إذا كان label يحتوي على نص مترجم بالفعل، استخدمه مباشرة
    if (label && typeof label === 'string' && !label.includes('.')) {
      return label;
    }
    
    try {
      // محاولة الحصول على الترجمة من categories
      return t(`categories.${label}.label`);
    } catch {
      // إذا لم توجد ترجمة، استخدم النص الأصلي
      return label;
    }
  };
  
  const handleClick = useCallback(() => {
    let currentQuery = {};
    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    const categoryValue = value || label;
    const updatedQuery: Record<string, string> = {
      ...Object.entries(currentQuery).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (typeof value === "string") acc[key] = value;
          return acc;
        },
        {}
      ),
      category: categoryValue,
    };
    if (params?.get("category") == categoryValue) {
      delete updatedQuery.category;
    }
    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    router.push(url);
  }, [label, value, params, router]);
  
  return (
    <div
      onClick={handleClick}
      className={`
        flex
        flex-col
        items-center
        justify-center
        gap-1
        md:gap-2
        p-2
        md:p-3
        border-b-2
        hover:text-neutral-800
        hover:scale-105
        transition-all
        duration-200
        cursor-pointer
        transform
        min-w-[60px]
        md:min-w-0
        ${selected ? "border-b-neutral-800" : "border-transparent"}
        ${selected ? "text-neutral-800" : "text-neutral-500"}
      `}
    >
      <Icon size={iconSize} />
      <div
        className="
          font-medium
          text-xs
          md:text-sm
          text-center
          leading-tight
          md:leading-normal
        "
      >
        {getTranslatedLabel()}
      </div>
    </div>
  );
};

export default CategoryBox;
