'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from 'i18next';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Get language from localStorage or default to 'en'
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const changeLanguage = (lang: string) => {
    if (i18n && i18n.changeLanguage) {
      // Change the i18n language
      i18n.changeLanguage(lang);
      
      // Update localStorage
      localStorage.setItem('language', lang);
      
      // Update document attributes
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      
      // Update local state
      setCurrentLanguage(lang);
      
      // Force a re-render by dispatching a custom event
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    isRTL: currentLanguage === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
