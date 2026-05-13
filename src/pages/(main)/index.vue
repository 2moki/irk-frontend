<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth.ts';
import { useI18n } from 'vue-i18n';
import { axiosInstance } from '@/services/api/axiosInstance.ts';
import type { Major, RecruitmentApplication } from '@/types/recruitment.ts';
import type { PaginatedResponse } from '@/types/pagination.ts';

const { user } = useAuthStore();
const { t, te } = useI18n();

const applications = ref<RecruitmentApplication[]>([]);
const majors = ref<Major[]>([]);
const totalApplications = ref(0);
const first = ref(0);
const rows = ref(10);
const universityEmail = import.meta.env.VITE_CONTACT_EMAIL;

const fetchMajors = async (): Promise<Major[]> => {
    const { data } = await axiosInstance.get<{ data: Major[] } | Major[]>('/api/v1/majors');
    return Array.isArray(data) ? data : data.data;
};

const fetchApplications = async (page: number = 1): Promise<PaginatedResponse<RecruitmentApplication>> => {
    const { data } = await axiosInstance.get<PaginatedResponse<RecruitmentApplication>>(
        `/api/v1/recruitment-applications?include=application,recruitment&page=${page}`,
    );
    return data;
};

const mapApplicationsWithMajors = (apps: RecruitmentApplication[], majorsList: Major[]) => {
    return apps.map((app) => ({
        ...app,
        major: majorsList.find((m) => m.id === app.recruitment?.major_id),
    }));
};

const loadDashboardData = async (page = 1) => {
    try {
        if (majors.value.length === 0) {
            majors.value = await fetchMajors();
        }

        const applicationsRes = await fetchApplications(page);
        applications.value = mapApplicationsWithMajors(applicationsRes.data, majors.value);
        totalApplications.value = applicationsRes.meta.total;
        rows.value = applicationsRes.meta.per_page;
    } catch (error) {
        console.error('Failed to load dashboard data: ', error);
    }
};

const onPageChange = (event: any) => {
    const newPage = event.page + 1;
    first.value = event.first;
    loadDashboardData(newPage);
};

onMounted(() => {
    loadDashboardData();
});

const getLocalizedStatus = (status: string) => {
    if (!status) return '';
    const key = `dashboard.statuses.${status}`;
    return te(key) ? t(key) : status;
};

const getLocalizedMajorField = (field: string, value: string | undefined) => {
    if (!value) return '';
    const key = `dashboard.${field}.${value}`;
    return te(key) ? t(key) : value;
};
</script>

<template>
    <Card class="bg-uk-700 mb-16 p-2 text-white md:p-4">
        <template #title>
            <p class="text-3xl font-semibold md:text-4xl">
                {{ $t('greeting.helloName', { name: user?.first_name }) }}
            </p>
        </template>
        <template #content>
            <p class="text-uk-100 m-0 text-xl">
                {{ $t('dashboard.recruitingFor', totalApplications) }}
                {{ $t('dashboard.checkStatus') }}
            </p>
        </template>
    </Card>

    <h2 class="mb-5 text-2xl font-semibold">{{ $t('dashboard.yourApplications') }}</h2>
    <div v-if="applications.length > 0">
        <div class="mb-8 grid gap-8 lg:grid-cols-2">
            <Card v-for="app in applications" :key="app.id">
                <template #title>
                    <Badge class="mb-3">{{ getLocalizedMajorField('studyLevel', app.major?.study_level) }}</Badge>
                    <div>
                        <p class="text-xl font-semibold">{{ app.major?.name }}</p>
                        <p class="text-sm">{{ getLocalizedMajorField('studyMode', app.major?.study_mode) }}</p>
                    </div>
                </template>

                <template #content>
                    <Divider />
                </template>

                <template #footer>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="mb-1 text-xs font-semibold uppercase">{{ $t('dashboard.status') }}</p>
                            <Tag severity="info" class="text-xs">{{ getLocalizedStatus(app.application_status) }}</Tag>
                        </div>

                        <Button>{{ $t('dashboard.details') }}</Button>
                    </div>
                </template>
            </Card>
        </div>

        <Paginator
            v-if="totalApplications > rows"
            v-model:first="first"
            :rows="rows"
            :totalRecords="totalApplications"
            @page="onPageChange"
            class="mb-16"
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
