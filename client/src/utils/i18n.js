import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import commonEN from '../locales/en/common.json';
import commonES from '../locales/es/common.json';
import recipesEN from '../locales/en/recipes.json';
import recipesES from '../locales/es/recipes.json';

// Resources object with translations for multiple namespaces
const resources = {
    en: {
        common: commonEN,
        recipes: recipesEN
    },
    es: {
        common: commonES,
        recipes: recipesES
    }
};

// Initialize i18next
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        // Specify namespaces to use
        ns: ['common', 'recipes'],
        defaultNS: 'common',

        interpolation: {
            escapeValue: false, // React already safes from XSS
        },

        // Detection options
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'language',
            caches: ['localStorage'],
        },

        // Additional useful settings
        saveMissing: true,
        missingKeyHandler: (lng, ns, key) => {
            console.warn(`Missing translation: ${ns}:${key}`);
        }
    });

export default i18n;
