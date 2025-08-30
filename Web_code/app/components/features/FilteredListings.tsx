"use client";

import { SafeListing, SafeUser } from "@/app/types";
import ListingCard from "../listings/cards/ListingCard";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface FilteredListingsProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const FilteredListings = ({ listings, currentUser }: FilteredListingsProps) => {
  const { t } = useTranslation("common");

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <FaSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t("filtered_listings.no_results_title")}
        </h3>
        <p className="text-gray-600">
          {t("filtered_listings.no_results_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {t("filtered_listings.title")}
        </h2>
        <p className="text-gray-600">
          {t("filtered_listings.found_count", { count: listings.length })}
        </p>
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            data={listing}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default FilteredListings;
