<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useMajorStore } from '@/stores/major';
import type { ApiRecruitment } from '@/types/recruitment';
import type { PaginatedResponse, PaginationEvent, PaginationState } from '@/types/pagination';
import { axiosInstance } from '@/services/api/axiosInstance';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import dayjs from 'dayjs';
import { useLoadingStore } from '@/stores/loading';
import { refDebounced } from '@vueuse/core';
import { useLocalizedEnums } from '@/composables/useLocalizedEnums';

const { t } = useI18n();
const { getLocalizedMajorField } = useLocalizedEnums();
const majorStore = useMajorStore();
const toast = useToast();
const loadingStore = useLoadingStore();

const recruitments = ref<ApiRecruitment[]>([]);
const totalRecords = ref(0);
const error = ref('');

const search = ref('');
const debouncedSearch = refDebounced(search, 300);

const paginationParams = ref<PaginationState>({
    page: 1,
    rows: 10,
});

const loadRecruitments = loadingStore.withLoading(async () => {
    error.value = '';
    try {
        const response = await axiosInstance.get<PaginatedResponse<ApiRecruitment>>(`/api/v1/recruitments`, {
            params: {
                include: 'major,cost,academicYear',
                'filter[status]': 'ongoing,suspended',
                'filter[major_name]': debouncedSearch.value || undefined,
                page: paginationParams.value.page,
                per_page: paginationParams.value.rows,
            },
        });

        recruitments.value = response.data.data;
        totalRecords.value = response.data.meta?.total || response.data.data.length;
    } catch {
        error.value = t('study_programs.error_fetch');
        toast.add({ severity: 'error', summary: t('study_programs.error'), detail: error.value, life: 3000 });
    }
});

const onPage = (event: PaginationEvent) => {
    paginationParams.value.page = event.page + 1;
    paginationParams.value.rows = event.rows;
    loadRecruitments();
};

onMounted(() => {
    loadRecruitments();
});

const isSelected = (recruitment: ApiRecruitment) => {
    return majorStore.selectedMajors.some((p) => p.recruitment.id === recruitment.id);
};

const toggleSelection = (recruitment: ApiRecruitment) => {
    if (recruitment.status === 'suspended') return;

    if (isSelected(recruitment)) {
        majorStore.removeMajor(recruitment.id);
    } else {
        majorStore.addMajor(recruitment);
    }
};

watch(debouncedSearch, () => {
    paginationParams.value.page = 1;
    loadRecruitments();
});
</script>

<template>
    <section class="space-y-6">
        <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold">
                {{ $t('study_programs.available_majors') }}
            </h3>
            <IconField iconPosition="left">
                <InputIcon class="pi pi-search" />
                <InputText v-model="search" :placeholder="$t('study_programs.search')" class="w-64 rounded-lg" />
            </IconField>
        </div>

        <div class="overflow-hidden rounded-lg shadow-sm">
            <DataTable
                :value="recruitments"
                :lazy="true"
                :loading="loadingStore.isLoading"
                :paginator="true"
                :rows="paginationParams.rows"
                :totalRecords="totalRecords"
                @page="onPage"
                :rowClass="
                    (data) =>
                        data.status === 'suspended'
                            ? 'opacity-50 pointer-events-none'
                            : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors'
                "
                @row-click="(event) => toggleSelection(event.data)"
            >
                <template #empty>
                    <div class="p-4 text-center text-gray-500">
                        {{ $t('study_programs.no_records') }}
                    </div>
                </template>

                <Column>
                    <template #body="{ data }">
                        <Checkbox
                            :modelValue="isSelected(data)"
                            :binary="true"
                            :disabled="data.status === 'suspended'"
                            @click.stop="toggleSelection(data)"
                        />
                    </template>
                </Column>

                <Column
                    :header="$t('study_programs.major')"
                    class="text-xs font-semibold tracking-widest text-slate-500 uppercase"
                >
                    <template #body="{ data }">
                        <div class="py-2">
                            <div class="flex flex-col">
                                <span class="text-uk-600 dark:text-uk-300 text-sm font-bold">
                                    {{ data.major?.name }}
                                    <Tag
                                        v-if="data.status === 'suspended'"
                                        severity="danger"
                                        :value="$t('study_programs.suspended')"
                                        class="my-1.5 text-xs"
                                    />
                                </span>

                                <span class="text-xs text-slate-500"
                                    >{{ getLocalizedMajorField('studyLevel', data.major?.study_level) }},
                                    {{ getLocalizedMajorField('studyMode', data.major?.study_mode) }}</span
                                >
                            </div>

                            <Tag class="mt-1 text-xs">
                                {{ dayjs(data.start_date.local).format('DD.MM.YYYY') }} -
                                {{ dayjs(data.end_date.local).format('DD.MM.YYYY') }}</Tag
                            >
                        </div>
                    </template>
                </Column>

                <Column
                    :header="$t('study_programs.price')"
                    alignFrozen="right"
                    class="text-right text-xs font-bold tracking-widest text-slate-500 uppercase"
                >
                    <template #body="{ data }">
                        <span class="text-uk-600 dark:text-uk-300 text-sm font-bold">{{ data.price }} PLN</span>
                    </template>
                </Column>

                <Column
                    :header="$t('study_programs.semesters')"
                    alignFrozen="right"
                    class="text-right text-xs font-bold tracking-widest text-slate-500 uppercase"
                >
                    <template #body="{ data }">
                        <span class="text-uk-600 dark:text-uk-300 text-sm font-bold">{{ data.major?.semesters }}</span>
                    </template>
                </Column>

                <Column
                    :header="$t('study_programs.slots')"
                    alignFrozen="right"
                    class="text-right text-xs font-bold tracking-widest text-slate-500 uppercase"
                >
                    <template #body="{ data }">
                        <span class="text-uk-600 dark:text-uk-300 text-sm font-bold">{{ data.slots }}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
    </section>
</template>
