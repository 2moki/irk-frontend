<script setup lang="ts">
import UniversityHeader from '@/components/ui/UniversityHeader.vue';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue';
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

    <AuthHeader
        :title="$t('auth.setNewPassword')"
        :subtitle="$t('auth.enterNewPasswordMessage')"
        :mobileVisibility="true"
    />

    <ResetPasswordForm />
</template>
