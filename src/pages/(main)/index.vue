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

const applications = ref<RecruitmentApplication[]>([]);
const majors = ref<Major[]>([]);
const totalApplications = ref(0);
const paginationParams = ref<PaginationState>({
    page: 1,
    rows: 10,
});
const universityEmail = import.meta.env.VITE_CONTACT_EMAIL;

const mapApplicationsWithMajors = (apps: RecruitmentApplication[], majorsList: Major[]) => {
    return apps.map((app) => ({
        ...app,
        major: majorsList.find((m) => m.id === app.recruitment?.major_id),
    }));
};

const loadDashboardData = loadingStore.withLoading(async () => {
    try {
        if (majors.value.length === 0) {
            const majorsRes = await axiosInstance.get<{ data: Major[] } | Major[]>('/api/v1/majors');
            majors.value = Array.isArray(majorsRes.data) ? majorsRes.data : majorsRes.data.data;
        }

        const response = await axiosInstance.get<PaginatedResponse<RecruitmentApplication>>(
            '/api/v1/recruitment-applications',
            {
                params: {
                    include: 'recruitment,recruitment.academicYear',
                    sort: 'application_status',
                    page: paginationParams.value.page,
                },
            },
        );

        applications.value = mapApplicationsWithMajors(response.data.data, majors.value);
        totalApplications.value = response.data.meta?.total || 0;
        paginationParams.value.rows = response.data.meta.per_page || 10;
    } catch (error) {
        console.error('Failed to load dashboard data: ', error);
        toast.add({
            severity: 'error',
            summary: t('study_programs.error'),
            detail: t('study_programs.error_fetch'),
            life: 3000,
        });
    }
});

const onPageChange = (event: PaginationEvent) => {
    paginationParams.value.page = event.page + 1;
    paginationParams.value.rows = event.rows;
    loadDashboardData();
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
    const count = totalApplications.value;
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
        :subtitle="`${$t(recruitingMessage, { n: totalApplications })} ${$t('dashboard.checkStatus')}`"
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

    <div v-else-if="applications.length > 0" class="mb-8 flex flex-col gap-10">
        <div
            class="bg-surface-0 dark:bg-surface-900 border-surface-200 dark:border-surface-700 overflow-hidden rounded-lg border shadow-sm"
        >
            <div class="divide-surface-200 dark:divide-surface-700 flex flex-col divide-y">
                <div
                    v-for="app in applications"
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
            v-if="totalApplications > paginationParams.rows"
            :first="(paginationParams.page - 1) * paginationParams.rows"
            :rows="paginationParams.rows"
            :totalRecords="totalApplications"
            @page="onPageChange"
        />
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
