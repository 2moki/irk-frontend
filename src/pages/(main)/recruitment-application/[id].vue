<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { axiosInstance } from '@/services/api/axiosInstance';
import { useLocalizedEnums } from '@/composables/useLocalizedEnums';
import { useStatusSeverity } from '@/composables/useStatusSeverity';
import { useLoadingStore } from '@/stores/loading';
import { useI18n } from 'vue-i18n';
import type { Major, RecruitmentApplication } from '@/types/recruitment';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const loadingStore = useLoadingStore();
const { t } = useI18n();
const { getLocalizedStatus, getLocalizedMajorField, getLocalizedExamType } = useLocalizedEnums();
const { getStatusSeverity } = useStatusSeverity();
const confirm = useConfirm();
const toast = useToast();

const application = ref<RecruitmentApplication | null>(null);
const major = ref<Major | null>(null);
const hasError = ref(false);

const academicYearLabel = computed(() => {
    const academicYear = application.value?.recruitment?.academic_year;

    if (!academicYear) return '';

    return `${academicYear.start_year}/${academicYear.start_year + 1}`;
});

const durationLabel = computed(() => {
    if (!major.value) return '';

    const semesters = major.value.semesters;

    return t('applicationDetail.semesters', { n: semesters });
});

const paymentLabel = computed(() => {
    if (!application.value) return '';

    return application.value.is_paid ? t('applicationDetail.paid') : t('applicationDetail.notPaid');
});

const documentsLabel = computed(() => {
    if (!application.value?.application) return '';

    return application.value.application.documents_delivered
        ? t('applicationDetail.delivered')
        : t('applicationDetail.notDelivered');
});

const loadApplication = async () => {
    const response = await axiosInstance.get<RecruitmentApplication>(
        `/api/v1/recruitment-applications/${(route.params as { id: string }).id}`,
        {
            params: {
                include: 'recruitment,application,recruitment.academicYear,languages',
            },
        },
    );

    application.value = response.data;
};

const loadMajor = async (majorId: number) => {
    const response = await axiosInstance.get<Major>(`/api/v1/majors/${majorId}`);

    major.value = response.data;
};

const withdrawApplication = () => {
    if (!application.value) return;

    confirm.require({
        message: 'Czy na pewno chcesz wycofać to zgłoszenie?',
        header: 'Potwierdzenie',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Tak',
        rejectLabel: 'Nie',

        accept: async () => {
            try {
                await axiosInstance.delete(`/api/v1/recruitment-applications/${application.value!.id}`);

                toast.add({
                    severity: 'success',
                    summary: 'Usunięto zgłoszenie',
                    life: 3000,
                });

                window.history.back();
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Błąd podczas usuwania',
                    life: 4000,
                });

                console.error(error);
            }
        },
    });
};

onMounted(async () => {
    loadingStore.startLoading();

    try {
        await loadApplication();

        if (application.value?.recruitment?.major_id) {
            await loadMajor(application.value.recruitment.major_id);
        }
    } catch (error) {
        console.error('Failed to load recruitment application details: ', error);
        hasError.value = true;
    } finally {
        loadingStore.stopLoading();
    }
});
</script>

<template>
    <div v-if="loadingStore.isLoading" class="flex flex-col gap-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-col gap-2">
                <Skeleton height="2.5rem" width="20rem" />
                <Skeleton height="1.25rem" width="14rem" />
            </div>
            <Skeleton height="2.5rem" width="12rem" />
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton v-for="i in 3" :key="i" height="6rem" />
        </div>
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton height="16rem" />
            <Skeleton height="16rem" />
        </div>
    </div>

    <div v-else-if="hasError">
        <Message severity="error" icon="pi pi-exclamation-circle">
            {{ t('applicationDetail.loadingError') }}
        </Message>
    </div>

    <div v-else-if="application" class="flex flex-col gap-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <div class="mb-2 flex flex-wrap items-center gap-3">
                    <h1 class="text-primary text-3xl font-bold tracking-tight md:text-4xl">
                        {{ major?.name }}
                    </h1>
                    <Tag
                        :severity="getStatusSeverity(application.application_status)"
                        :value="getLocalizedStatus(application.application_status)"
                        rounded
                    />
                </div>
                <p class="text-surface-500 dark:text-surface-400 text-sm">
                    {{ t('applicationDetail.applicationId', { id: application.id }) }}
                </p>
            </div>

            <Button
                :label="t('applicationDetail.withdrawApplication')"
                icon="pi pi-times-circle"
                severity="danger"
                variant="outlined"
                class="shrink-0"
                @click="withdrawApplication"
            />
        </div>

        <div class="grid gap-4 xl:grid-cols-3">
            <Card>
                <template #content>
                    <div class="flex items-center gap-4">
                        <div
                            class="bg-primary-100 dark:bg-primary-800 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                        >
                            <i class="pi pi-chart-bar text-xl" />
                        </div>
                        <div>
                            <p
                                class="text-surface-500 dark:text-surface-400 mb-1 text-xs font-medium tracking-wide uppercase"
                            >
                                {{ t('applicationDetail.points') }}
                            </p>
                            <p class="text-primary text-2xl font-bold">
                                {{ application.got_points }}
                                <span class="text-surface-500 dark:text-surface-400 text-base font-medium">
                                    / {{ application.recruitment?.max_points }}
                                </span>
                            </p>
                        </div>
                    </div>
                </template>
            </Card>

            <Card>
                <template #content>
                    <div class="flex items-center gap-4">
                        <div
                            :class="[
                                'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg',
                                application.is_paid
                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300',
                            ]"
                        >
                            <i class="pi pi-wallet text-xl" />
                        </div>
                        <div>
                            <p
                                class="text-surface-500 dark:text-surface-400 mb-1 text-xs font-medium tracking-wide uppercase"
                            >
                                {{ t('applicationDetail.payment') }}
                            </p>
                            <p class="text-primary text-2xl font-bold">
                                {{ paymentLabel }}
                                <span class="text-surface-500 dark:text-surface-400 text-base font-medium">
                                    {{ application.application?.required_balance }} PLN
                                </span>
                            </p>
                        </div>
                    </div>
                </template>
            </Card>

            <Card>
                <template #content>
                    <div class="flex items-center gap-4">
                        <div
                            :class="[
                                'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg',
                                application.application?.documents_delivered
                                    ? 'bg-uk-100 text-uk-800 dark:bg-uk-800 dark:text-uk-300'
                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-300',
                            ]"
                        >
                            <i class="pi pi-folder text-xl" />
                        </div>
                        <div>
                            <p
                                class="text-surface-500 dark:text-surface-400 mb-1 text-xs font-medium tracking-wide uppercase"
                            >
                                {{ t('applicationDetail.documents') }}
                            </p>
                            <p class="text-primary text-2xl font-bold">
                                {{ documentsLabel }}
                            </p>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <div class="grid gap-6 lg:grid-cols-2">
            <Card>
                <template #title>
                    <div class="border-surface-200 dark:border-surface-700 flex items-center gap-2">
                        <i class="pi pi-info-circle text-primary opacity-70" />
                        <span class="text-primary text-xl font-bold">
                            {{ t('applicationDetail.majorDetails') }}
                        </span>
                    </div>

                    <Divider />
                </template>

                <template #content>
                    <div class="grid grid-cols-2 gap-x-4 gap-y-6">
                        <div>
                            <p class="text-surface-500 dark:text-surface-400 mb-1 text-xs">
                                {{ t('applicationDetail.studyLevel') }}
                            </p>
                            <p class="text-sm font-medium">
                                {{ getLocalizedMajorField('studyLevel', major?.study_level) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-surface-500 dark:text-surface-400 mb-1 text-xs">
                                {{ t('applicationDetail.mode') }}
                            </p>
                            <p class="text-sm font-medium">
                                {{ getLocalizedMajorField('studyMode', major?.study_mode) }}
                            </p>
                        </div>
                        <div>
                            <p class="text-surface-500 dark:text-surface-400 mb-1 text-xs">
                                {{ t('applicationDetail.duration') }}
                            </p>
                            <p class="text-sm font-medium">
                                {{ durationLabel }}
                            </p>
                        </div>
                        <div>
                            <p class="text-surface-500 dark:text-surface-400 mb-1 text-xs">
                                {{ t('applicationDetail.academicYear') }}
                            </p>
                            <p class="text-sm font-medium">
                                {{ academicYearLabel }}
                            </p>
                        </div>
                    </div>

                    <div class="bg-surface-100 dark:bg-surface-800 mt-6 rounded-lg p-4">
                        <p class="text-surface-500 dark:text-surface-400 mb-1 text-xs">
                            {{ t('applicationDetail.examType') }}
                        </p>
                        <p class="flex items-center gap-2 text-sm font-medium">
                            <i class="pi pi-graduation-cap text-primary" />
                            {{ getLocalizedExamType(application.application?.exam_type) }}
                        </p>
                    </div>
                </template>
            </Card>

            <Card>
                <template #title>
                    <div class="border-surface-200 dark:border-surface-700 flex items-center gap-2">
                        <i class="pi pi-sliders-h text-primary opacity-70" />
                        <span class="text-primary text-xl font-bold">
                            {{ t('applicationDetail.preferences') }}
                        </span>
                    </div>

                    <Divider />
                </template>

                <template #content>
                    <div class="flex flex-col gap-6">
                        <div
                            class="bg-surface-100 dark:bg-surface-800 flex items-center justify-between rounded-lg p-4"
                        >
                            <div class="flex items-center gap-3">
                                <i class="pi pi-flag text-primary" />
                                <span class="text-sm font-medium">
                                    {{ t('applicationDetail.majorPriority') }}
                                </span>
                            </div>
                            <Badge :value="application.priority" />
                        </div>

                        <div v-if="application.languages && application.languages.length > 0">
                            <p class="text-surface-500 dark:text-surface-400 mb-4 text-sm font-medium">
                                {{ t('applicationDetail.selectedLanguages') }}
                            </p>
                            <div class="flex flex-col gap-3">
                                <div
                                    v-for="lang in application.languages"
                                    :key="lang.id"
                                    class="border-surface-200 dark:border-surface-700 flex items-center justify-between rounded-lg border p-3"
                                >
                                    <span class="text-sm">{{ lang.name }}</span>
                                    <Tag
                                        :value="t('applicationDetail.priority', { n: lang.priority })"
                                        severity="secondary"
                                        class="text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>
