"use client";
import Container from "../Container";
import { TbBuilding, TbBuildingStore, TbHome, TbPool } from "react-icons/tb";
import {
  GiFamilyHouse,
  GiFarmTractor,
  GiForestCamp,
  GiIsland,
  GiPartyPopper,
} from "react-icons/gi";
import { MdOutlineVilla } from "react-icons/md";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
export const categories = [
  {
    label: "Apartments",
    icon: TbHome,
    description: "Daily or monthly rental apartments",
  },
  {
    label: "Villas",
    icon: MdOutlineVilla,
    description: "Luxury or family villas",
  },
  {
    label: "Traditional Houses",
    icon: GiFamilyHouse,
    description: "Traditional houses in local neighborhoods",
  },
  {
    label: "Farms",
    icon: GiFarmTractor,
    description: "Farms for rent with green spaces",
  },
  {
    label: "Event Halls",
    icon: GiPartyPopper,
    description: "Halls for weddings and events",
  },
  {
    label: "Resorts",
    icon: TbPool,
    description: "Resorts with pools or outdoor seating",
  },
  {
    label: "Chalets",
    icon: GiIsland,
    description: "Chalets by or near the sea",
  },
  {
    label: "Camps",
    icon: GiForestCamp,
    description: "Desert camps and safari trips",
  },
  {
    label: "Commercial Stores",
    icon: TbBuildingStore,
    description: "Stores for commercial rent",
  },
  {
    label: "Offices",
    icon: TbBuilding,
    description: "Administrative offices for rent",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const { t } = useTranslation("common"); // إضافة i18n
  const category = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname == "/";
  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={t(`categories.${item.label}.label`)}
            selected={category === item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
