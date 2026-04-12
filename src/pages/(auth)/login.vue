<script setup lang="ts">
import { definePage } from 'vue-router/experimental';
import UniversityHeader from '@/components/ui/UniversityHeader.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import AuthHeader from '@/components/auth/AuthHeader.vue';

definePage({
    meta: {
        layout: 'auth',
        requiresGuest: true,
    },
});
</script>

<template>
    <UniversityHeader />

    <div>
        <AuthHeader :title="$t('greeting.welcomeBack')" :subtitle="$t('auth.signInToYourAccount')" />

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
</template>
