"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

import ListingCard from "./ListingCard";
import { SafeListing, SafeUser } from "@/app/types";

interface ListingSliderProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
  className?: string;
  title?: string;
}

export default function ListingSlider({
  listings,
  currentUser,
  className = "",
  title = "عروض في ليبيا",
}: ListingSliderProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Header with title on right and arrows on left */}
      <div className="flex items-center justify-between mb-4">
        {/* Navigation Buttons (left side) */}
        <div className="flex gap-2">
          <button
            aria-label="previous"
            className="swiper-button-prev-custom !static !m-0 !h-8 !w-8 !min-h-8 !min-w-8 !bg-transparent !p-1 !rounded-full !border !border-gray-300 hover:!bg-gray-100 transition-colors flex items-center justify-center"
          >
            <HiOutlineChevronLeft className="w-4 h-4 text-black " />
          </button>
          <button
            aria-label="next"
            className="swiper-button-next-custom !static !m-0 !h-8 !w-8 !min-h-8 !min-w-8 !bg-transparent !p-1 !rounded-full !border !border-gray-300 hover:!bg-gray-100  transition-colors flex items-center justify-center"
          >
            <HiOutlineChevronRight className="w-4 h-4 text-black " />
          </button>
        </div>

        {/* Title (right side) */}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
          disabledClass: "swiper-button-disabled", // Optional: for disabled state styling
        }}
        spaceBetween={16}
        slidesPerView={1.2}
        breakpoints={{
          480: { slidesPerView: 1.5, spaceBetween: 20 },
          640: { slidesPerView: 2.3, spaceBetween: 20 },
          768: { slidesPerView: 2.5, spaceBetween: 24 },
          1024: { slidesPerView: 3.3, spaceBetween: 24 },
          1280: { slidesPerView: 4.3, spaceBetween: 28 },
          1536: { slidesPerView: 5.3, spaceBetween: 32 },
        }}
      >
        {listings.map((listing) => (
          <SwiperSlide key={listing.id}>
            <div className="px-1 pb-4 h-full">
              <ListingCard data={listing} currentUser={currentUser} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
