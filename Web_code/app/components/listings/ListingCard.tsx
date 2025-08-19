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
      if (!disabled) onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const handleSecondaryAction = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!disabled) secondaryAction?.(secondaryActionId);
    },
    [secondaryAction, secondaryActionId, disabled]
  );

  const price = useMemo(
    () => (reservation ? reservation.totalPrice : data.price),
    [reservation, data.price]
  );

  const reservationDate = useMemo(() => {
    if (!reservation) return null;
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
      className="col-span-1 cursor-pointer group p-2 sm:p-0"
    >
      <div className="flex flex-col gap-1 sm:gap-2 xs:w-auto">
        <div className="aspect-square w-full relative overflow-hidden rounded-lg">
          <Image
            fill
            alt="Listing"
            src={imageSrc}
            className="object-cover h-full w-full group-hover:scale-110 transition"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
              showLabel={false}
            />
          </div>
        </div>

        {reservation?.user?.name && (
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mt-1">
            <span>Booked by:</span>
            <Avatar src={reservation?.user?.image} />
            <span className="font-medium sm:font-semibold">
              {reservation.user.name}
            </span>
          </div>
        )}

        <div className="font-semibold text-base sm:text-lg">
          {location?.region}, {location?.label}
        </div>

        <div className="font-light text-xs sm:text-sm text-neutral-500">
          {reservationDate || data.category}
        </div>

        <div className="flex flex-row items-center gap-1 text-sm sm:text-base">
          <div className="font-semibold">${price}</div>
          {!reservation && (
            <div className="font-light text-xs sm:text-sm">per night</div>
          )}
        </div>

        {(onAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            {onAction && actionLabel && (
              <div className="w-full xs:w-auto">
                <Button
                  disabled={disabled}
                  small
                  label={actionLabel}
                  onClick={handleCancel}
                />
              </div>
            )}
            {secondaryAction && secondaryActionLabel && (
              <div className="w-full xs:w-auto">
                <Button
                  disabled={disabled}
                  small
                  outline
                  label={secondaryActionLabel}
                  onClick={handleSecondaryAction}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
