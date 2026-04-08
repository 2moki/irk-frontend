import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import '@/assets/styles/app.css';

import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import pl from '@/locales/pl.json';
import PrimeVue from 'primevue/config';
import Uk from '@/themes/uk.ts';
import { ToastService } from 'primevue';
import { router } from '@/router.ts';

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

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(PrimeVue, {
    theme: {
        preset: Uk,
        options: {
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue',
            },
            darkModeSelector: '.dark',
        },
    },
});
app.use(ToastService);

app.mount('#app');
