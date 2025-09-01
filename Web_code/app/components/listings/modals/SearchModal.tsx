"use client";
import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "../../modals/base/modal";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CitySelect, { CitySelectValue } from "../../forms/inputs/CitySelect";
import qs from "query-string";
import { formatISO } from "date-fns";
import Heading from "../../ui/Heading";
import Calendar from "../../forms/inputs/Calender";
import Counter from "../../forms/inputs/Counter";
import PriceRange from "../../forms/inputs/PriceRange";
enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
  PRICE = 3,
}
const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [location, setLocation] = useState<CitySelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const [dateRange, setDateRAnge] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("../../features/Map"), {
        ssr: false,
      }),
    []
  );

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);
  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    
    // تعريف واجهة للاستعلام
    interface SearchQuery {
      locationValue?: string;
      guestCount?: number;
      roomCount?: number;
      bathroomCount?: number;
      minPrice?: number;
      maxPrice?: number;
      startDate?: string;
      endDate?: string;
      [key: string]: any; // للخصائص الأخرى من currentQuery
    }
    
    const updateQuery: SearchQuery = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
      minPrice,
      maxPrice,
    };

    if (dateRange.startDate) {
      updateQuery.startDate = formatISO(dateRange.startDate);
    }
    if (dateRange.endDate) {
      updateQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updateQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();

    router.push(url);
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    onNext,
    params,
    minPrice,
    maxPrice,
  ]);

  const actionLabel = useMemo(() => {
    if (step == STEPS.PRICE) {
      return "Search";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step == STEPS.LOCATION) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where Do You Wanna Go ?"
        subtitle="Find The Perfect Location!"
      />
      <CitySelect
        value={location}
        onChange={(value) => setLocation(value as CitySelectValue)}
      />
      <hr />
      <Map
        center={
          (location?.latlng && location.latlng.length === 2
            ? [location.latlng[0], location.latlng[1]]
            : [32.8872, 13.191]) as [number, number]
        }
      />
    </div>
  );

  if (step == STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When Do You Plan To Go?"
          subtitle="Make Sure Everyone Is Free!"
        />
        <Calendar
          value={dateRange}
          onChange={(value) => setDateRAnge(value.selection)}
        />
      </div>
    );
  }

  if (step == STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="More Information" subtitle="Find Your Perfect Places" />
        <Counter
          title="Guests"
          subtitle="How Many Guests Are Coming?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />
        <Counter
          title="Rooms"
          subtitle="How Many Rooms Are You Need?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />
        <Counter
          title="BathRooms"
          subtitle="How Many BathRooms Are You Need?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />
      </div>
    );
  }

  if (step == STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Price Range" subtitle="Set your budget" />
        <PriceRange
          minPrice={minPrice}
          maxPrice={maxPrice}
          onChange={(min, max) => {
            setMinPrice(min);
            setMaxPrice(max);
          }}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filters"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step == STEPS.LOCATION ? undefined : onBack}
      body={bodyContent}
    ></Modal>
  );
};

export default SearchModal;
