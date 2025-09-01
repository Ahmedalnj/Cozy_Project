"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { categories } from "@/app/components/navigation/navbar/Categories";
import { SafeListing, SafeUser, SaveReservation } from "@/app/types";
import Container from "@/app/components/ui/Container";
import ListingHead from "@/app/components/listings/details/ListingHead";
import ListingInfo from "@/app/components/listings/details/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import toast from "react-hot-toast";
import ListingReservation from "@/app/components/listings/details/ListingReservation";
import { Range } from "react-date-range";
import useCities from "@/app/hooks/useCities";
import { useOffers } from "@/app/components/features/offers";
import { IconType } from "react-icons";
import ListingMap from "@/app/components/listings/details/ListingMap";
import { useTranslation } from "react-i18next";
import ReviewsSection from "@/app/components/reviews/ReviewsSection";

const initialDateRange: Range = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  reservations?: SaveReservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const LoginModal = useLoginModal();
  const router = useRouter();
  const { getByValue } = useCities();
  const { t, i18n } = useTranslation("common");
  const allOffers = useOffers();
  const location = getByValue(listing.locationValue);

  const isOwner = useMemo(() => {
    return currentUser?.id === listing.user.id;
  }, [currentUser?.id, listing.user.id]);

  const disabledDate = useMemo(() => {
    let dates: Date[] = [];
    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const dayCount = useMemo(() => {
    if (dateRange.startDate && dateRange.endDate) {
      return differenceInCalendarDays(dateRange.endDate, dateRange.startDate);
    }
    return 0;
  }, [dateRange]);

  const handleReservationRedirect = useCallback(() => {
    if (!currentUser) {
      return LoginModal.onOpen();
    }
    if (isOwner) {
      toast.error(t("listing_client.cannot_reserve_own_listing"));
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error(t("listing_client.select_valid_dates"));
      return;
    }

    const days = differenceInCalendarDays(
      dateRange.endDate,
      dateRange.startDate
    );
    if (days <= 0) {
      toast.error(t("listing_client.minimum_one_night"));
      return;
    }
    console.log("Listing imageSrc:", listing.imageSrc);

    // إعداد بيانات الحجز للتوجيه إلى صفحة الحجز
    const reservationData = {
      totalPrice,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      days: dayCount,
      listingId: listing.id,
      listingTitle: listing.title,
      pricePerNight: listing.price,
      location: location
        ? i18n.language === "ar"
          ? location.label
          : location.labelEn
        : listing.locationValue,
      imageSrc: listing.imageSrc,
      // إضافة بيانات المستخدم الحالي
      currentUser: {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
      },
    };

    // التوجيه إلى صفحة الحجز مع بيانات الحجز كاستعلام
    router.push(
      `/reservation?data=${encodeURIComponent(JSON.stringify(reservationData))}`
    );
  }, [
    totalPrice,
    dateRange,
    dayCount,
    listing.id,
    listing.title,
    listing.price,
    listing.locationValue,
    listing.imageSrc,
    location,
    router,
    currentUser,
    LoginModal,
    isOwner,
    t,
    i18n.language,
  ]);

  useEffect(() => {
    if (dayCount && listing.price) {
      setTotalPrice(dayCount * listing.price);
    } else {
      setTotalPrice(listing.price);
    }
  }, [dayCount, listing.price]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);

  const images = Array.isArray(listing.imageSrc)
    ? listing.imageSrc
    : [listing.imageSrc];

  const listingOffers = useMemo(() => {
    if (!listing.offers || listing.offers.length === 0) return [];

    return listing.offers
      .map((label) => {
        // Try exact match first
        let found = allOffers.find((o) => o.englishLabel === label);

        // If not found, try case-insensitive match
        if (!found) {
          found = allOffers.find(
            (o) => o.englishLabel.toLowerCase() === label.toLowerCase()
          );
        }

        // If still not found, try partial match
        if (!found) {
          found = allOffers.find(
            (o) =>
              o.englishLabel.toLowerCase().includes(label.toLowerCase()) ||
              label.toLowerCase().includes(o.englishLabel.toLowerCase())
          );
        }

        return found;
      })
      .filter(Boolean) as {
      icon: IconType;
      label: string;
      description: string;
    }[];
  }, [listing.offers, allOffers]);

  return (
    <Container>
      <div className="xl:px-35 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={images}
            id={listing.id}
            currentUser={currentUser}
            showLabel={false}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              offers={listingOffers}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={handleReservationRedirect}
                disabled={isLoading || isOwner}
                disabledDates={disabledDate}
                days={dayCount}
                locationValue={listing.locationValue}
              />
              {isOwner && (
                <div className="mt-4 rounded-xl border-l-4 border-rose-700 bg-rose-100 p-4 shadow-sm">
                  <p className="text-sm text-red-600 font-medium">
                    {t("listing_client.owner_warning_title")}.{" "}
                    {t("listing_client.owner_warning_message")}.
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Reviews Section */}
          <div className="mt-8">
            <ReviewsSection
              listingId={listing.id}
              currentUser={currentUser}
              isOwner={isOwner}
            />
          </div>

          <div>
            <ListingMap locationValue={listing.locationValue} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
