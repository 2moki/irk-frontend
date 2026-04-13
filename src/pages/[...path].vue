<script setup lang="ts">
definePage({
    meta: {
        notFound: true,
        layout: 'empty',
    },
});
</script>

<template>
    <div class="">
        <p class="flex h-dvh items-center justify-center text-xl uppercase">404 | {{ $t('notFound') }}</p>
    </div>
</template>
