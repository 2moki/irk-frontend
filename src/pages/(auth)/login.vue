<script setup lang="ts">
import { definePage } from 'vue-router/experimental';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import UniversityHeader from '@/components/ui/UniversityHeader.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

definePage({
    meta: {
        layout: 'auth',
        requiresGuest: true,
    },
});

const { t } = useI18n();

const value = computed(() => t('auth.login'));
const options = computed(() => [t('auth.login'), t('auth.register')]);
</script>

<template>
    <UniversityHeader />

    <div>
        <SelectButton class="mb-8" v-model="value" :options="options" fluid />

        <div class="mb-8 hidden lg:block">
            <p class="mb-2 text-2xl font-medium sm:text-4xl">{{ $t('greeting.welcomeBack') }}</p>
            <p class="mb-6 text-black/80 sm:text-lg dark:text-white/80">
                {{ $t('auth.signInToYourAccount') }}
            </p>
        </div>

        <LoginForm />
    </div>

    <p class="flex justify-center">
        {{ $t('auth.dontHaveAccount') }}&nbsp;
        <RouterLink
            to="/register"
            class="text-uk-800 hover:text-uk-900 dark:text-uk-300 dark:hover:text-uk-400 font-semibold transition-colors"
        >
            {{ $t('auth.signUp') }}
        </RouterLink>
    </p>

    <AppFooter
        class="absolute right-0 bottom-0 left-0 mb-8 flex items-center justify-center text-sm font-semibold uppercase lg:hidden"
    />
</template>
