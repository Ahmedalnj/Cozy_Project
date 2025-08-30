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
import { useTranslation } from "react-i18next";

import ReviewSummary from "../ReviewSummary";

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
  showGuestDetails?: boolean;
  showPaidStatus?: boolean;
  showCashPendingStatus?: boolean;
  showRejectedStatus?: boolean;
  showPendingStatus?: boolean;
  pendingMessage?: string;
  isHostView?: boolean;
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
  showPaidStatus = false,
  showCashPendingStatus = false,
  showRejectedStatus = false,
  isHostView = false,
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const { t } = useTranslation("common");

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
      className="col-span-1 cursor-pointer group p-1 sm:p-2 md:p-0 transform hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="aspect-square w-full relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 ease-out">
          <Image
            fill
            alt="Listing"
            src={imageSrc}
            className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-3 md:right-3 transform group-hover:scale-110 transition-transform duration-200">
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
              showLabel={false}
            />
          </div>
        </div>

        {reservation?.user?.name && (
          <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-600 mt-1">
            <span className="text-xs">{t("booked_by")}</span>
            <Avatar src={reservation?.user?.image} size="sm" />
            <span className="font-medium text-xs sm:text-sm">
              {reservation.user.name}
            </span>
          </div>
        )}

        {/* Payment Status */}
        {showPaidStatus && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-1 sm:p-2 mt-1 sm:mt-2">
            <div className="text-xs text-green-800 font-semibold">
              ✅ {t("paid")}
            </div>
          </div>
        )}

        {/* Cash Pending Status */}
        {showCashPendingStatus && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-1 sm:p-2 mt-1 sm:mt-2">
            <div className="text-xs text-yellow-800 font-semibold">
              ⏳ {t("cash_pending")}
            </div>
            <div className="text-xs text-yellow-700 mt-1">
              {t("cash_pending_note")}
            </div>
          </div>
        )}

        {/* Rejected Status */}
        {showRejectedStatus && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-1 sm:p-2 mt-1 sm:mt-2">
            <div className="text-xs text-red-800 font-semibold">
              ❌ {t("reservation_rejected")}
            </div>
            <div className="text-xs text-red-700 mt-1">
              {isHostView
                ? t("reservation_rejected_host_note")
                : t("reservation_rejected_note")}
            </div>
          </div>
        )}

        <div className="font-semibold text-xs sm:text-sm md:text-base group-hover:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2">
          {reservationDate || <>{data.title}</>}
        </div>
        <div className="font-light text-xs sm:text-sm md:text-base group-hover:text-blue-600 transition-colors duration-200 leading-tight line-clamp-2">
          {location?.label}
        </div>

        {/* Reviews Summary */}
        <ReviewSummary listingId={data.id} size="sm" />

        <div className="flex flex-row items-center gap-1 text-xs sm:text-sm md:text-base">
          <div className="font-semibold group-hover:text-green-600 transition-colors duration-200">
            ${price}
          </div>
          {!reservation && (
            <div className="font-light text-xs">{t("per_night")}</div>
          )}
        </div>

        {(onAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-1 sm:mt-2">
            {onAction && actionLabel && (
              <div className="w-full">
                <Button
                  disabled={disabled}
                  small
                  label={actionLabel}
                  onClick={handleCancel}
                />
              </div>
            )}
            {secondaryAction && secondaryActionLabel && (
              <div className="w-full">
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
