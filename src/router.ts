import { createRouter, createWebHistory } from 'vue-router';
import { handleHotUpdate, routes } from 'vue-router/auto-routes';
import { useAuthStore } from '@/stores/auth.ts';
import i18n from '@/plugins/i18n.ts';
import type { Composer } from 'vue-i18n';

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    const authStore = useAuthStore();
    const i18nGlobal = i18n.global as Composer;

    document.title = i18nGlobal.t('universityName');

    if (to.meta.notFound) return;

    if (to.meta.requiresGuest && authStore.isAuthenticated) {
        return '/';
    } else if (!to.meta.requiresGuest && !authStore.isAuthenticated) {
        authStore.redirectPath = to.fullPath;
        return '/login';
    }
});

if (import.meta.hot) {
    handleHotUpdate(router);
}
