<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();

const titleParts = computed(() => {
    const fullText = t('auth.hero.title');
    const words = fullText.split(' ');

    const line3 = words.at(-1);
    const line2 = words.at(-2);

    const line1 = words.slice(0, -2).join(' ');

    return { line1, line2, line3 };
});
</script>

<template>
    <div class="max-w-xl space-y-6">
        <h1 class="flex flex-col text-5xl font-semibold break-normal text-white 2xl:text-6xl">
            <span>{{ titleParts.line1 }}</span>
            <span class="text-uk-300">{{ titleParts.line2 }}</span>
            <span>
                <span class="text-uk-300">{{ titleParts.line3 }}</span>
                <span class="text-white">.</span>
            </span>
        </h1>
        <p class="text-uk-300 text-lg">{{ $t('auth.hero.subtitle') }} {{ $t('universityFullName') }}.</p>
    </div>
</template>

<style scoped></style>
