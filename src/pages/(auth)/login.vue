<script setup lang="ts">
import { definePage } from 'vue-router/experimental';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import UniversityHeader from '@/components/ui/UniversityHeader.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
import AuthHeader from '@/components/auth/AuthHeader.vue';

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
