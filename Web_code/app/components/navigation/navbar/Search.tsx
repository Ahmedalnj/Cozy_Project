"use client";

import useCities from "@/app/hooks/useCities";
import useSearchModal from "@/app/hooks/useSearchModal";
import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const Search = () => {
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCities();
  const { t } = useTranslation("common");

  const locationValue = params?.get("locationValue");
  const startDate = params?.get("startDate");
  const endDate = params?.get("endDate");
  const guestCount = params?.get("guestCount");

  const locationLabel = useMemo(() => {
    if (locationValue) {
      return getByValue(locationValue as string)?.label;
    }
    return t("anywhere");
  }, [locationValue, getByValue, t]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      let diff = differenceInDays(end, start);

      if (diff == 0) {
        diff = 1;
      }

      return `${diff} ${t("days")}`;
    }
    return t("any_week");
  }, [startDate, endDate, t]);

  const guestLabel = useMemo(() => {
    if (guestCount) {
      return `${guestCount} ${t("guests")}`;
    }
    return t("add_guests");
  }, [guestCount, t]);

  return (
    <div
      onClick={searchModal.onOpen}
      className="
    w-full
    md:w-auto
    py-2
    rounded-full
    shadow-sm
    hover:shadow-md
    transition
    cursor-pointer
    max-w-full
    md:max-w-[600px]   /* حد أقصى للعرض في الشاشات الكبيرة */
    mx-auto             /* يحافظ على التمركز */
  "
    >
      <div
        className="
      flex
      flex-row
      items-center
      justify-between
      overflow-hidden    /* يمنع التداخل عند ضيق الشاشة */
    "
      >
        <div className="text-sm font-semibold px-3 sm:px-6 truncate">
          {locationLabel}
        </div>
        <div
          className="
        hidden sm:block
        text-sm
        font-semibold
        px-3 sm:px-6
        border-x-[1px]
        flex-1
        text-center
        truncate
      "
        >
          {durationLabel}
        </div>
        <div
          className="
        text-sm
        pl-3 sm:pl-6
        pr-2
        text-gray-600
        flex
        flex-row
        items-center
        gap-2 sm:gap-3
      "
        >
          <div className="hidden sm:block truncate">{guestLabel}</div>
          <div
            className="
          p-2
          bg-rose-500
          rounded-full
          text-white
          flex
          items-center
          justify-center
        "
          >
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
