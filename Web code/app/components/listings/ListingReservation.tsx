"use client";

import { Range } from "react-date-range";
import Calendar from "../inputs/Calender";
import Button from "../Button";

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
  // price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  days,
  locationLabel,
}) => {
  const renderDateMessage = () => {
    if (!dateRange.startDate) {
      return (
        <div className="p-4 text-center text-neutral-600">
          Select check-in date
        </div>
      );
    }
    if (!dateRange.endDate || dateRange.endDate <= dateRange.startDate) {
      return (
        <div className="p-4 text-center text-neutral-600">
          Select checkout date
        </div>
      );
    }
    return (
      <div className="p-4 text-center font-semibold">
        {days} night{days && days > 1 ? "s" : ""} in {locationLabel}
      </div>
    );
  };

  return (
    <div
      className="
        bg-white
        rounded-xl
        border-[1px]
        border-neutral-200
        overflow-hidden
        "
    >
      <div
        className="
            flex flex-row items-center gap-1 p-4
            "
      >
        <div className="text-sxl font-semibold">{renderDateMessage()}</div>
      </div>
      <hr />
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      <hr />
      <div className="p-4">
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      </div>
      <div
        className="
                p-4
                flex
                flex-row
                item-center
                justify-between
                font-semibold
                text-lg
            "
      >
        <div>Total</div>
        <div>$ {totalPrice}</div>
      </div>
    </div>
  );
};

export default ListingReservation;
