"use client";

import { FaWifi, FaCar, FaTv, FaSnowflake } from "react-icons/fa";
import { MdKitchen, MdPool } from "react-icons/md";

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
