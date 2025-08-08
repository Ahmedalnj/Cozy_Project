"use client";
import Container from "../Container";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBoatFishing,
  GiCastle,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import { MdOutlineVilla } from "react-icons/md";
import CategoryBox from "../CategoryBox";
import { usePathname, useSearchParams } from "next/navigation";
import { FaSkiing } from "react-icons/fa";
export const categories = [
  {
    label: "Beach",
    icon: TbBeach,
    description: "xc",
  },
  {
    label: "windmills",
    icon: GiWindmill,
    description: "xc",
  },
  {
    label: "Countryside",
    icon: TbMountain,
    description: "xc",
  },
  {
    label: "Pools",
    icon: TbPool,
    description: "xc",
  },
  {
    label: "Islands",
    icon: GiIsland,
    description: "xc",
  },
  {
    label: "Modren",
    icon: MdOutlineVilla,
    description: "xc",
  },
  {
    label: "Lake",
    icon: GiBoatFishing,
    description: "xc",
  },
  {
    label: "Skiing",
    icon: FaSkiing,
    description: "xc",
  },
  {
    label: "Castles",
    icon: GiCastle,
    description: "xc",
  },
  {
    label: "Camping",
    icon: GiForestCamp,
    description: "xc",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname == "/";
  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
      pt-4
      flex 
      flex-row
      items-center
      justify-between
      overflow-x-auto
      "
      >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={category == item.label}
            icon={item.icon}
          ></CategoryBox>
        ))}
      </div>
    </Container>
  );
};

export default Categories;
