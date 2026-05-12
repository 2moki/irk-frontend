<script setup lang="ts">
import LanguageSelector from '@/components/features/LanguageSelector.vue';
import ThemeSwitcher from '@/components/features/ThemeSwitcher.vue';
import { useAuthStore } from '@/stores/auth.ts';

const { user, logout } = useAuthStore();
</script>

<template>
    <div class="mt-auto">
        <div class="flex items-center justify-around gap-1 px-4 py-1">
            <LanguageSelector />
            <ThemeSwitcher />
        </div>

        <hr class="border-surface-200 dark:border-surface-700 mx-4 mb-4 border-0 border-t" />
        <div class="mx-4 mb-4 flex items-center justify-between">
            <RouterLink
                to="/profile"
                v-ripple
                class="text-surface-700 hover:bg-surface-100 dark:text-surface-0 dark:hover:bg-surface-800 p-ripple flex cursor-pointer items-center gap-2 rounded p-4 transition-colors duration-150"
            >
                <Avatar icon="pi pi-user" shape="circle" />
                <span class="font-bold">{{ user?.first_name }} {{ user?.last_name }}</span>
            </RouterLink>
            <Button icon="pi pi-sign-out" severity="danger" variant="text" rounded @click="logout" />
        </div>
    </div>
</template>
