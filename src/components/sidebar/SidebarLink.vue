<script setup lang="ts">
defineProps({
    link: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <RouterLink
        :to="link"
        v-ripple
        exactActiveClass="bg-surface-100 dark:bg-surface-800"
        class="text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 p-ripple flex cursor-pointer items-center rounded p-4 transition-colors duration-150"
    >
        <i :class="'pi pi- mr-2' + icon"></i>
        <span class="font-medium">
            <slot />
        </span>
    </RouterLink>
</template>
