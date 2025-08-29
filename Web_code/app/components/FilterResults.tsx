"use client";

import { useSearchParams } from "next/navigation";
import { FaTimes, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface FilterResultsProps {
  totalResults: number;
}

const FilterResults = ({ totalResults }: FilterResultsProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation("common");

  const hasActiveFilters =
    params &&
    (params.get("locationValue") ||
      params.get("category") ||
      params.get("guestCount") ||
      params.get("roomCount") ||
      params.get("bathroomCount") ||
      params.get("minPrice") ||
      params.get("maxPrice") ||
      params.get("startDate") ||
      params.get("endDate"));

  const clearAllFilters = () => {
    router.push("/");
  };

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Results Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full shadow-lg">
              <FaSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {t("filter_results.title")}
              </h2>
              <p className="text-sm text-gray-600">
                {t("filter_results.found_properties", { count: totalResults })}
              </p>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaTimes className="w-4 h-4" />
            <span className="font-medium">{t("filter_results.clear_filters")}</span>
          </button>
        </div>

        {/* Active Filters */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {params.get("locationValue") && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {params.get("locationValue")}
                </span>
              </div>
            )}
            {params.get("category") && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {params.get("category")}
                </span>
              </div>
            )}
            {params.get("guestCount") && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-purple-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {params.get("guestCount")} {t("filter_results.guest_single")}
                </span>
              </div>
            )}
            {params.get("roomCount") && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-yellow-200">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {params.get("roomCount")} {t("filter_results.room_single")}
                </span>
              </div>
            )}
            {params.get("bathroomCount") && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-orange-200">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {params.get("bathroomCount")} {t("filter_results.bathroom_single")}
                </span>
              </div>
            )}
            {params.get("minPrice") && params.get("maxPrice") && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  ${params.get("minPrice")} - ${params.get("maxPrice")}
                </span>
              </div>
            )}
            {params.get("startDate") && params.get("endDate") && (
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-sm border border-indigo-200">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {t("filter_results.specific_dates")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterResults;
