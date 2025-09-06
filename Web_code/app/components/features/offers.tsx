"use client";

import { FaWifi, FaCar, FaTv, FaSnowflake } from "react-icons/fa";
import { MdKitchen, MdPool } from "react-icons/md";
import { useTranslation } from "react-i18next";

export const useOffers = () => {
  const { t } = useTranslation("common");

  const offers = [
    {
      label: "wifi",
      englishLabel: "Wi-Fi", // Keep English label for database matching
      icon: FaWifi,
      description: t("offers.wifi_description"),
      categories: [
        "Apartments",
        "Villas",
        "Family Houses",
        "Traditional Houses",
        "Hotel Apartments",
        "Studios",
        "Offices",
        "Beach Houses",
        "Resorts",
        "Chalets",
        "Farms",
        "Event Halls",
        "Commercial Stores",
        "Student Apartments",
        "Camps",
      ],
    },
    {
      label: "parking",
      englishLabel: "Parking",
      icon: FaCar,
      description: t("offers.parking_description"),
      categories: [
        "Apartments",
        "Villas",
        "Family Houses",
        "Traditional Houses",
        "Hotel Apartments",
        "Studios",
        "Offices",
        "Beach Houses",
        "Resorts",
        "Chalets",
        "Farms",
        "Event Halls",
        "Commercial Stores",
        "Student Apartments",
        "Camps",
      ],
    },
    {
      label: "tv",
      englishLabel: "TV",
      icon: FaTv,
      description: t("offers.tv_description"),
      categories: [
        "Apartments",
        "Villas",
        "Family Houses",
        "Traditional Houses",
        "Hotel Apartments",
        "Studios",
        "Offices",
        "Beach Houses",
        "Resorts",
        "Chalets",
        "Farms",
        "Event Halls",
        "Commercial Stores",
        "Student Apartments",
      ],
    },
    {
      label: "air_conditioning",
      englishLabel: "Air conditioning",
      icon: FaSnowflake,
      description: t("offers.air_conditioning_description"),
      categories: [
        "Apartments",
        "Villas",
        "Family Houses",
        "Traditional Houses",
        "Hotel Apartments",
        "Studios",
        "Offices",
        "Beach Houses",
        "Resorts",
        "Chalets",
        "Farms",
        "Event Halls",
        "Commercial Stores",
        "Student Apartments",
        "Camps",
      ],
    },
    {
      label: "kitchen",
      englishLabel: "Kitchen",
      icon: MdKitchen,
      description: t("offers.kitchen_description"),
      categories: [
        "Apartments",
        "Villas",
        "Family Houses",
        "Traditional Houses",
        "Hotel Apartments",
        "Studios",
        "Beach Houses",
        "Chalets",
        "Farms",
        "Student Apartments",
      ],
    },
    {
      label: "swimming_pool",
      englishLabel: "Swimming Pool",
      icon: MdPool,
      description: t("offers.swimming_pool_description"),
      categories: ["Resorts", "Villas", "Chalets", "Farms", "Beach Houses"],
    },
  ];

  return offers;
};

// Keep the original export for backward compatibility
export const offers = [
  {
    label: "Wi-Fi",
    icon: FaWifi,
    description: "Free wireless internet",
  },
  {
    label: "Parking",
    icon: FaCar,
    description: "Free parking space",
  },
  {
    label: "TV",
    icon: FaTv,
    description: "Flat screen television",
  },
  {
    label: "Air conditioning",
    icon: FaSnowflake,
    description: "Cooling system available",
  },
  {
    label: "Kitchen",
    icon: MdKitchen,
    description: "Equipped kitchen",
  },
  {
    label: "Swimming Pool",
    icon: MdPool,
    description: "Outdoor or indoor pool",
  },
];
