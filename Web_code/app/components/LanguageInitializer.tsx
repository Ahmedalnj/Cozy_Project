"use client";

import { useEffect } from "react";
import i18n from "i18next";

export default function LanguageInitializer() {
  useEffect(() => {
    // Get saved language from localStorage
    const savedLanguage = localStorage.getItem("language") || localStorage.getItem("i18nextLng") || "en";
    
    // Set the language if it's different from current
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    // Set document attributes
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (savedLanguage === 'ar') {
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
  }, []);

  return null; // This component doesn't render anything
}


