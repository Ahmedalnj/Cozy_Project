"use client";

import { Range, RangeKeyDict } from "react-date-range";
import Calendar from "../inputs/Calender";
import Button from "../Button";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
  days?: number;
  locationLabel: string;
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
  locationLabel,
}) => {
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
            {days} night{days && days > 1 ? "s" : ""} in {locationLabel}
          </h3>
        </div>
      )}

      {/* Date and Guest Inputs */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="border rounded-lg p-3">
          <div className="text-xs font-medium text-gray-500">CHECK IN</div>
          <div className="text-sm">
            {dateRange.startDate
              ? format(dateRange.startDate, "MMM d, yyyy")
              : "Add date"}
          </div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs font-medium text-gray-500">CHECKOUT</div>
          <div className="text-sm">
            {dateRange.endDate
              ? format(dateRange.endDate, "MMM d, yyyy")
              : "Add date"}
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
            ${price} × {days} nights
          </span>
          <span>Total $ {totalPrice}</span>
        </div>
      </div>

      {/* Day Count Hint */}
      {showDayCountHint && days === 0 && (
        <div className="mb-2 text-sm text-rose-500 text-center">
          Please select at least 1 night stay
        </div>
      )}

      {/* Reserve Button */}
      <div className="mb-2">
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      </div>

      <p className="text-center text-sm text-gray-500 mb-4">
        You won't be charged yet
      </p>

      <div className="text-center">
        <button className="text-sm underline text-gray-500">
          Report this listing
        </button>
      </div>
    </div>
  );
};

export default ListingReservation;
