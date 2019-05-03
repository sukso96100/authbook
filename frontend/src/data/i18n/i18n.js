import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources: {
            en: {
                translation: {
                    "menu.accounts" : "My Accounts",
                    "menu.settings" : "Settings",
                    "menu.about" : "About",
                    "menu.logout" : "Logout"
                }
            },
            lng: "en",
            fallbackLng: "en",
            debug: true,

            interpolation: {
                escapeValue: false
            }
        }
    });

export default i18n;