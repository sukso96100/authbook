import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en-US",
        debug: true,
        detection: {
            order: ['navigator']
        },
        resources: {
            "en-US": {
                translation: {
                    "menu": {
                        "accounts" : "My Accounts",
                        "settings" : "Settings",
                        "about" : "About",
                        "logout" : "Logout"
                    }
                }
            },

            "ko-KR": {
                translation: {
                    "menu": {
                        "accounts" : "내 계정",
                        "settings" : "설정",
                        "about" : "정보",
                        "logout" : "로그아웃"
                    }
                }
            },

            interpolation: {
                escapeValue: false
            }
        }
    });

export default i18n;