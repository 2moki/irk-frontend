<script setup lang="ts">
import LanguageSelector from '@/components/features/LanguageSelector.vue';
import ThemeSwitcher from '@/components/features/ThemeSwitcher.vue';
import UniversityLogo from '@/components/ui/UniversityLogo.vue';
import AuthHero from '@/components/auth/AuthHero.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
</script>

<template>
    <div class="flex h-dvh">
        <div class="bg-uk-800 hidden w-full max-w-1/2 flex-col justify-between gap-6 p-8 lg:flex 2xl:max-w-1/3">
            <UniversityLogo link="/login" />

            <AuthHero />

            <AppFooter class="text-uk-300" />
        </div>
        <div class="relative flex w-full items-center justify-center">
            <div class="absolute top-0 left-0 p-8 lg:hidden">
                <UniversityLogo link="/login" :color-variant="true" />
            </div>

            <div class="absolute top-0 right-0 p-8">
                <ThemeSwitcher />
                <LanguageSelector />
            </div>

            <div class="w-full max-w-xl px-6">
                <RouterView />

                <AppFooter
                    class="absolute right-0 bottom-0 left-0 mb-8 flex items-center justify-center text-sm font-semibold uppercase lg:hidden"
                />
            </div>
        </div>
    </div>
</template>
