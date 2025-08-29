"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string";
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
    gap-2
    p-3
    border-b-2
    hover:text-neutral-800
    hover:scale-105
    transition-all
    duration-200
    cursor-pointer
    transform
    ${selected ? "border-b-neutral-800" : "border-transparent"}
    ${selected ? "text-neutral-800" : "text-neutral-500"}
    `}
    >
      <Icon size={26} />
      <div
        className="
      font-medium
      text-sm
      "
      >
        {label}
      </div>
    </div>
  );
};

export default CategoryBox;
