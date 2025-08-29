"use client";
import { useEffect, useState } from "react";
import Container from "../Container";
import { TbBuilding, TbBuildingStore, TbHome, TbPool, TbBeach } from "react-icons/tb";
import {
  GiFamilyHouse,
  GiFarmTractor,
  GiForestCamp,
  GiIsland,
  GiPartyPopper,
  GiHouse,
  GiGraduateCap,
} from "react-icons/gi";
import { MdOutlineVilla, MdHotel, MdApartment } from "react-icons/md";
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
  {
    label: "Hotel Apartments",
    icon: MdHotel,
    description: "Luxury hotel-style apartments with full services",
  },
  {
    label: "Beach Houses",
    icon: TbBeach,
    description: "Houses located directly on the beach",
  },
  {
    label: "Studios",
    icon: MdApartment,
    description: "Compact single-room apartments",
  },
  {
    label: "Family Houses",
    icon: GiHouse,
    description: "Large houses suitable for families",
  },
  {
    label: "Student Apartments",
    icon: GiGraduateCap,
    description: "Affordable apartments for students",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const { t } = useTranslation("common");
  const category = params?.get("category");
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const isMainPage = pathname == "/";
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // إخفاء عند التمرير للأسفل بعد 150px، إظهار عند التمرير للأعلى
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  if (!isMainPage) {
    return null;
  }

  return (
    <div className={`transition-all duration-500 ease-in-out transform ${
      isVisible ? 'translate-y-0 opacity-100 max-h-32' : '-translate-y-full opacity-0 max-h-0'
    } overflow-hidden`}>
      <Container>
        <div className="pt-4 flex flex-row items-center justify-between">
          {categories.map((item) => (
            <CategoryBox
              key={item.label}
              label={t(`categories.${item.label}.label`)}
              selected={category === item.label}
              icon={item.icon}
              value={item.label}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
