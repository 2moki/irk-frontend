<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.ts';
import { axiosInstance } from '@/services/api/axiosInstance.ts';
import type { Major, RecruitmentApplication } from '@/types/recruitment.ts';
import type { PaginatedResponse, PaginationEvent, PaginationState } from '@/types/pagination.ts';
import ApplicationHeader from '@/components/application/ApplicationHeader.vue';
import { useLocalizedEnums } from '@/composables/useLocalizedEnums';
import { useToast } from 'primevue/usetoast';
import { useLoadingStore } from '@/stores/loading';
import { useI18n } from 'vue-i18n';

const { user } = useAuthStore();
const { getLocalizedStatus, getLocalizedMajorField } = useLocalizedEnums();

const toast = useToast();
const loadingStore = useLoadingStore();
const { t } = useI18n();

const activeApplications = ref<RecruitmentApplication[]>([]);
const completedApplications = ref<RecruitmentApplication[]>([]);
const majors = ref<Major[]>([]);
const totalActiveApplications = ref(0);
const totalCompletedApplications = ref(0);
const activePaginationParams = ref<PaginationState>({
    page: 1,
    rows: 5,
});
const completedPaginationParams = ref<PaginationState>({
    page: 1,
    rows: 5,
});
const isActiveLoading = ref(false);
const isCompletedLoading = ref(false);
const universityEmail = import.meta.env.VITE_CONTACT_EMAIL;

const mapApplicationsWithMajors = (apps: RecruitmentApplication[], majorsList: Major[]) => {
    return apps.map((app) => ({
        ...app,
        major: majorsList.find((m) => m.id === app.recruitment?.major_id),
    }));
};

const loadMajors = async () => {
    if (majors.value.length === 0) {
        const majorsRes = await axiosInstance.get<{ data: Major[] } | Major[]>('/api/v1/majors');
        majors.value = Array.isArray(majorsRes.data) ? majorsRes.data : majorsRes.data.data;
    }
};

const loadActiveApplications = async () => {
    isActiveLoading.value = true;
    try {
        const activeRes = await axiosInstance.get<PaginatedResponse<RecruitmentApplication>>(
            '/api/v1/recruitment-applications',
            {
                params: {
                    include: 'recruitment,recruitment.academicYear',
                    sort: 'application_status',
                    'filter[application_status]': 'pending,reserve',
                    page: activePaginationParams.value.page,
                    per_page: activePaginationParams.value.rows,
                },
            },
        );
        activeApplications.value = mapApplicationsWithMajors(activeRes.data.data, majors.value);
        totalActiveApplications.value = activeRes.data.meta?.total || 0;
    } finally {
        isActiveLoading.value = false;
    }
};

const loadCompletedApplications = async () => {
    isCompletedLoading.value = true;
    try {
        const completedRes = await axiosInstance.get<PaginatedResponse<RecruitmentApplication>>(
            '/api/v1/recruitment-applications',
            {
                params: {
                    include: 'recruitment,recruitment.academicYear',
                    sort: 'application_status',
                    'filter[application_status]': 'qualified,unqualified',
                    page: completedPaginationParams.value.page,
                    per_page: completedPaginationParams.value.rows,
                },
            },
        );
        completedApplications.value = mapApplicationsWithMajors(completedRes.data.data, majors.value);
        totalCompletedApplications.value = completedRes.data.meta?.total || 0;
    } finally {
        isCompletedLoading.value = false;
    }
};

const loadDashboardData = async () => {
    loadingStore.startLoading();
    try {
        await loadMajors();
        await Promise.all([loadActiveApplications(), loadCompletedApplications()]);
    } catch (error) {
        console.error('Failed to load dashboard data: ', error);
        toast.add({
            severity: 'error',
            summary: t('study_programs.error'),
            detail: t('study_programs.error_fetch'),
            life: 3000,
        });
    } finally {
        loadingStore.stopLoading();
    }
};

const onActivePageChange = async (event: PaginationEvent) => {
    activePaginationParams.value.page = event.page + 1;
    activePaginationParams.value.rows = event.rows;
    try {
        await loadActiveApplications();
    } catch (error) {
        console.error('Failed to load active applications: ', error);
    }
};

const onCompletedPageChange = async (event: PaginationEvent) => {
    completedPaginationParams.value.page = event.page + 1;
    completedPaginationParams.value.rows = event.rows;
    try {
        await loadCompletedApplications();
    } catch (error) {
        console.error('Failed to load completed applications: ', error);
    }
};

onMounted(() => {
    loadDashboardData();
});

const getStatusSeverity = (status: string | undefined) => {
    switch (status) {
        case 'qualified':
            return 'success';
        case 'unqualified':
            return 'danger';
        case 'reserve':
            return 'warn';
        case 'pending':
            return 'info';
        default:
            return 'secondary';
    }
};

const recruitingMessage = computed(() => {
    const count = totalActiveApplications.value;
    if (count === 0) return 'dashboard.recruiting.zero';
    if (count === 1) return 'dashboard.recruiting.one';

    if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
        return 'dashboard.recruiting.few';
    }
    return 'dashboard.recruiting.many';
});
</script>

<template>
    <ApplicationHeader
        :title="$t('greeting.helloName', { name: user?.first_name })"
        :subtitle="`${$t(recruitingMessage, { n: totalActiveApplications })} ${$t('dashboard.checkStatus')}`"
        class="mb-16"
    />

    <h2 class="mb-5 text-2xl font-semibold">{{ $t('dashboard.yourApplications') }}</h2>

    <div v-if="loadingStore.isLoading" class="mb-8 flex flex-col gap-10">
        <div
            class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 overflow-hidden rounded-lg border shadow-sm"
        >
            <div class="divide-surface-200 dark:divide-surface-700 flex flex-col divide-y">
                <div
                    v-for="i in 3"
                    :key="i"
                    class="flex flex-col items-start justify-between gap-4 p-4 md:flex-row md:items-center"
                >
                    <div class="flex w-full flex-1 flex-col gap-2">
                        <Skeleton class="max-w-md" />
                        <Skeleton class="max-w-sm" />
                    </div>
                    <div class="flex min-w-max flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <Skeleton width="5rem" height="1.5rem" borderRadius="1rem" />
                        <Skeleton width="6rem" height="2rem" borderRadius="0.5rem" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else-if="activeApplications.length > 0 || completedApplications.length > 0" class="mb-8 flex flex-col gap-8">
        <section v-if="isActiveLoading || activeApplications.length > 0" class="flex flex-col gap-4">
            <div class="border-surface-200 dark:border-surface-700 flex items-end justify-between border-b pb-2">
                <h2 class="text-primary flex items-center gap-2 text-xl font-bold">
                    <i class="pi pi-sync text-primary"></i>
                    {{ $t('dashboard.active') }}
                    <span
                        class="bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100 ml-2 rounded-full px-2 py-0.5 text-xs font-bold"
                        >{{ totalActiveApplications }}</span
                    >
                </h2>
            </div>

            <div
                v-if="isActiveLoading"
                class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 overflow-hidden rounded-lg border shadow-sm"
            >
                <div class="divide-surface-200 dark:divide-surface-700 flex flex-col divide-y">
                    <div
                        v-for="i in activePaginationParams.rows"
                        :key="i"
                        class="flex flex-col items-start justify-between gap-4 p-4 md:flex-row md:items-center"
                    >
                        <div class="flex w-full flex-1 flex-col gap-2">
                            <Skeleton class="max-w-md" />
                            <Skeleton class="max-w-sm" />
                        </div>
                        <div class="flex min-w-max flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <Skeleton width="5rem" height="1.5rem" borderRadius="1rem" />
                            <Skeleton width="6rem" height="2rem" borderRadius="0.5rem" />
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-else
                class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 overflow-hidden rounded-lg border shadow-sm"
            >
                <div class="divide-surface-200 dark:divide-surface-700 flex flex-col divide-y">
                    <div
                        v-for="app in activeApplications"
                        :key="app.id"
                        class="hover:bg-surface-50 dark:hover:bg-surface-800 flex flex-col items-start justify-between gap-4 p-4 transition-colors md:flex-row md:items-center"
                    >
                        <div class="flex flex-1 flex-col gap-1">
                            <h3
                                class="text-surface-900 dark:text-surface-0 group-hover:text-primary text-lg leading-tight font-bold transition-colors"
                            >
                                {{ app.major?.name }}
                            </h3>
                            <p class="text-surface-500 dark:text-surface-400 text-sm">
                                {{ getLocalizedMajorField('studyLevel', app.major?.study_level) }},
                                {{ getLocalizedMajorField('studyMode', app.major?.study_mode) }}
                                <span v-if="app.recruitment?.academic_year">
                                    &bull; {{ app.recruitment.academic_year.start_year }}/{{
                                        app.recruitment.academic_year.start_year + 1
                                    }}
                                </span>
                            </p>
                        </div>
                        <div class="flex min-w-max flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <Tag :severity="getStatusSeverity(app.application_status)" class="text-xs">{{
                                getLocalizedStatus(app.application_status)
                            }}</Tag>
                            <Button
                                :label="$t('dashboard.details')"
                                icon="pi pi-chevron-right"
                                iconPos="right"
                                size="small"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Paginator
                v-if="totalActiveApplications > activePaginationParams.rows"
                :first="(activePaginationParams.page - 1) * activePaginationParams.rows"
                :rows="activePaginationParams.rows"
                :totalRecords="totalActiveApplications"
                @page="onActivePageChange"
            />
        </section>

        <section v-if="isCompletedLoading || completedApplications.length > 0" class="flex flex-col gap-4">
            <div class="border-surface-200 dark:border-surface-700 flex items-end justify-between border-b pb-2">
                <h2 class="text-surface-500 dark:text-surface-400 flex items-center gap-2 text-xl font-bold">
                    <i class="pi pi-check-circle text-surface-500 dark:text-surface-400"></i>
                    {{ $t('dashboard.completed') }}
                    <span
                        class="bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300 ml-2 rounded-full px-2 py-0.5 text-xs font-bold"
                        >{{ totalCompletedApplications }}</span
                    >
                </h2>
            </div>

            <div
                v-if="isCompletedLoading"
                class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 overflow-hidden rounded-lg border shadow-sm"
            >
                <div class="divide-surface-200 dark:divide-surface-700 flex flex-col divide-y">
                    <div
                        v-for="i in completedPaginationParams.rows"
                        :key="i"
                        class="flex flex-col items-start justify-between gap-4 p-4 opacity-75 md:flex-row md:items-center"
                    >
                        <div class="flex w-full flex-1 flex-col gap-2">
                            <Skeleton class="max-w-md" />
                            <Skeleton class="max-w-sm" />
                        </div>
                        <div class="flex min-w-max flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <Skeleton width="5rem" height="1.5rem" borderRadius="1rem" />
                            <Skeleton width="6rem" height="2rem" borderRadius="0.5rem" />
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-else
                class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 overflow-hidden rounded-lg border shadow-sm"
            >
                <div class="divide-surface-200 dark:divide-surface-700 flex flex-col divide-y">
                    <div
                        v-for="app in completedApplications"
                        :key="app.id"
                        class="hover:bg-surface-50 dark:hover:bg-surface-800 flex flex-col items-start justify-between gap-4 p-4 opacity-75 transition-all duration-300 hover:opacity-100 md:flex-row md:items-center"
                    >
                        <div class="flex flex-1 flex-col gap-1">
                            <h3
                                class="text-surface-900 dark:text-surface-0 group-hover:text-primary text-base leading-tight font-bold transition-colors"
                            >
                                {{ app.major?.name }}
                            </h3>
                            <p class="text-surface-500 dark:text-surface-400 text-sm">
                                {{ getLocalizedMajorField('studyLevel', app.major?.study_level) }},
                                {{ getLocalizedMajorField('studyMode', app.major?.study_mode) }}
                                <span v-if="app.recruitment?.academic_year">
                                    &bull; {{ app.recruitment.academic_year.start_year }}/{{
                                        app.recruitment.academic_year.start_year + 1
                                    }}
                                </span>
                            </p>
                        </div>
                        <div class="flex min-w-max flex-col items-start gap-4 sm:flex-row sm:items-center">
                            <Tag :severity="getStatusSeverity(app.application_status)" class="text-xs">{{
                                getLocalizedStatus(app.application_status)
                            }}</Tag>
                            <Button
                                :label="$t('dashboard.details')"
                                icon="pi pi-chevron-right"
                                iconPos="right"
                                size="small"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Paginator
                v-if="totalCompletedApplications > completedPaginationParams.rows"
                :first="(completedPaginationParams.page - 1) * completedPaginationParams.rows"
                :rows="completedPaginationParams.rows"
                :totalRecords="totalCompletedApplications"
                @page="onCompletedPageChange"
            />
        </section>
    </div>
    <div v-else>
        <p>{{ $t('dashboard.noApplications') }}</p>
    </div>

    <Card class="my-12">
        <template #content>
            <div class="flex items-center gap-4 sm:p-2">
                <i class="pi pi-question-circle bg-uk-100 rounded-lg p-4 text-xl text-black" />
                <div class="flex flex-1 flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p class="text-lg font-semibold">{{ $t('dashboard.needHelp') }}</p>
                        <p class="text-sm">{{ $t('dashboard.recruitmentOffice') }}</p>
                    </div>
                    <Button as="a" :href="'mailto:' + universityEmail" size="small">{{
                        $t('dashboard.contactUs')
                    }}</Button>
                </div>
            </div>
        </template>
    </Card>
</template>
