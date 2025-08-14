"use client";

import useCountries from "@/app/hooks/useCountry";
import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";
import { FaUser, FaBed, FaBath } from "react-icons/fa";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category?: {
    icon: IconType;
    label: string;
    description: string;
  };
  locationValue: string;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
}) => {
  const { getByValue } = useCountries();
  const coordination = getByValue(locationValue)?.latlng;

  return (
    <div className="col-span-4 flex flex-col gap-6 md:gap-8">
      {/* معلومات المضيف */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-row items-center gap-3">
          <Avatar src={user?.image} />
          <div className="text-lg md:text-xl font-semibold">
            Hosted by {user?.name}
          </div>
        </div>

        {/* معلومات الغرف والضيوف */}
        <div className="flex flex-wrap gap-3 text-sm md:text-base">
          <div className="flex items-center gap-1">
            <FaUser size={14} />
            <span className="font-medium text-neutral-800">{guestCount}</span>
            <span className="text-neutral-500 flex items-center gap-1">
              guests
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaBed size={14} />
            <span className="font-medium text-neutral-800">{roomCount}</span>
            <span className="text-neutral-500">rooms</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBath size={14} />
            <span className="font-medium text-neutral-800">
              {bathroomCount}
            </span>
            <span className="text-neutral-500">bathrooms</span>
          </div>
        </div>
      </div>

      <hr className="my-2 md:my-4" />

      {/* الفئة */}
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}

      {/* الوصف */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Description</h3>
        <p className="text-neutral-500 text-sm md:text-base leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>

      <hr className="my-2 md:my-4" />

      {/* الخريطة */}
      <div className="hover:shadow-md transition-shadow duration-300 rounded-xl overflow-hidden">
        <Map center={coordination} />
      </div>
    </div>
  );
};

export default ListingInfo;
