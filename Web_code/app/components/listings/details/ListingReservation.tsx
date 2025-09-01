"use client";

import { Range, RangeKeyDict } from "react-date-range";
import Calendar from "@/app/components/forms/inputs/Calender";
import Button from "@/app/components/ui/Button";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useCities from "@/app/hooks/useCities";

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
  days?: number;
  locationValue?: string;
  isReserved?: boolean;
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  days,
  locationValue,
}) => {
  const { t, i18n } = useTranslation("common");
  const { getByValue } = useCities();
  const location = locationValue ? getByValue(locationValue) : null;
  const [showDayCountHint, setShowDayCountHint] = useState(false);

  useEffect(() => {
    setShowDayCountHint(days === 0);
  }, [days]);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm">
      {/* Header with nights and location */}
      {dateRange.startDate && dateRange.endDate && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {days}{" "}
            {days && days > 1
              ? t("listing_reservation.nights_in")
              : t("listing_reservation.night_in")}{" "}
            {location
              ? i18n.language === "ar"
                ? location.label
                : location.labelEn
              : ""}
          </h3>
        </div>
      )}

      {/* Date and Guest Inputs */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="border rounded-lg p-3">
          <div className="text-xs font-medium text-gray-500">
            {t("listing_reservation.check_in")}
          </div>
          <div className="text-sm">
            {dateRange.startDate
              ? format(dateRange.startDate, "MMM d, yyyy")
              : t("listing_reservation.add_date")}
          </div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs font-medium text-gray-500">
            {t("listing_reservation.check_out")}
          </div>
          <div className="text-sm">
            {dateRange.endDate
              ? format(dateRange.endDate, "MMM d, yyyy")
              : t("listing_reservation.add_date")}
          </div>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="mb-4">
        <Calendar
          value={dateRange}
          disabledDates={disabledDates}
          onChange={(value: RangeKeyDict) => onChangeDate(value.selection)}
        />
      </div>

      {/* Price Summary */}
      <div className="mb-4 p-4 border rounded-lg">
        <div className="flex justify-between font-semibold">
          <span>
            {t("LYD")}
            {price} {t("listing_reservation.price_per_night")} {days}
          </span>
          <span>
            {t("listing_reservation.total")} {t("LYD")} {totalPrice}
          </span>
        </div>
      </div>

      {/* Day Count Hint */}
      {showDayCountHint && days === 0 && (
        <div className="mb-2 text-sm text-rose-500 text-center">
          {t("listing_reservation.select_at_least_one_night")}
        </div>
      )}

      {/* Reserve Button */}
      <div className="mb-2">
        <Button
          disabled={disabled}
          label={t("listing_reservation.reserve")}
          onClick={onSubmit}
        />
      </div>

      <p className="text-center text-sm text-gray-500 mb-4">
        {t("listing_reservation.wont_be_charged")}
      </p>

      <div className="text-center">
        <button className="text-sm underline text-gray-500">
          {t("listing_reservation.report_listing")}
        </button>
      </div>
    </div>
  );
};

export default ListingReservation;
