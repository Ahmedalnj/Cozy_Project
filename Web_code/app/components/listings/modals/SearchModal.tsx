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
import { useTranslation } from "react-i18next";
import { categories } from "@/app/components/navigation/navbar/Categories";
import CategoryInput from "../../forms/inputs/CategoryInput";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  DATE = 2,
  INFO = 3,
  PRICE = 4,
}

const SearchModal = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();

  const [location, setLocation] = useState<CitySelectValue>();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [category, setCategory] = useState<string>("");
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
      category?: string;
      guestCount?: number;
      roomCount?: number;
      bathroomCount?: number;
      minPrice?: number;
      maxPrice?: number;
      startDate?: string;
      endDate?: string;
      [key: string]: string | number | undefined; // للخصائص الأخرى من currentQuery
    }

    const updateQuery: SearchQuery = {
      ...currentQuery,
      locationValue: location?.value,
      category: category || undefined,
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

    setStep(STEPS.CATEGORY);
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
      return t("search");
    }
    return t("next");
  }, [step, t]);

  const secondaryActionLabel = useMemo(() => {
    if (step == STEPS.CATEGORY) {
      return undefined;
    }
    return t("back");
  }, [step, t]);

  let bodyContent = (
    <div className="flex flex-col gap-3 max-w-full">
      <Heading
        title={t("search_modal.category_step.title", {
          defaultValue: "اختر الفئة",
        })}
        subtitle={t("search_modal.category_step.subtitle", {
          defaultValue: "حدد الفئة لتضييق نتائج البحث",
        })}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[40vh] p-1">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(val) => setCategory(val)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step == STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-3 max-w-full">
        <Heading
          title={t("search_modal.location_step.title")}
          subtitle={t("search_modal.location_step.subtitle")}
        />
        <CitySelect
          value={location}
          onChange={(value) => setLocation(value as CitySelectValue)}
        />
        <hr />
        <div className="w-full max-w-full h-56 md:h-64">
          <Map
            center={
              (location?.latlng && location.latlng.length === 2
                ? [location.latlng[0], location.latlng[1]]
                : [32.8872, 13.191]) as [number, number]
            }
            zoom={4}
          />
        </div>
      </div>
    );
  }

  if (step == STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-3 max-w-full">
        <Heading
          title={t("search_modal.date_step.title")}
          subtitle={t("search_modal.date_step.subtitle")}
        />
        <div className="w-full max-w-full">
          <Calendar
            value={dateRange}
            onChange={(value) => setDateRAnge(value.selection)}
          />
        </div>
      </div>
    );
  }

  if (step == STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-3 max-w-full">
        <Heading
          title={t("search_modal.info_step.title")}
          subtitle={t("search_modal.info_step.subtitle")}
        />
        <Counter
          title={t("search_modal.info_step.guests")}
          subtitle={t("search_modal.info_step.guests_subtitle")}
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        />
        <Counter
          title={t("search_modal.info_step.rooms")}
          subtitle={t("search_modal.info_step.rooms_subtitle")}
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        />
        <Counter
          title={t("search_modal.info_step.bathrooms")}
          subtitle={t("search_modal.info_step.bathrooms_subtitle")}
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        />
      </div>
    );
  }

  if (step == STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-3 max-w-full">
        <Heading
          title={t("search_modal.price_step.title")}
          subtitle={t("search_modal.price_step.subtitle")}
        />
        <div className="w-full max-w-full">
          <PriceRange
            minPrice={minPrice}
            maxPrice={maxPrice}
            onChange={(min, max) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title={t("search_modal.title")}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step == STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
    ></Modal>
  );
};

export default SearchModal;
