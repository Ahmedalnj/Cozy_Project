"use client";
import { IconType } from "react-icons";
interface MenuItemProps {
  onClick: () => void;
  label: string;
  Icon: IconType;
}
const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, Icon }) => {
  return (
    <div
      onClick={onClick}
      className="
        px-4
        py-3
        hover:bg-neutral-100
        transition
        font-semibold
        flex
        justify-between"
    >
      {label}
      <Icon size={15} />
    </div>
  );
};

export default MenuItem;
