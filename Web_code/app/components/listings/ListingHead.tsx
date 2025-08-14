"use client";

import useCountries from "@/app/hooks/useCountry";
import { SafeUser } from "@/app/types";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface ListingHeadProps {
  title: string;
  locationValue: string;
  imageSrc: string[]; // مصفوفة صور الآن
  id: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  imageSrc,
  id,
  currentUser,
}) => {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);

  // تحويل الصور لتنسيق react-image-gallery
  const images = imageSrc.map((src) => ({
    original: src,
    thumbnail: src,
  }));

  return (
    <>
      <div className="mt-1 flex items-start justify-between">
        <Heading
          title={title}
          subtitle={`${location?.region}, ${location?.label}`}
        />

        <HeartButton
          listingId={id}
          currentUser={currentUser}
          label="Save to Favorites"
        ></HeartButton>
      </div>
      <div className="relative rounded-xl overflow-hidden">
        <ImageGallery
          items={images}
          showPlayButton={false}
          showFullscreenButton={true}
          thumbnailPosition="right"
          autoPlay={false}
          showBullets={true}
          additionalClass="h-[60vh]"
        />
      </div>
    </>
  );
};

export default ListingHead;
