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
      return step === STEPS.PRICE ? "Creating Listing..." : "Loading...";
    }
    if (step === STEPS.PRICE) {
      return "🎉 Create Listing";
    }
    return "Continue →";
  }, [step, isLoading]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return "Back";
  }, [step]);

  // خطوات التقدم
  const steps = [
    { label: "Category", icon: FaHome, completed: !!category },
    { label: "Offers", icon: FaStar, completed: Offers.length > 0 },
    { label: "Location", icon: FaMapMarkerAlt, completed: !!location },
    {
      label: "Info",
      icon: FaInfoCircle,
      completed: guestCount > 0 && roomCount > 0 && bathroomCount > 0,
    },
    { label: "Images", icon: FaImage, completed: localImages.length > 0 },
    { label: "Description", icon: FaEdit, completed: false }, // سيتم التحقق من العنوان والوصف
    { label: "Price", icon: FaDollarSign, completed: false }, // سيتم التحقق من السعر
  ];

  // حساب النسبة المئوية للتقدم
  const progressPercentage = Math.round(((step + 1) / steps.length) * 100);

  // الحصول على عنوان الخطوة الحالية
  const getCurrentStepTitle = () => {
    const stepTitles = [
      "Choose Category",
      "Select Amenities",
      "Set Location",
      "Property Details",
      "Upload Photos",
      "Add Description",
      "Set Pricing",
    ];
    return stepTitles[step];
  };

  // مكون خطوات التقدم
  const StepIndicator = () => (
    <div className="mb-4">
      {/* شريط التقدم */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Progress</span>
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
    </div>
  );

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <Heading
          title="Which of these best describes your place?"
          subtitle="Pick a category"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh]  p-1">
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
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <Heading
            title="What amenities does your place offer?"
            subtitle="Select all that apply"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh]  p-1">
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
        {Offers.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-xs">
              <strong>Selected:</strong> {Offers.join(", ")}
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
            title="Where is your place located?"
            subtitle="Help guests find you!"
          />
        </div>
        <div className="bg-gray-50 rounded-b-sm p-4">
          <CountrySelect
            value={location}
            onChange={(value) => setCustomValue("location", value)}
          />
        </div>
        {location && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-xs">
              <strong>Selected location:</strong> {location.label},{" "}
              {location.region}
            </p>
          </div>
        )}
        <div className="bg-gray-50 rounded-lg p-2">
          <Map center={location?.latlng || [32.8872, 13.191]} />
        </div>
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <Heading
            title="Share some basics about your place"
            subtitle="Tell guests about your property's capacity?"
          />
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Counter
              title="Guests"
              subtitle="How many guests do you allow?"
              value={guestCount}
              onChange={(value) => setCustomValue("guestCount", value)}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Counter
              title="Rooms"
              subtitle="How many Rooms do you have?"
              value={roomCount}
              onChange={(value) => setCustomValue("roomCount", value)}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Counter
              title="Bathrooms"
              subtitle="How many Bathrooms do you have?"
              value={bathroomCount}
              onChange={(value) => setCustomValue("bathroomCount", value)}
            />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-xs">
            <strong>Property capacity:</strong> {guestCount} guests, {roomCount}{" "}
            rooms, {bathroomCount} bathrooms
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
            title="Add photos of your place"
            subtitle="Show guests what your place looks like"
          />
          <p className="text-gray-500 mt-1 text-sm">
            High-quality photos help attract more guests
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
              <strong>Uploaded:</strong> {localImages.length} photo
              {localImages.length !== 1 ? "s" : ""}
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
            title="How would you describe your place?"
            subtitle="Short and sweet works best!"
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Input
              id="title"
              label="Title"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Keep it short and catchy (e.g., "Cozy Beachfront Villa")
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <Input
              id="description"
              label="Description"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Describe what makes your place unique and special
            </p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-xs">
            💡 <strong>Tip:</strong> Be specific about amenities, location
            highlights, and what guests can expect
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
            title="Now, set your price"
            subtitle="How much do you charge per night?"
          />
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-xs">
            💡 <strong>Tip:</strong> Research similar properties in your area to
            set a competitive price
          </p>
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
              Create Your Listing
            </h2>
            <p className="text-gray-600 text-sm">
              Let's get your property ready for guests
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
