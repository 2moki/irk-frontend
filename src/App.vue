<script setup lang="ts">
import { type Component, computed } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

const route = useRoute();

const layoutMap: Record<string, Component> = {
    main: MainLayout,
};

const activeLayout = computed(() => {
    const layoutName = route.meta.layout as string;
    return layoutMap[layoutName] || MainLayout;
});
</script>

<template>
    <component :is="activeLayout">
        <RouterView />
    </component>
</template>
