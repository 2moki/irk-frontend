<script setup lang="ts">
import { definePage } from 'vue-router/experimental';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue';
import UniversityHeader from '@/components/ui/UniversityHeader.vue';
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

    <AuthHeader :title="$t('auth.haveForgotPassword')" :subtitle="$t('auth.enterYourEmail')" :mobileVisibility="true" />

    <ForgotPasswordForm />

    <p class="flex justify-center">
        {{ $t('auth.rememberPassword') }}&nbsp;
        <RouterLink
            to="/login"
            class="text-uk-800 hover:text-uk-900 dark:text-uk-300 dark:hover:text-uk-400 font-semibold transition-colors"
        >
            {{ $t('auth.signIn') }}
        </RouterLink>
    </p>
</template>
