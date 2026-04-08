<script setup lang="ts">
defineProps({
    darkMode: {
        type: Boolean,
        default: false,
    },
    bigSize: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div
        class="flex items-center justify-center rounded"
        :class="[darkMode ? 'bg-uk-800 text-white' : 'text-uk-800 bg-white', bigSize ? 'p-5' : 'p-3']"
    >
        <i class="pi pi-graduation-cap" :style="{ fontSize: (bigSize ? '2' : ' 1.4') + 'rem', fontWeight: 'bold' }"></i>
    </div>
</template>
