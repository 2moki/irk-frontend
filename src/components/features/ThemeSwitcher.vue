<script setup lang="ts">
import { useThemeStore } from '@/stores/theme.ts';

const themeStore = useThemeStore();
</script>

<template>
    <Button
        type="button"
        :icon="'pi ' + (themeStore.isDark ? 'pi-moon' : 'pi-sun')"
        @click="themeStore.toggleTheme()"
        class="border-transparent bg-transparent text-black dark:text-white"
    />
</template>
