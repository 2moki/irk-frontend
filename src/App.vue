<script setup lang="ts">
import { type Component, computed } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useThemeStore } from '@/stores/theme.ts';
import { useLanguageStore } from '@/stores/language.ts';
import EmptyLayout from '@/layouts/EmptyLayout.vue';

const route = useRoute();

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
</script>

<template>
    <Toast />

    <component :is="activeLayout">
        <RouterView />
    </component>
</template>
