"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { categories } from "@/app/components/navbar/Categories";
import { SafeListing, SafeUser, SaveReservation } from "@/app/types";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import toast from "react-hot-toast";
import ListingReservation from "@/app/components/listings/ListingReservation";
import { Range } from "react-date-range";
import useCountries from "@/app/hooks/useCountry";
import { offers as allOffers } from "@/app/components/offers";
import { IconType } from "react-icons";
import ListingMap from "@/app/components/listings/ListingMap";

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
  const { getByValue } = useCountries();
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      toast.error("You cannot reserve your own listing.");
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      toast.error("Please select valid check-in and checkout dates.");
      return;
    }

    const days = differenceInCalendarDays(
      dateRange.endDate,
      dateRange.startDate
    );
    if (days <= 0) {
      toast.error("Minimum 1 night stay required");
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
      location: location?.label || listing.locationValue,
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
      .map((label) => allOffers.find((o) => o.label === label))
      .filter(Boolean) as {
      icon: IconType;
      label: string;
      description: string;
    }[];
  }, [listing.offers]);

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
                locationLabel={location?.label || ""}
              />
              {isOwner && (
                <div className="mt-4 rounded-xl border-l-4 border-rose-700 bg-rose-100 p-4 shadow-sm">
                  <p className="text-sm text-red-600 font-medium">
                    ⚠️ لا يمكنك حجز إعلانك الخاص. إذا كنت صاحب هذا العقار، فلست
                    بحاجة إلى إجراء حجز.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div>
            <ListingMap
              locationValue={listing.locationValue}
              locationLabel={location?.label || ""}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
