"use client";

import { useRouter } from "next/navigation";
import Heading from "./Heading";
import Button from "./Button";
import { useTranslation } from "react-i18next";

interface EmptyState {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyState> = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters",
  showReset,
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  // ترجمة العنوان والوصف إذا كانا مفاتيح ترجمة
  const translatedTitle = title.includes(" ") ? title : t(title);
  const translatedSubtitle = subtitle.includes(" ") ? subtitle : t(subtitle);

  return (
    <div
      className="
            h-[60vh]
            flex
            flex-col
            gap-2
            justify-center
            items-center
        "
    >
      <Heading center title={translatedTitle} subtitle={translatedSubtitle} />

      <div className="w-48 mt-4">
        {showReset && (
          <Button
            outline
            label={t("remove_all_filters")}
            onClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
