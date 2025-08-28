"use client";

import { useState, useEffect } from "react";
import i18n from "i18next";
import LanguageSwitcher from "./components/LanguageSwitcher";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingSlider from "./components/listings/ListingSlider";
import { SafeListing, SafeUser } from "./types";

interface HomeClientProps {
  listings: SafeListing[];
  currentUser: SafeUser | null;
}

export default function HomeClient({ listings, currentUser }: HomeClientProps) {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Get current language from i18n
    setCurrentLang(i18n.language);

    // Listen for language changes
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, []);

  const isArabic = currentLang === "ar";

  // Debug: Log available translations
  useEffect(() => {
    console.log("Current language:", currentLang);
    console.log("Available translations:", i18n.options.resources);
    console.log("Welcome translation:", i18n.t("welcome", { ns: "common" }));
    console.log(
      "Description translation:",
      i18n.t("description", { ns: "common" })
    );
    console.log("About translation:", i18n.t("about", { ns: "common" }));
  }, [currentLang]);

  if (listings.length === 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <div className="pt-26 pb-8">
        <ListingSlider listings={listings} currentUser={currentUser} />
      </div>
      <div dir={isArabic ? "rtl" : "ltr"} className="px-5">
        <LanguageSwitcher />
        <h1 className="text-3xl font-bold mb-4">
          {i18n.t("welcome", { ns: "common" })}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {i18n.t("description", { ns: "common" })}
        </p>
        {/* Let's test more translations */}
        <div className="space-y-2">
          <p>
            <strong>About:</strong> {i18n.t("about", { ns: "common" })}
          </p>
          <p>
            <strong>Search:</strong> {i18n.t("search", { ns: "common" })}
          </p>
          <p>
            <strong>Location:</strong> {i18n.t("location", { ns: "common" })}
          </p>
          <p>
            <strong>Price:</strong> {i18n.t("price", { ns: "common" })}
          </p>
        </div>
      </div>
    </Container>
  );
}
