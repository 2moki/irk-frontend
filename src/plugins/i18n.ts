import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import pl from '@/locales/pl.json';

const messages = {
    pl: {
        ...pl,
        universityName: import.meta.env.VITE_UNIVERSITY_NAME_PL,
        universityFullName: import.meta.env.VITE_UNIVERSITY_FULL_NAME_PL,
    },
    en: {
        ...en,
        universityName: import.meta.env.VITE_UNIVERSITY_NAME_EN,
        universityFullName: import.meta.env.VITE_UNIVERSITY_FULL_NAME_EN,
    },
};

const i18n = createI18n({
    legacy: false,
    locale: navigator.language,
    fallbackLocale: 'en',
    messages,
});

export default i18n;
