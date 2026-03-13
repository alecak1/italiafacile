import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import it from './locales/it.json';
import en from './locales/en.json';
import bg from './locales/bg.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { it: { translation: it }, en: { translation: en }, bg: { translation: bg } },
    fallbackLng: 'it',
    supportedLngs: ['it', 'en', 'bg'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

export default i18n;
