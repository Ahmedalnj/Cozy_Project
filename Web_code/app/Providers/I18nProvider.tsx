"use client";

import { useEffect, useState } from "react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/locales/en/common.json";
import ar from "@/locales/locales/ar/common.json";
import Loader from "@/app/components/Loader";

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("I18nProvider: Starting initialization...");
    console.log("I18nProvider: English translations:", en);
    console.log("I18nProvider: Arabic translations:", ar);

    // Get saved language from localStorage or default to 'en'
    const savedLanguage = typeof window !== 'undefined' 
      ? localStorage.getItem('language') || localStorage.getItem('i18nextLng') || 'en'
      : 'en';

    console.log("I18nProvider: Saved language from localStorage:", savedLanguage);

    // Simple initialization
    i18n
      .use(initReactI18next)
      .init({
        resources: {
          en: { common: en },
          ar: { common: ar },
        },
        lng: savedLanguage, // Use saved language instead of hardcoded 'en'
        fallbackLng: "en",
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        // Add persistence settings
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
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
        
        // Set the language direction based on the current language
        if (typeof window !== 'undefined') {
          const htmlElement = document.documentElement;
          const bodyElement = document.body;
          
          if (i18n.language === 'ar') {
            htmlElement.setAttribute('dir', 'rtl');
            htmlElement.setAttribute('lang', 'ar');
            bodyElement.setAttribute('dir', 'rtl');
            bodyElement.setAttribute('lang', 'ar');
          } else {
            htmlElement.setAttribute('dir', 'ltr');
            htmlElement.setAttribute('lang', 'en');
            bodyElement.setAttribute('dir', 'ltr');
            bodyElement.setAttribute('lang', 'en');
          }
        }

        // Listen for language changes and save to localStorage
        i18n.on('languageChanged', (lng) => {
          localStorage.setItem('language', lng);
          localStorage.setItem('i18nextLng', lng);
          
          // Update document attributes
          if (typeof window !== 'undefined') {
            const htmlElement = document.documentElement;
            const bodyElement = document.body;
            
            if (lng === 'ar') {
              htmlElement.setAttribute('dir', 'rtl');
              htmlElement.setAttribute('lang', 'ar');
              bodyElement.setAttribute('dir', 'rtl');
              bodyElement.setAttribute('lang', 'ar');
            } else {
              htmlElement.setAttribute('dir', 'ltr');
              htmlElement.setAttribute('lang', 'en');
              bodyElement.setAttribute('dir', 'ltr');
              bodyElement.setAttribute('lang', 'en');
            }
          }
        });
        
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
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
