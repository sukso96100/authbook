import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import i18nEnUS from './enUS';
import i18nKoKR from './koKR';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en-US',
        debug: true,
        detection: {
            order: ['navigator'],
        },
        resources: {
            'en-US': i18nEnUS,
            'ko-KR': i18nKoKR,

            'interpolation': {
                escapeValue: false,
            },
        },
    });

export default i18n;
