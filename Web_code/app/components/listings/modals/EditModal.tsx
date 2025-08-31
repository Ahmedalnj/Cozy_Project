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
  const getCityByValue = useCallback((value: string) => {
    return getByValue(value);
  }, [getByValue]);

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
      imageSrc: "",
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
        imageSrc: listing.imageSrc || "",
        price: listing.price || 1,
        title: listing.title || "",
        description: listing.description || "",
      });
      setStep(STEPS.CATEGORY);
    }
  }, [editModal.isOpen, listing, reset, getCityByValue]);

  useEffect(() => {
    setValue("imageSrc", localImages, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [localImages, setValue]);

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
    if (step === STEPS.PRICE) {
      return t("update");
    }
    return "";
  }, [step, t]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return t("next");
  }, [step, t]);

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
        <Map center={location?.latlng || [32.8872, 13.191]} />
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
          subtitle={`How much do you charge ${t("per_night")}?`}
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
      title={t("edit_your_listing")}
      body={bodyContent}
    />
  );
};

export default EditModal;
