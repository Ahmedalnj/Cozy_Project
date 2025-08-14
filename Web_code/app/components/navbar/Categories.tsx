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
export const categories = [
  {
    label: "شقق",
    icon: TbHome,
    description: "شقق للإيجار اليومي أو الشهري",
  },
  {
    label: "فلل",
    icon: MdOutlineVilla,
    description: "فلل فاخرة أو عائلية",
  },
  {
    label: "بيوت شعبية",
    icon: GiFamilyHouse,
    description: "منازل تقليدية في الأحياء الشعبية",
  },
  {
    label: "مزارع",
    icon: GiFarmTractor,
    description: "مزارع للإيجار مع مساحات خضراء",
  },
  {
    label: "قاعات مناسبات",
    icon: GiPartyPopper,
    description: "قاعات للأعراس والمناسبات",
  },
  {
    label: "استراحات",
    icon: TbPool,
    description: "استراحات مع مسبح أو جلسات خارجية",
  },
  {
    label: "شاليهات",
    icon: GiIsland,
    description: "شاليهات على البحر أو قربه",
  },
  {
    label: "مخيمات",
    icon: GiForestCamp,
    description: "مخيمات صحراوية ورحلات سفاري",
  },
  {
    label: "محلات تجارية",
    icon: TbBuildingStore,
    description: "محلات للإيجار التجاري",
  },
  {
    label: "مكاتب",
    icon: TbBuilding,
    description: "مكاتب إدارية للإيجار",
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
