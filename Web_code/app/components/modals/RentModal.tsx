"use client";

import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./modal";
import { useEffect, useMemo, useState } from "react";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import { offers } from "../offers";

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
      dynamic(() => import("../Map"), {
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
      toast.error("Category is required");
      return;
    }
    if (step === STEPS.OFFERS && Offers.length === 0) {
      toast("Select at least 1 offer!", {
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
      toast.error("Image is required");
      return;
    }
    if (step === STEPS.LOCATION && !location) {
      toast.error("Location is required");
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
        toast.success("Listing Created");
        router.refresh();
        reset();
        setLocalImages([]); // إعادة تعيين الصور المحلية بعد الإرسال
        setStep(STEPS.CATEGORY);
        rentmodal.onClose();
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const actionLabel = useMemo(() => {
    if (isLoading) {
      return step === STEPS.PRICE ? "Creating..." : "Loading...";
    }
    if (step === STEPS.PRICE) {
      return "Create";
    }
    return "NEXT";
  }, [step, isLoading]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
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
  if (step === STEPS.OFFERS) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Which of these best describes your place?"
          subtitle="Pick a category"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
          {offers.map((item) => (
            <CategoryInput
              key={item.label}
              onClick={(label) => {
                const selected = Offers;
                if (selected.includes(label)) {
                  // remove from list
                  setCustomValue(
                    "offers",
                    selected.filter((o: string) => o !== label)
                  );
                } else {
                  // add to list
                  setCustomValue("offers", [...selected, label]);
                }
              }}
              selected={Offers.includes(item.label)}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    );
  }
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where is your place located"
          subtitle="Help guests find you!"
        />
        <CountrySelect
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
          title="Share some basic about your place"
          subtitle="What amenities do you have?"
        />

        <Counter
          title="Guests"
          subtitle="How many guests do you allow?"
          value={guestCount}
          onChange={(value) => setCustomValue("guestCount", value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many Rooms do you have?"
          value={roomCount}
          onChange={(value) => setCustomValue("roomCount", value)}
        />
        <hr />
        <Counter
          title="Bathrooms"
          subtitle="How many Bathrooms do you have?"
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
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like"
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
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
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
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          formatPrice
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          validation={{
            min: {
              value: 1,
              message: "Price must be at least 1",
            },
          }}
        />
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
      title="Cozy Your Home"
      body={bodyContent}
    />
  );
};

export default RentModal;
