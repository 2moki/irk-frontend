<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import ApplicationHeader from '@/components/application/ApplicationHeader.vue';
import LanguageOrderCard from '@/components/application/LanguageOrderCard.vue';
import { useApplicationLanguagesStore } from '@/stores/applicationLanguages';
import { useLoadingStore } from '@/stores/loading';

const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const languagesStore = useApplicationLanguagesStore();
const loadingStore = useLoadingStore();

const loadLanguages = loadingStore.withLoading(async () => {
    await languagesStore.fetchLanguages();
});

onMounted(() => {
    loadLanguages();
});

const validateAndProceed = () => {
    toast.add({
        severity: 'success',
        summary: t('language_selection.success'),
        detail: t('language_selection.proceeding'),
        life: 3000,
    });
};

const goBack = () => {
    router.push('/application/education');
};
</script>

<template>
    <div class="mx-auto space-y-12">
        <ApplicationHeader
            :current-step="6"
            :steps="10"
            :title="$t('language_selection.title')"
            :subtitle="$t('language_selection.subtitle')"
        />

        <div v-if="loadingStore.isLoading" class="flex items-center justify-center py-16">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
        </div>

        <Message v-else-if="languagesStore.selections.length === 0" severity="warn" class="w-full">
            {{ $t('language_selection.no_majors_selected') }}
        </Message>

        <div v-else class="space-y-8">
            <LanguageOrderCard
                v-for="(entry, index) in languagesStore.selections"
                :key="entry.recruitmentId"
                :entry="entry"
                :index="index"
            />

            <div class="flex items-center justify-between">
                <Button
                    :label="$t('stepperPagination.back')"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    outlined
                    class="rounded-lg px-6 py-3 font-bold"
                    @click="goBack"
                />
                <Button
                    :label="$t('stepperPagination.next')"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="rounded-lg px-10 py-3 text-lg font-bold shadow-lg"
                    @click="validateAndProceed"
                />
            </div>
        </div>
    </div>
</template>
