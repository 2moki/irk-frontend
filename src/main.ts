import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import '@/assets/styles/app.css';
import '@fontsource-variable/inter/opsz.css';

import PrimeVue from 'primevue/config';
import Uk from '@/themes/uk.ts';
import { ToastService } from 'primevue';
import { router } from '@/router.ts';
import i18n from '@/plugins/i18n.ts';

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
