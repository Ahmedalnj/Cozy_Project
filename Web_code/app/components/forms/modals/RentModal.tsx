"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "../../modals/base/modal";
import { useEffect, useMemo, useState } from "react";
import Heading from "../../ui/Heading";
import { categories } from "@/app/components/navigation/navbar/Categories";
import CategoryInput from "../../forms/inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CitySelect from "../../forms/inputs/CitySelect";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaCheck,
  FaHome,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaImage,
  FaEdit,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";

import Counter from "../../forms/inputs/Counter";
import ImageUpload from "../../forms/inputs/ImageUpload";
import Input from "../../ui/Input";
import { useOffers } from "../../features/offers";
import { useTranslation } from "react-i18next";

enum STEPS {
  CATEGORY = 0,
  OFFERS = 1,
  LOCATION = 2,
  INFO = 3,
  IMAGE = 4,
  DESCRIPTION = 5,
  PRICE = 6,
}

const RentModal = () => {
  const router = useRouter();
  const rentmodal = useRentModal();
  const offers = useOffers();
  const { t } = useTranslation("common");

  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  // State محلي لإدارة الصور
  const [localImages, setLocalImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: "",
      offers: [],
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: [],
      price: 1,
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const location = watch("location");
  const Offers = watch("offers");

  // مزامنة الصور المحلية مع form state
  useEffect(() => {
    setValue("imageSrc", localImages, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [localImages, setValue]);

  const roomCount = watch("roomCount");
  const bathroomCount = watch("bathroomCount");
  const guestCount = watch("guestCount");

  const Map = useMemo(
    () =>
      dynamic(() => import("../../features/Map"), {
        ssr: false,
      }),
    []
  );

  const setCustomValue = (id: string, value: unknown) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // أضف صورة جديدة
  const addImage = (newImg: string) => {
    setLocalImages((imgs) => [...imgs, newImg]);
  };

  // حذف صورة
  const removeImage = (img: string) => {
    setLocalImages((imgs) => imgs.filter((i) => i !== img));
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    if (step === STEPS.CATEGORY && !category) {
      toast.error(t("rent_modal.category_required"));
      return;
    }
    if (step === STEPS.OFFERS && Offers.length === 0) {
      toast(t("rent_modal.offers_required"), {
        icon: "ℹ️",
        style: {
          backgroundColor: "#fff",
          color: "#007bff",
          padding: "10px",
          borderRadius: "8px",
        },
        duration: 4000,
        position: "top-center",
      });
      return;
    }
    if (step === STEPS.IMAGE && localImages.length === 0) {
      toast.error(t("rent_modal.image_required"));
      return;
    }
    if (step === STEPS.LOCATION && !location) {
      toast.error(t("rent_modal.location_required"));
      return;
    }
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }

    setIsLoading(true);

    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success(t("rent_modal.listing_created"));
        router.refresh();
        reset();
        setLocalImages([]); // إعادة تعيين الصور المحلية بعد الإرسال
        setStep(STEPS.CATEGORY);
        rentmodal.onClose();
      })
      .catch(() => {
        toast.error(t("rent_modal.something_went_wrong"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (isLoading) {
      return step === STEPS.PRICE
        ? t("rent_modal.creating_listing")
        : t("rent_modal.loading");
    }
    if (step === STEPS.PRICE) {
      return t("rent_modal.create_listing_button");
    }
    return t("rent_modal.continue");
  }, [step, isLoading, t]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return t("rent_modal.back");
  }, [step, t]);

  // خطوات التقدم
  const steps = [
    {
      label: t("rent_modal.steps.category"),
      icon: FaHome,
      completed: !!category,
    },
    {
      label: t("rent_modal.steps.offers"),
      icon: FaStar,
      completed: Offers.length > 0,
    },
    {
      label: t("rent_modal.steps.location"),
      icon: FaMapMarkerAlt,
      completed: !!location,
    },
    {
      label: t("rent_modal.steps.info"),
      icon: FaInfoCircle,
      completed: guestCount > 0 && roomCount > 0 && bathroomCount > 0,
    },
    {
      label: t("rent_modal.steps.images"),
      icon: FaImage,
      completed: localImages.length > 0,
    },
    {
      label: t("rent_modal.steps.description"),
      icon: FaEdit,
      completed: false,
    }, // سيتم التحقق من العنوان والوصف
    {
      label: t("rent_modal.steps.price"),
      icon: FaDollarSign,
      completed: false,
    }, // سيتم التحقق من السعر
  ];

  // حساب النسبة المئوية للتقدم
  const progressPercentage = Math.round(((step + 1) / steps.length) * 100);

  // الحصول على عنوان الخطوة الحالية
  const getCurrentStepTitle = () => {
    const stepTitles = [
      t("rent_modal.category_title"),
      t("rent_modal.offers_title"),
      t("rent_modal.location_title"),
      t("rent_modal.info_title"),
      t("rent_modal.images_title"),
      t("rent_modal.description_title"),
      t("rent_modal.price_title"),
    ];
    return stepTitles[step];
  };

  // مكون خطوات التقدم
  const StepIndicator = () => (
    <div className="mb-4">
      {/* شريط التقدم */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">
            {t("rent_modal.progress")}
          </span>
          <span className="text-xs font-medium text-rose-500">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-rose-500 to-pink-500 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 overflow-x-auto">
        {steps.map((stepItem, index) => {
          const Icon = stepItem.icon;
          const isCurrentStep = index === step;
          const isCompleted = stepItem.completed;
          const isPast = index < step;

          return (
            <div key={index} className="flex flex-col items-center min-w-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrentStep
                    ? "bg-rose-500 text-white shadow-lg scale-110"
                    : isCompleted || isPast
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <FaCheck className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium transition-colors duration-300 text-center max-w-16 truncate ${
                  isCurrentStep
                    ? "text-rose-500"
                    : isCompleted || isPast
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
                title={stepItem.label}
              >
                {stepItem.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${
                    isCompleted || isPast ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <Heading
          title={t("rent_modal.category_title")}
          subtitle={t("rent_modal.category_subtitle")}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[40vh] p-1">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => setCustomValue("category", category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
      {category && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-xs">
            <strong>{t("rent_modal.selected_category")}</strong>{" "}
            {t(`categories.${category}.label`)}
          </p>
        </div>
      )}
    </div>
  );

  if (step === STEPS.OFFERS) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <Heading
            title={t("rent_modal.offers_title")}
            subtitle={t("rent_modal.offers_subtitle")}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[40vh] p-1">
          {offers.map((item) => (
            <CategoryInput
              key={item.englishLabel}
              onClick={() => {
                const selected = Offers;
                if (selected.includes(item.englishLabel)) {
                  // remove from list
                  setCustomValue(
                    "offers",
                    selected.filter((o: string) => o !== item.englishLabel)
                  );
                } else {
                  // add to list
                  setCustomValue("offers", [...selected, item.englishLabel]);
                }
              }}
              selected={Offers.includes(item.englishLabel)}
              label={t(`offers.${item.label}`)}
              icon={item.icon}
              type="offer"
            />
          ))}
        </div>
        {Offers.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-xs">
              <strong>{t("rent_modal.selected")}</strong> {Offers.join(", ")}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <Heading
            title={t("rent_modal.location_title")}
            subtitle={t("rent_modal.location_subtitle")}
          />
        </div>
        <div className="bg-gray-50 rounded-b-sm p-4">
          <CitySelect
            value={location}
            onChange={(value) => setCustomValue("location", value)}
          />
        </div>
        {location && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-xs">
              <strong>{t("rent_modal.selected_location")}</strong>{" "}
              {location.label}, {location.region}
            </p>
          </div>
        )}
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="w-full h-56 md:h-64">
            <Map center={location?.latlng || [32.8872, 13.191]} zoom={4} />
          </div>
        </div>
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <Heading
            title={t("rent_modal.info_title")}
            subtitle={t("rent_modal.info_subtitle")}
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Counter
              title={t("rent_modal.guests_title")}
              subtitle={t("rent_modal.guests_subtitle")}
              value={guestCount}
              onChange={(value) => setCustomValue("guestCount", value)}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Counter
              title={t("rent_modal.rooms_title")}
              subtitle={t("rent_modal.rooms_subtitle")}
              value={roomCount}
              onChange={(value) => setCustomValue("roomCount", value)}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Counter
              title={t("rent_modal.bathrooms_title")}
              subtitle={t("rent_modal.bathrooms_subtitle")}
              value={bathroomCount}
              onChange={(value) => setCustomValue("bathroomCount", value)}
            />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-xs">
            <strong>{t("rent_modal.property_capacity")}</strong> {guestCount}{" "}
            {t("rent_modal.guests")}, {roomCount} {t("rent_modal.rooms")},{" "}
            {bathroomCount} {t("rent_modal.bathrooms")}
          </p>
        </div>
      </div>
    );
  }

  if (step === STEPS.IMAGE) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <Heading
            title={t("rent_modal.images_title")}
            subtitle={t("rent_modal.images_subtitle")}
          />
          <p className="text-gray-500 mt-1 text-sm">
            {t("rent_modal.high_quality_photos")}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <ImageUpload
            images={localImages}
            addImage={addImage}
            removeImage={removeImage}
          />
        </div>
        {localImages.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-xs">
              <strong>{t("rent_modal.uploaded")}</strong> {localImages.length}{" "}
              {localImages.length !== 1
                ? t("rent_modal.photos")
                : t("rent_modal.photo")}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <Heading
            title={t("rent_modal.description_title")}
            subtitle={t("rent_modal.description_subtitle")}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Input
              id="title"
              label={t("rent_modal.title_label")}
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              validation={{
                required: t("validation.title_required"),
                minLength: {
                  value: 10,
                  message: t("validation.title_min_length"),
                },
                maxLength: {
                  value: 100,
                  message: t("validation.title_max_length"),
                },
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("rent_modal.title_placeholder")}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Input
              id="description"
              label={t("rent_modal.description_label")}
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              validation={{
                required: t("validation.description_required"),
                minLength: {
                  value: 20,
                  message: t("validation.description_min_length"),
                },
                maxLength: {
                  value: 500,
                  message: t("validation.description_max_length"),
                },
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("rent_modal.description_placeholder")}
            </p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-xs">
            <strong>{t("rent_modal.tip")}</strong>{" "}
            {t("rent_modal.tip_description")}
          </p>
        </div>
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <Heading
            title={t("rent_modal.price_title")}
            subtitle={t("rent_modal.price_subtitle")}
          />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <Input
            id="price"
            label={t("rent_modal.price_label")}
            formatPrice
            type="number"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            validation={{
              min: {
                value: 1,
                message: t("validation.price_min"),
              },
              max: {
                value: 10000,
                message: t("validation.price_max"),
              },
            }}
          />
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-xs">{t("rent_modal.tip_pricing")}</p>
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentmodal.isOpen}
      onClose={rentmodal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title={`${getCurrentStepTitle()} - Step ${step + 1} of ${steps.length}`}
      body={
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mb-3">
              <FaHome className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {t("rent_modal.create_listing_header")}
            </h2>
            <p className="text-gray-600 text-sm">
              {t("rent_modal.create_listing_subheader")}
            </p>
          </div>
          <StepIndicator />
          {bodyContent}
        </div>
      }
    />
  );
};

export default RentModal;
