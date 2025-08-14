"use client";

import { SafeListing, SafeUser, SaveReservation } from "@/app/types";

import { useRouter } from "next/navigation";
import useCountries from "@/app/hooks/useCountry";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "@/app/components/HeartButton";
import Button from "../Button";
import Avatar from "../Avatar";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SaveReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  description?: string;

  // الإضافة هنا:
  secondaryAction?: (id: string) => void;
  secondaryActionLabel?: string;
  secondaryActionId?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,

  secondaryAction,
  secondaryActionLabel,
  secondaryActionId = "",
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);
  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const handleSecondaryAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      secondaryAction?.(secondaryActionId);
    },
    [secondaryAction, secondaryActionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  const imageSrc =
    Array.isArray(data.imageSrc) && data.imageSrc.length > 0
      ? data.imageSrc[0]
      : "/images/Empty.png";

  return (
    <div
      onClick={() => router.push(`/listings/${data.id}`)}
      className="
            col-span-1 cursor-pointer group
            "
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
                aspect-square
                w-full
                relative
                overflow-hidden
                rounded-lg
                "
        >
          <Image
            fill
            alt="Listing"
            src={imageSrc}
            className="
                    object-cover
                    h-full
                    w-full
                    group-hover:scale-110
                    transition
                    "
          />

          <div className="absolute top-3 right-3">
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
              showLabel={false}
            />
          </div>
        </div>
        {reservation?.user?.name && (
          <div className="flex items-center gap-2 font-light text-sm text-gray-600 mt-1">
            <span>Booked by:</span>
            <Avatar src={reservation?.user?.image || "/images/user.png"} />
            <span className="font-semibold">{reservation.user.name}</span>
          </div>
        )}
        <div className="font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>

        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>

        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">${price}</div>

          {!reservation && <div className="font-light">per night</div>}
        </div>

        <div className="flex flex-row gap-2">
          {onAction && actionLabel && (
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
            />
          )}

          {secondaryAction && secondaryActionLabel && (
            <Button
              disabled={disabled}
              small
              outline // إضافة لتوضيح الفرق إذا تحب (اختياري)
              label={secondaryActionLabel}
              onClick={handleSecondaryAction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
