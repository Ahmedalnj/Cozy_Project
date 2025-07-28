"use client";

interface MenuItemProps {
  onClick: () => void;
  label: string;
  variant?: "default" | "logout";
}

const MenuItem: React.FC<MenuItemProps> = ({
  onClick,
  label,
  variant = "default",
}) => {
  const baseClasses = `
    px-4
    py-3
    transition
    font-semibold
    cursor-pointer
    rounded-md
  `;

  // تحديد الستايل حسب النوع
  const variantClasses =
    variant === "logout"
      ? "bg-white text-neutral-800 hover:bg-[#00B4D8] hover:text-white"
      : "hover:bg-neutral-100 text-white-800";

  return (
    <div onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {label}
    </div>
  );
};

export default MenuItem;
