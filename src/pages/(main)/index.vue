<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts';

const { isAuthenticated, user, logout } = useAuthStore();
</script>

<template>
    <h1 v-if="!isAuthenticated">{{ $t('helloWorld') }}</h1>
    <div v-else>
        <h1>{{ $t('greeting.welcomeBack') }}, {{ user?.first_name }} {{ user?.middle_name }} {{ user?.last_name }}</h1>
        <Button :label="$t('auth.logout')" @click="logout"></Button>
    </div>
</template>
