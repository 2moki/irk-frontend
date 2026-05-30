<script setup lang="ts">
import { type Component, computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useThemeStore } from '@/stores/theme.ts';
import { useLanguageStore } from '@/stores/language.ts';
import EmptyLayout from '@/layouts/EmptyLayout.vue';

import { axiosInstance } from '@/services/api/axiosInstance.ts';
import { useAuthStore } from '@/stores/auth.ts';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const toast = useToast();
const route = useRoute();
const authStore = useAuthStore();

const layoutMap: Record<string, Component> = {
    auth: AuthLayout,
    main: MainLayout,
    empty: EmptyLayout,
};

const activeLayout = computed(() => {
    const layoutName = route.meta.layout as string;
    return layoutMap[layoutName] || MainLayout;
});

useThemeStore();
useLanguageStore();

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 419)) {
            if (authStore.isAuthenticated) {
                authStore.clearAuth();
                toast.add({ severity: 'error', summary: t('auth.sessionExpired'), life: 3000 });
            }
        }
        return Promise.reject(error);
    },
);
</script>

<template>
    <Toast />

    <component :is="activeLayout">
        <RouterView />
    </component>
</template>
