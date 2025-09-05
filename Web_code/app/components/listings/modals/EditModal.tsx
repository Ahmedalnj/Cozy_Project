"use client";

import useEditModal from "@/app/hooks/useEditModal";
import Modal from "../../modals/base/modal";
import { useMemo, useState, useEffect, useCallback } from "react";
import Heading from "../../ui/Heading";
import { categories } from "@/app/components/navigation/navbar/Categories";
import CategoryInput from "../../forms/inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CitySelect from "../../forms/inputs/CitySelect";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Counter from "../../forms/inputs/Counter";
import ImageUpload from "../../forms/inputs/ImageUpload";
import Input from "../../ui/Input";
import { SafeListing } from "@/app/types";
import useCities from "../../../hooks/useCities";
import { useTranslation } from "react-i18next";
import {
  FaCheck,
  FaHome,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaImage,
  FaEdit,
  FaDollarSign,
} from "react-icons/fa";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGE = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const EditModal = () => {
  const router = useRouter();
  const editModal = useEditModal();
  const listing = editModal.listingData as SafeListing | null;

  const { t } = useTranslation("common");

  // State محلي لإدارة الصور
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);
  const { getByValue } = useCities();
  const getCityByValue = useCallback(
    (value: string) => {
      return getByValue(value);
    },
    [getByValue]
  );

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

  // تعبيئة الحقول عند فتح المودال مع بيانات العقار
  useEffect(() => {
    if (editModal.isOpen && listing) {
      reset({
        category: listing.category || "",
        location: listing.locationValue
          ? getCityByValue(listing.locationValue)
          : null,
        guestCount: listing.guestCount || 1,
        roomCount: listing.roomCount || 1,
        bathroomCount: listing.bathroomCount || 1,
        imageSrc: listing.imageSrc || [],
        price: listing.price || 1,
        title: listing.title || "",
        description: listing.description || "",
      });
      setLocalImages(listing.imageSrc || []);
      setStep(STEPS.CATEGORY);
    }
  }, [editModal.isOpen, listing, reset, getCityByValue]);

  // مزامنة الصور المحلية مع form state - فقط عند تغيير localImages
  useEffect(() => {
    if (localImages.length > 0 || editModal.isOpen) {
      setValue("imageSrc", localImages, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [localImages, setValue, editModal.isOpen]);

  const category = watch("category");
  const location = watch("location");
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
      toast.error(t("category_required"));
      return;
    }
    if (step === STEPS.IMAGE && localImages.length === 0) {
      toast.error(t("image_required"));
      return;
    }
    if (step === STEPS.LOCATION && !location) {
      toast.error(t("location_required"));
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
      .put(`/api/listings/${listing?.id}`, data)
      .then(() => {
        toast.success(t("listing_updated"));
        router.refresh();
        reset();
        setLocalImages([]);
        setStep(STEPS.CATEGORY);
        editModal.onClose();
      })
      .catch(() => {
        toast.error(t("something_went_wrong"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (isLoading) {
      return step === STEPS.PRICE
        ? t("rent_modal.updating_listing")
        : t("rent_modal.loading");
    }
    if (step === STEPS.PRICE) {
      return t("update");
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
    },
    {
      label: t("rent_modal.steps.price"),
      icon: FaDollarSign,
      completed: false,
    },
  ];

  // حساب النسبة المئوية للتقدم
  const progressPercentage = Math.round(((step + 1) / steps.length) * 100);

  // الحصول على عنوان الخطوة الحالية
  const getCurrentStepTitle = () => {
    const stepTitles = [
      t("rent_modal.category_title"),
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

      <div className="flex items-center justify-between ">
        {steps.map((stepItem, index) => {
          const Icon = stepItem.icon;
          const isCurrentStep = index === step;
          const isCompleted = stepItem.completed;
          const isPast = index < step;

          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrentStep
                      ? "bg-rose-500 text-white shadow-lg scale-110"
                      : isCompleted || isPast
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    <FaCheck className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                    isCurrentStep
                      ? "text-rose-500"
                      : isCompleted || isPast
                      ? "text-green-500"
                      : "text-gray-400"
                  }`}
                >
                  {stepItem.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-1 transition-colors duration-300 ${
                    isCompleted || isPast ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
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

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title={t("which_best_describes")}
        subtitle={t("pick_category")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
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
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("where_place_located")}
          subtitle={t("help_guests_find")}
        />
        <CitySelect
          value={location}
          onChange={(value) => setCustomValue("location", value)}
        />
        <div className="w-full h-56 md:h-64">
          <Map center={location?.latlng || [32.8872, 13.191]} zoom={4} />
        </div>
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("share_basic_about")}
          subtitle={t("what_amenities")}
        />
        <Counter
          title={t("guests")}
          subtitle={t("how_many_guests_allow")}
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter
          title={t("bedrooms")}
          subtitle={t("how_many_rooms")}
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title={t("bathrooms")}
          subtitle={t("how_many_bathrooms")}
          value={bathroomCount}
          onChange={(value) => setCustomValue("bathroomCount", value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("add_photo_place")}
          subtitle={t("show_guests_looks")}
        />
        <ImageUpload
          images={localImages}
          addImage={addImage}
          removeImage={removeImage}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("how_describe_place")}
          subtitle={t("short_sweet_works")}
        />
        <Input
          id="title"
          label={t("title")}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label={t("description")}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title={t("now_set_price")}
          subtitle={`How much do you charge ${t("LYD")} ${t("per_night")}?`}
        />
        <Input
          id="price"
          label={t("price")}
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          validation={{
            min: { value: 1, message: t("price_min_error") },
          }}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={editModal.isOpen}
      onClose={editModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      title={`${getCurrentStepTitle()} - Step ${step + 1} of ${steps.length}`}
      body={
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mb-3">
              <FaEdit className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {t("rent_modal.edit_listing_header")}
            </h2>
            <p className="text-gray-600 text-sm">
              {t("rent_modal.edit_listing_subtitle")}
            </p>
          </div>
          <StepIndicator />
          {bodyContent}
        </div>
      }
    />
  );
};

export default EditModal;
