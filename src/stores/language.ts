import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export const useLanguageStore = defineStore(
    'language',
    () => {
        const { locale } = useI18n({ useScope: 'global' });
        const currentLocale = ref<string>(navigator.language);

        const availableLanguages = [
            { label: 'English', code: 'en' },
            { label: 'Polski', code: 'pl' },
        ];

        const changeLanguage = (code: string) => {
            currentLocale.value = code;
        };

        watch(
            currentLocale,
            () => {
                locale.value = currentLocale.value;
            },
            { immediate: true },
        );

        return {
            currentLocale,
            availableLanguages,
            changeLanguage,
        };
    },
    {
        persist: {
            pick: ['currentLocale'],
        },
    },
);
