"use client";
import { IconType } from "react-icons";

interface MenuItemProps {
  onClick: () => void;
  label: string;
  Icon: IconType;
  isRTL?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, Icon, isRTL = false }) => {
  return (
    <div
      onClick={onClick}
      className={`
        px-4
        py-3
        hover:bg-neutral-100
        transition
        font-semibold
        flex
        ${isRTL ? 'flex-row-reverse' : 'justify-between'}
        items-center
        gap-2
      `}
    >
      <span className={isRTL ? 'text-right' : 'text-left'}>{label}</span>
      <Icon size={15} />
    </div>
  );
};

export default MenuItem;