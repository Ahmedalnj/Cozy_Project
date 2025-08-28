"use client";

import { useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/locales/en/common.json";
import ar from "@/locales/locales/ar/common.json";

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("I18nProvider: Starting initialization...");
    console.log("I18nProvider: English translations:", en);
    console.log("I18nProvider: Arabic translations:", ar);

    // Simple initialization
    i18n
      .use(initReactI18next)
      .init({
        resources: {
          en: { common: en },
          ar: { common: ar },
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      })
      .then(() => {
        console.log("i18n initialized successfully");
        console.log(
          "Available languages:",
          Object.keys(i18n.options.resources ?? {})
        );
        console.log("Current language:", i18n.language);
        console.log(
          "English welcome:",
          i18n.t("welcome", { ns: "common", lng: "en" })
        );
        console.log(
          "Arabic welcome:",
          i18n.t("welcome", { ns: "common", lng: "ar" })
        );
        setIsInitialized(true);
      })
      .catch((error) => {
        console.error("i18n initialization failed:", error);
        setIsInitialized(true); // Still render children even if i18n fails
      });
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading translations...</div>
      </div>
    );
  }

  return <>{children}</>;
}
