"use client";
import useCities from "@/app/hooks/useCities";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const Map = dynamic(() => import("../../features/Map"), {
  ssr: false,
});
interface ListingMapProps {
  locationValue: string;
}

const ListingMap: React.FC<ListingMapProps> = ({ locationValue }) => {
  const { t, i18n } = useTranslation("common");
  const { getByValue } = useCities();
  const location = getByValue(locationValue);
  const coordination = location?.latlng as [number, number] | undefined;

  return (
    <div>
      <hr className="p-4" />
      <h2 className="text-2xl font-semibold mb-4">
        {t("listing_map.where_youll_be")}
      </h2>
      <p className="text-neutral-600 mb-4">
        {t("listing_map.listing_located_at")}{" "}
        <span className="font-semibold">
          {location
            ? i18n.language === "ar"
              ? location.label
              : location.labelEn
            : locationValue}
        </span>
        . {t("listing_map.find_on_map")}
      </p>
      <div className="w-full mt-6 h-80 md:h-96 rounded-xl overflow-hidden shadow-md">
        <Map center={coordination} />
      </div>
    </div>
  );
};

export default ListingMap;
