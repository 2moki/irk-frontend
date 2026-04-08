<script setup lang="ts">
import { useNow } from '@vueuse/core';

const now = useNow();
</script>

<template>
    <footer>Copyright &copy; {{ now.getFullYear() }} {{ $t('universityName') }}</footer>
</template>
