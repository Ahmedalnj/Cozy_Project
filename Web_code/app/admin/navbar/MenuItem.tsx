"use client";
import { IconType } from "react-icons";

interface MenuItemProps {
  onClick: () => void;
  label: string;
  Icon: IconType;
  variant?: "default" | "logout";
  isRTL?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  onClick,
  label,
  Icon,
  variant = "default",
  isRTL = false,
}) => {
  const baseClasses = `
    px-4
    py-3
    transition
    font-semibold
    cursor-pointer
    rounded-md
    flex
    items-center
    gap-2
  `;

  // تحديد الستايل حسب النوع
  const variantClasses =
    variant === "logout"
      ? "bg-white text-neutral-800 hover:bg-[#00B4D8] hover:text-white"
      : "hover:bg-neutral-100 text-white-800";

  return (
    <div 
      onClick={onClick} 
      className={`
        ${baseClasses} 
        ${variantClasses}
        ${isRTL ? 'flex-row-reverse' : 'justify-between'}
      `}
    >
      <span className={isRTL ? 'text-right' : 'text-left'}>{label}</span>
      <Icon size={15} />
    </div>
  );
};

export default MenuItem;