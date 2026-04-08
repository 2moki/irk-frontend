<script setup lang="ts">
import UniversityIcon from '@/components/ui/UniversityIcon.vue';
</script>

<template>
    <div class="flex items-center gap-3">
        <UniversityIcon />
        <span class="text-lg font-semibold text-white">{{ $t('universityName') }}</span>
    </div>
</template>
