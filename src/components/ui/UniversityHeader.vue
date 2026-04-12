<script setup lang="ts">
import UniversityIcon from '@/components/ui/UniversityIcon.vue';
</script>

<template>
    <div class="mb-6 flex flex-col items-center justify-center lg:hidden">
        <UniversityIcon :dark-mode="true" :big-size="true" />
        <p class="text-uk-800 dark:text-uk-300 mt-3 text-3xl font-semibold">{{ $t('universityName') }}</p>
        <p class="text-lg">{{ $t('systemName') }}</p>
    </div>

    <Divider class="mb-6 lg:hidden" />
</template>
