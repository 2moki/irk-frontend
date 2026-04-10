<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    mobileVisibility: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div :class="['mb-8', { 'hidden lg:block': !mobileVisibility }]">
        <p class="mb-2 text-2xl font-medium sm:text-4xl">{{ title }}</p>
        <p class="mb-6 text-black/80 sm:text-lg dark:text-white/80">
            {{ subtitle }}
        </p>
    </div>
</template>
