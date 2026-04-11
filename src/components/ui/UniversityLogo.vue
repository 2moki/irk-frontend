<script setup lang="ts">
import UniversityIcon from '@/components/ui/UniversityIcon.vue';

defineProps({
    link: {
        type: String,
        default: '/',
    },
});
</script>

<template>
    <RouterLink :to="link" class="inline-flex items-center gap-3">
        <UniversityIcon />
        <span class="text-lg font-semibold text-white">{{ $t('universityName') }}</span>
    </RouterLink>
</template>
