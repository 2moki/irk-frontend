<script setup lang="ts">
import UniversityIcon from '@/components/ui/UniversityIcon.vue';

defineProps({
    link: {
        type: String,
        default: '/',
    },
    colorVariant: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <RouterLink :to="link" class="inline-flex items-center gap-3">
        <UniversityIcon :dark-mode="colorVariant" />
        <span
            class="text-uk-800 text-lg font-semibold"
            :class="['text-lg', 'font-semibold', colorVariant ? 'text-uk-800 dark:text-uk-300' : 'text-white']"
        >
            {{ $t('universityName') }}
        </span>
    </RouterLink>
</template>
