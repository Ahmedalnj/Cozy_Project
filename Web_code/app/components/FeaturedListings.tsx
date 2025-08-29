"use client";

import { SafeListing, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ListingCard from "./listings/ListingCard";
import { FaStar } from "react-icons/fa";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

interface FeaturedListingsProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const FeaturedListings = ({ listings, currentUser }: FeaturedListingsProps) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { elementRef: sectionRef, isVisible: isSectionVisible } = useScrollAnimation({
    threshold: 0.2,
    rootMargin: "-50px",
  });

  // Get first 6 listings for featured section
  const featuredListings = listings.slice(0, 6);

  if (featuredListings.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان مع Animation */}
        <div className={`text-center mb-12 transition-all duration-1000 ease-out transform ${
          isSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaStar className="text-yellow-400 w-6 h-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t("featured_listings.title")}
            </h2>
            <FaStar className="text-yellow-400 w-6 h-6 animate-pulse" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("featured_listings.description")}
          </p>
        </div>

        {/* الكروت مع Staggered Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing, index) => (
            <div 
              key={listing.id} 
              className={`relative transition-all duration-700 ease-out transform ${
                isSectionVisible 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-12 opacity-0 scale-95'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
            >
              {/* Badge مميز */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md animate-pulse">
                  <FaStar className="w-3 h-3" />
                  {t("featured_listings.featured_badge")}
                </div>
              </div>

              {/* إعادة استخدام ListingCard */}
              <ListingCard data={listing} currentUser={currentUser} />
            </div>
          ))}
        </div>

        {/* زر عرض المزيد مع Animation */}
        {listings.length > 6 && (
          <div className={`text-center mt-12 transition-all duration-1000 ease-out delay-500 transform ${
            isSectionVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
