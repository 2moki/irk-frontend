import { defineStore } from 'pinia';
import { useDark, useToggle } from '@vueuse/core';

export const useThemeStore = defineStore('theme', () => {
    const isDark = useDark();
    const toggleTheme = useToggle(isDark);

    return {
        isDark,
        toggleTheme,
    };
});
