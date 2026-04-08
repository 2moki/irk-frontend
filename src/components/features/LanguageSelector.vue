<script setup lang="ts">
import { computed, ref } from 'vue';
import { useLanguageStore } from '@/stores/language.ts';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const menu = ref();

const { availableLanguages, changeLanguage } = useLanguageStore();

const toggle = (event: Event) => {
    menu.value.toggle(event);
};

const items = computed(() => [
    {
        label: t('language.select'),
        items: availableLanguages.map((lang) => ({
            label: lang.label,
            command: () => changeLanguage(lang.code),
        })),
    },
]);
</script>

<template>
    <Button
        type="button"
        icon="pi pi-globe"
        @click="toggle"
        class="border-transparent bg-transparent text-black dark:text-white"
        aria-haspopup="true"
        aria-controls="overlay_menu"
    />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>
