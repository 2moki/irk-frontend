import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import '@/assets/styles/app.css';

import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes';
import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import pl from '@/locales/pl.json';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const i18n = createI18n({
    legacy: false,
    locale: navigator.language,
    fallbackLocale: 'en',
    messages: { en, pl },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            // it has to be changed in case the dark mode is added
            darkModeSelector: false,
        },
    },
});

app.mount('#app');
