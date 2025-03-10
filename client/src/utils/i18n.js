import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import translationEN from '../locales/en/translation.json';
import translationES from '../locales/es/translation.json';

// Resources object with translations
const resources = {
    en: {
        translation: translationEN
    },
    es: {
        translation: translationES
    }
};

// Initialize i18next
i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        resources,
        fallbackLng: 'es', // Default language is Spanish
        debug: process.env.NODE_ENV === 'development', // Enable debug in development

        interpolation: {
            escapeValue: false, // React already safes from XSS
        },

        // Detection options
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'language',
            caches: ['localStorage'],
        },
    });

export default i18n; 
