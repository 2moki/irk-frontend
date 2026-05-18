<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
    currentStep?: number;
    steps?: number;
    title: string;
    subtitle?: string;
}>();

const { t } = useI18n();
</script>

<template>
    <Card class="bg-uk-700 p-2 text-white md:p-4">
        <template #title>
            <Tag v-if="currentStep && steps" class="mb-3">
                {{ t('study_programs.step_indicator', { current: currentStep, steps: steps }) }}
            </Tag>
            <p class="text-3xl font-semibold md:text-4xl">
                {{ title }}
            </p>
        </template>
        <template #content>
            <p v-if="subtitle" class="text-uk-100 m-0 text-xl">
                {{ subtitle }}
            </p>
        </template>
    </Card>
</template>
