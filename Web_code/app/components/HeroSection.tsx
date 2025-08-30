"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Button from "./Button";
import useSearchModal from "../hooks/useSearchModal";
import useRentModal from "../hooks/useRentModal";

const HeroSection = () => {
  const { t } = useTranslation("common");
  const searchModal = useSearchModal();
  const rentmodal = useRentModal();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[90vh] min-h-[600px] bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out ${
          isLoaded ? "scale-110" : "scale-100"
        }`}
        style={{
          backgroundImage: "url('/images/TRIPLI.jpg')",
        }}
      ></div>

      {/* Content with Staggered Animations */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <h1
            className={`hero-title text-6xl md:text-5xl font-bold mb-6 leading-tight font-dubai transition-all duration-1000 ease-out transform drop-shadow-lg ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {t("hero.title")}
            <br />
            <span className="text-white drop-shadow-lg">
              {t("hero.subtitle")}
            </span>
          </h1>

          <p
            className={`hero-description text-1xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto font-dubai transition-all duration-1000 ease-out delay-300 transform drop-shadow-lg ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {t("hero.description")}
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center font-dubai transition-all duration-1000 ease-out delay-500 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <Button
              label={t("hero.search_button")}
              onClick={searchModal.onOpen}
              large
              className="bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105 transition-transform duration-200"
            />
            <Button
              label={t("hero.rent_button")}
              onClick={rentmodal.onOpen}
              outline
              large
              className="border-white text-rose-500 hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>

        {/* Scroll Indicator with Enhanced Animation */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-out delay-700 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center animate-bounce">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Floating Elements for Enhanced Visual Appeal */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-20 left-10 w-4 h-4 bg-white rounded-full opacity-20 transition-all duration-2000 ease-out delay-1000 ${
            isLoaded ? "animate-pulse" : ""
          }`}
        ></div>
        <div
          className={`absolute top-40 right-20 w-6 h-6 bg-white rounded-full opacity-30 transition-all duration-2000 ease-out delay-1200 ${
            isLoaded ? "animate-pulse" : ""
          }`}
        ></div>
        <div
          className={`absolute bottom-40 left-20 w-3 h-3 bg-white rounded-full opacity-25 transition-all duration-2000 ease-out delay-1400 ${
            isLoaded ? "animate-pulse" : ""
          }`}
        ></div>
      </div>
    </div>
  );
};

export default HeroSection;
