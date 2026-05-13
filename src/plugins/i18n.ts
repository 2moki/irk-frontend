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

const pluralRules = {
    pl: (choice: number, choicesLength: number) => {
        if (choice === 0) {
            return 0;
        }
        const teen = choice > 10 && choice < 20;
        const endsWithOne = choice % 10 === 1;
        if (!teen && endsWithOne) {
            return 1;
        }
        if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
            return 2;
        }
        return choicesLength < 4 ? 2 : 3;
    },
};

const i18n = createI18n({
    legacy: false,
    locale: navigator.language,
    fallbackLocale: 'en',
    messages,
    pluralRules,
});

export default i18n;
