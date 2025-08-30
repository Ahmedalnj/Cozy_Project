"use client";
import useCountries from "@/app/hooks/useCountry";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("../Map"), {
  ssr: false,
});
interface ListingMapProps {
  locationValue: string;
  locationLabel: string;
}

const ListingMap: React.FC<ListingMapProps> = ({
  locationValue,
  locationLabel,
}) => {
  const { getByValue } = useCountries();
  const coordination = getByValue(locationValue)?.latlng;

  return (
    <div>
      <hr className="p-4" />
      <h2 className="text-2xl font-semibold mb-4">Where you’ll be</h2>
      <p className="text-neutral-600 mb-4">
        This listing is located at{" "}
        <span className="font-semibold">
          {locationLabel},{locationValue}
        </span>
        . You can find it on the map below.
      </p>
      <div className="w-full mt-6 h-80 md:h-96 rounded-xl overflow-hidden shadow-md">
        <Map center={coordination} />
      </div>
    </div>
  );
};

export default ListingMap;
