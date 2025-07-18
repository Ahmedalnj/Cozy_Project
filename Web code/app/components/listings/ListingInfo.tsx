"use client";

import useCountries from "@/app/hooks/useCountry";
import { SafeUser } from "@/app/types";

import { IconType } from "react-icons";
import Avatar from "../Avatar";

import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../Map"), {
  ssr: false,
});

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
  locationValue: string;
  // price: number;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
  // price
}) => {
  const { getByValue } = useCountries();

  const coordination = getByValue(locationValue)?.latlng;

  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
                        text-xl
                        font-semibold
                        flex
                        flex-row
                        items-center
                        gap-2
                    "
        >
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>
        <div
          className="
                    flex
                    flex-row
                    items-center
                    gap-4
                    font-light
                    text-neutral-500
                "
        >
          <div>
            <span className="font-semibold text-neutral-800">{guestCount}</span>{" "}
            guests
          </div>
          <div>
            <span className="font-semibold text-neutral-800">{roomCount}</span>{" "}
            rooms
          </div>
          <div>
            <span className="font-semibold text-neutral-800">
              {bathroomCount}
            </span>{" "}
            bathrooms
          </div>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}
      <div>Description</div>
      <div className="text-lg font-light text-neutral-500">{description}</div>
      <hr />
      <Map center={coordination} />
    </div>
  );
};

export default ListingInfo;
