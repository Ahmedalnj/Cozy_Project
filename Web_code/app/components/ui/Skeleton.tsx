// في ملف src/app/components/Skeleton.tsx
import React from "react";
import { useTranslation } from "react-i18next";

interface SkeletonProps {
  loading?: boolean;
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  loading = true,
  active = false,
  children,
  className = "",
}) => {
  const { t } = useTranslation("common");
  if (!loading) return <>{children}</>;

  return (
    <div
      className={`animate-pulse rounded-md ${
        active ? "bg-gray-200" : "bg-gray-100"
      } ${className}`}
              aria-label={t("loading")}
    >
      {children &&
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              className: `${child.props || ""} opacity-0`,
            } as React.HTMLAttributes<HTMLElement>);
          }
          return child;
        })}
    </div>
  );
};

export default Skeleton;
