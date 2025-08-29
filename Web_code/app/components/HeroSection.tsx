"use client";

import { useTranslation } from "react-i18next";
import Button from "./Button";
import useSearchModal from "../hooks/useSearchModal";
import useRentModal from "../hooks/useRentModal";

const HeroSection = () => {
  const { t } = useTranslation("common");
  const searchModal = useSearchModal();
  const rentmodal = useRentModal();

  return (
    <div className="relative h-[90vh] min-h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/TRIPLI.jpg')",
        }}
      >
        <div className="absolute inset-0 bg- bg-opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 leading-tight font-dubai">
            {t("hero.title")}
            <br />
            <span className="text-white">{t("hero.subtitle")}</span>
          </h1>

          <p className="hero-description text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto font-dubai">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-dubai">
            <Button
              label={t("hero.search_button")}
              onClick={searchModal.onOpen}
              large
              className="bg-white text-gray-900 hover:bg-gray-100"
            />
            <Button
              label={t("hero.rent_button")}
              onClick={rentmodal.onOpen}
              outline
              large
              className="border-white text-rose-500 hover:bg-white hover:text-gray-900"
            />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
