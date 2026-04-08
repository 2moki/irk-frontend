import { createRouter, createWebHistory } from 'vue-router';
import { handleHotUpdate, routes } from 'vue-router/auto-routes';
import { useAuthStore } from '@/stores/auth.ts';

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

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
