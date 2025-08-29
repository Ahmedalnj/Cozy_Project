"use client";

import { SafeListing, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ListingCard from "./listings/ListingCard";
import { FaStar } from "react-icons/fa";

interface FeaturedListingsProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const FeaturedListings = ({ listings, currentUser }: FeaturedListingsProps) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  // Get first 6 listings for featured section
  const featuredListings = listings.slice(0, 6);

  if (featuredListings.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaStar className="text-yellow-400 w-6 h-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t("featured_listings.title")}
            </h2>
            <FaStar className="text-yellow-400 w-6 h-6" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("featured_listings.description")}
          </p>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <div key={listing.id} className="relative">
              {/* Badge مميز */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                  <FaStar className="w-3 h-3" />
                  {t("featured_listings.featured_badge")}
                </div>
              </div>

              {/* إعادة استخدام ListingCard */}
              <ListingCard data={listing} currentUser={currentUser} />
            </div>
          ))}
        </div>

        {/* زر عرض المزيد */}
        {listings.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              {t("featured_listings.view_all_properties")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
