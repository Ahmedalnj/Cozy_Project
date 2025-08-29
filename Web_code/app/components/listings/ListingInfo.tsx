"use client";

import { SafeUser } from "@/app/types";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import { ListingCategory, ListingOffer } from "./ListingCategory";
import { FaUser, FaBed, FaBath } from "react-icons/fa";
import { useTranslation } from "react-i18next";

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
  offers?: {
    icon: IconType;
    label: string;
    description: string;
  }[];
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  offers,
}) => {
  const { t } = useTranslation("common");
  return (
    <div className="col-span-4 flex flex-col gap-6 md:gap-8">
      {/* معلومات المضيف */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex flex-row items-center gap-3">
          <Avatar src={user?.image} />
          <div className="text-lg md:text-xl font-semibold">
            {t("listing_info.hosted_by")} {user?.name}
          </div>
        </div>

        {/* معلومات الغرف والضيوف */}
        <div className="flex flex-wrap gap-3 text-sm md:text-base">
          <div className="flex items-center gap-1">
            <FaUser size={14} />
            <span className="font-medium text-neutral-800">{guestCount}</span>
            <span className="text-neutral-500 flex items-center gap-1">
              {t("listing_info.guests")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FaBed size={14} />
            <span className="font-medium text-neutral-800">{roomCount}</span>
            <span className="text-neutral-500">{t("listing_info.rooms")}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBath size={14} />
            <span className="font-medium text-neutral-800">
              {bathroomCount}
            </span>
            <span className="text-neutral-500">{t("listing_info.bathrooms")}</span>
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
      <hr className="my-2 md:my-4" />
      {/* العروض والمرافق */}
      {offers && offers.length > 0 && <ListingOffer offers={offers} />}

      {/* الوصف */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{t("listing_info.description")}</h3>
        <p className="text-neutral-500 text-sm md:text-base leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>

      <hr className="my-2 md:my-4" />
    </div>
  );
};

export default ListingInfo;
