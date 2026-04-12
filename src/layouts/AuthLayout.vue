<script setup lang="ts">
import LanguageSelector from '@/components/features/LanguageSelector.vue';
import ThemeSwitcher from '@/components/features/ThemeSwitcher.vue';
import UniversityLogo from '@/components/ui/UniversityLogo.vue';
import AuthHero from '@/components/auth/AuthHero.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
    <div class="flex h-dvh">
        <div class="bg-uk-800 hidden w-full max-w-1/2 flex-col justify-between gap-6 p-8 lg:flex 2xl:max-w-1/3">
            <UniversityLogo link="/login" />

            <AuthHero />

            <AppFooter class="text-uk-300" />
        </div>
        <div class="flex h-dvh w-full flex-col overflow-y-auto">
            <div class="flex shrink-0 items-center justify-between p-8">
                <div class="lg:hidden">
                    <UniversityLogo link="/login" :color-variant="true" />
                </div>
                <div class="ml-auto flex items-center gap-2">
                    <ThemeSwitcher />
                    <LanguageSelector />
                </div>
            </div>

            <div class="flex flex-1 flex-col items-center justify-center px-6 py-4">
                <div class="w-full" :class="route.meta?.authMaxWidth || 'max-w-xl'">
                    <RouterView />
                </div>
            </div>

            <AppFooter
                class="flex shrink-0 items-center justify-center pt-4 pb-8 text-sm font-semibold uppercase lg:hidden"
            />
        </div>
    </div>
</template>
