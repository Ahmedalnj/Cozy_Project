"use client";

import { IconType } from "react-icons";
import { useTranslation } from "react-i18next";

interface ListingClientProps {
  icon: IconType;
  label: string;
  description: string;
}

interface Offer {
  icon: IconType;
  label: string;
  description: string;
}

interface OffersClientProps {
  offers: Offer[];
}

// Component for a single category/offer
export const ListingCategory: React.FC<ListingClientProps> = ({
  icon: Icon,
  label,
}) => {
  const { t } = useTranslation("common");
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center gap-4">
        <Icon size={40} className="text-neutral-600" />
        <div className="flex flex-col">
          <div className="text-lg font-semibold">{t(`categories.${label}.label`)}</div>
          <div className="text-neutral-500 font-light">{t(`categories.${label}.description`)}</div>
        </div>
      </div>
    </div>
  );
};

// Component for an array of offers
export const ListingOffer: React.FC<OffersClientProps> = ({ offers }) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t("listing_offer.what_this_place_offers")}</h1>
      {/* Map through offers and render each one */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.map((offer) => {
          const Icon = offer.icon;
          return (
            <div
              key={offer.label}
              className="flex flex-row items-start gap-2 p-0.5"
            >
              <Icon size={25} className="text-primary-600 mt-1" />
              <div className="flex flex-col">
                <span className="font-semibold text-neutral-900">
                  {offer.label}
                </span>
                <span className="text-neutral-500 text-sm">
                  {offer.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
