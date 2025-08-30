"use client";

import useCountries from "@/app/hooks/useCountry";
import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import Image from "next/image";
import { useCallback, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ListingHeadProps {
  title: string;
  locationValue?: string;
  imageSrc: string[];
  id: string;
  currentUser?: SafeUser | null;
  showLabel?: boolean;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue = "",
  imageSrc,
  id,
  currentUser,
  showLabel = true,
}) => {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleImageClick = useCallback((index: number) => {
    setPhotoIndex(index);
    setOpenLightbox(true);
  }, []);

  const renderImageGrid = () => {
    if (imageSrc.length === 0) return null;

    if (imageSrc.length === 1) {
      return (
        <div
          className="w-full h-[60vh] relative rounded-xl overflow-hidden cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <Image
            src={imageSrc[0]}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl overflow-hidden">
        {/* Main Image */}
        <div
          className={`relative group ${
            imageSrc.length > 2
              ? "sm:row-span-2 h-[60vh]"
              : "h-[30vh] sm:h-[60vh]"
          } cursor-pointer`}
          onClick={() => handleImageClick(0)}
        >
          <Image
            src={imageSrc[0]}
            alt={`${title} - Main`}
            fill
            className="object-cover group-hover:brightness-90 transition-transform duration-300"
            priority
          />
        </div>

        {/* Secondary Images */}
        {imageSrc.length > 1 && (
          <div className="grid grid-cols-2 gap-2">
            {imageSrc.slice(1, 5).map((img, index) => (
              <div
                key={index}
                className={`relative group h-[29vh] ${
                  imageSrc.length === 3 && index === 2 ? "col-span-2" : ""
                } cursor-pointer`}
                onClick={() => handleImageClick(index + 1)}
              >
                <Image
                  src={img}
                  alt={`${title} - ${index + 2}`}
                  fill
                  className="object-cover group-hover:brightness-90 transition-transform duration-300"
                />
                {index === 3 && imageSrc.length > 5 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                    +{imageSrc.length - 5}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={title}
          subtitle={showLabel ? `${location?.region}, ${location?.label}` : ""}
        />
        <HeartButton
          listingId={id}
          currentUser={currentUser}
          showLabel={true}
          label="Add to Favorites"
        />
      </div>

      {/* Grid عرض الصور باستخدام */}
      <div className="overflow-x-auto snap-x md:overflow-visible">
        {renderImageGrid()}
      </div>

      {/* Lightbox لعرض الصور بالحجم الكامل */}
      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        slides={imageSrc.map((src) => ({ src }))}
        index={photoIndex}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
};

export default ListingHead;
