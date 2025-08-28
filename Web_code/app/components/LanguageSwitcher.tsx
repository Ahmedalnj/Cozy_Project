"use client";

import { useState, useEffect } from "react";
import i18n from "i18next";
import { FaGlobe } from "react-icons/fa";

interface LanguageSwitcherProps {
  fullLabel?: boolean; // إذا كانت true، نعرض English / عربي
}

export default function LanguageSwitcher({
  fullLabel = false,
}: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    setCurrentLang(i18n.language);

    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng);
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lng;
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
    setCurrentLang(newLang);
  };

  return (
    <div
      onClick={toggleLanguage}
      className="flex items-center gap-2 cursor-pointer select-none rounded-full bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1"
    >
      {/* الكوكب الصغير */}
      <div className="flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded-full">
        <FaGlobe className="w-3 h-3" />
      </div>
      {/* النص أو الاختصار */}
      <span className="text-sm font-semibold text-gray-800">
        {fullLabel
          ? currentLang === "en"
            ? "English"
            : "عربي"
          : currentLang === "en"
          ? "EN"
          : "AR"}
      </span>
    </div>
  );
}
