'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/lib/i18n';
import en from '../locales/en.json';
import ta from '../locales/ta.json';

const LanguageContext = createContext();

const dictionaries = { en, ta };

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('healixai-lang') || 'en';
    setLanguage(stored);
    i18n.changeLanguage(stored);
  }, []);

  const switchLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem('healixai-lang', code);
    i18n.changeLanguage(code);
    if (typeof window !== 'undefined') {
      document.documentElement.lang = code;
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'ta' : 'en';
    switchLanguage(nextLang);
  };

  // Safe nested translation lookup
  const t = (path, fallback = '') => {
    const dict = dictionaries[language] || dictionaries.en;
    const keys = path.split('.');
    let result = dict;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        // Fallback to English if missing in Tamil
        let enResult = dictionaries.en;
        for (const k of keys) {
          if (enResult && typeof enResult === 'object' && k in enResult) {
            enResult = enResult[k];
          } else {
            return fallback || path;
          }
        }
        return typeof enResult === 'string' ? enResult : fallback || path;
      }
    }
    return typeof result === 'string' ? result : fallback || path;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        switchLanguage,
        toggleLanguage,
        t,
        isTamil: language === 'ta',
        mounted
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
