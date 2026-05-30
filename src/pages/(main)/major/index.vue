<template>
    <div class="mx-auto w-full max-w-6xl p-4 text-slate-800 transition-colors duration-200 md:p-8 dark:text-slate-100">
        <div class="mb-8 space-y-6">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-[#11224d] dark:text-blue-400">
                    {{ $t('study_programs.title') }}
                </h1>
                <p class="mt-1 font-medium text-gray-500 dark:text-gray-400">
                    {{ $t('study_programs.subtitle') }}
                </p>
            </div>

            <div
                class="grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-colors duration-200 md:grid-cols-4 dark:border-slate-700 dark:bg-slate-800"
            >
                <div class="relative md:col-span-2">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </span>
                    <input
                        v-model="filters.search"
                        type="text"
                        :placeholder="$t('study_programs.search')"
                        class="w-full rounded-xl border border-gray-200 bg-[#f8fafc] py-2.5 pr-4 pl-11 text-sm text-slate-800 placeholder-gray-400 transition outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:bg-slate-900 dark:focus:ring-blue-900"
                    />
                </div>

                <div class="relative">
                    <select
                        v-model="filters.studyLevelId"
                        class="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-[#f8fafc] py-2.5 pr-10 pl-4 text-sm text-gray-700 transition outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:bg-slate-900"
                    >
                        <option value="">Wszystkie stopnie</option>
                        <option :value="1">Studia I stopnia</option>
                        <option :value="2">Studia II stopnia</option>
                        <option :value="3">Jednolite magisterskie</option>
                    </select>
                </div>

                <div class="relative">
                    <select
                        v-model="filters.studyModeId"
                        class="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-[#f8fafc] py-2.5 pr-10 pl-4 text-sm text-gray-700 transition outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:focus:border-blue-400 dark:focus:bg-slate-900"
                    >
                        <option value="">Wszystkie tryby</option>
                        <option :value="1">Stacjonarne</option>
                        <option :value="2">Niestacjonarne</option>
                    </select>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="py-12 text-center text-gray-500">
            <p class="animate-pulse">Pobieranie oferty kierunków...</p>
        </div>

        <div v-else-if="hasError" class="py-12 text-center text-red-500">
            <p>{{ $t('study_programs.error_fetch') }}</p>
        </div>

        <div v-else-if="filteredCourses.length === 0" class="py-12 text-center text-gray-500">
            <p>{{ $t('study_programs.no_records') }}</p>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="course in filteredCourses"
                :key="course.id"
                class="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800"
            >
                <div>
                    <div class="mb-4 flex flex-wrap gap-1.5">
                        <span
                            v-if="course.study_level?.name"
                            class="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        >
                            {{
                                $te(`enums.studyLevel.${course.study_level.name}`)
                                    ? $t(`enums.studyLevel.${course.study_level.name}`)
                                    : course.study_level.name
                            }}
                        </span>
                        <span
                            v-if="course.study_mode?.name"
                            class="rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                        >
                            {{
                                $te(`enums.studyMode.${course.study_mode.name}`)
                                    ? $t(`enums.studyMode.${course.study_mode.name}`)
                                    : course.study_mode.name
                            }}
                        </span>
                    </div>

                    <h2 class="line-clamp-1 text-xl font-bold text-[#11224d] dark:text-slate-100">
                        {{ course.name }}
                    </h2>
                    <p class="mt-1 mb-4 text-xs text-gray-400">
                        Tytuł zawodowy: {{ course.degree_title?.name || '—' }}
                    </p>
                    <hr class="my-4 border-gray-100 dark:border-slate-700" />

                    <div class="mb-6 grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span class="mb-0.5 block font-medium text-gray-400">{{
                                $t('study_programs.semesters')
                            }}</span>
                            <span class="font-semibold text-gray-700 dark:text-gray-200">
                                {{ course.semesters }}
                            </span>
                        </div>
                        <div>
                            <span class="mb-0.5 block text-gray-400">Limit języków</span>
                            <span class="font-semibold text-amber-600 dark:text-amber-400">
                                {{ course.languages_limit ?? '—' }}
                            </span>
                        </div>
                    </div>
                </div>

                <RouterLink
                    :to="`/major/${course.id}`"
                    class="flex w-full items-center justify-center gap-2 rounded-xl border bg-[#f8fafc] py-3 text-sm font-bold text-[#11224d] transition duration-200 hover:bg-[#11224d] hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-600"
                >
                    {{ $t('dashboard.details') }}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { axiosInstance } from '@/services/api/axiosInstance';
import type { PaginatedResponse } from '@/types/pagination';

interface StudyRelation {
    id: number;
    name: string;
}

interface LaravelMajor {
    id: number;
    name: string;
    semesters: number;
    study_level_id: number;
    study_mode_id: number;
    degree_title_id: number;
    languages_limit: number | null;
    study_level?: StudyRelation;
    study_mode?: StudyRelation;
    degree_title?: StudyRelation;
}

const courses = ref<LaravelMajor[]>([]);
const isLoading = ref(true);
const hasError = ref(false);

const filters = reactive({
    search: '',
    studyLevelId: '' as string | number,
    studyModeId: '' as string | number,
});

onMounted(async () => {
    try {
        const response = await axiosInstance.get<PaginatedResponse<LaravelMajor[]>>(`/api/v1/majors`);
        courses.value = response.data;
    } catch (error) {
        console.error('Błąd pobierania kierunków:', error);
        hasError.value = true;
    } finally {
        isLoading.value = false;
    }
});

const filteredCourses = computed(() => {
    return courses.value.filter((course) => {
        const matchesSearch = course.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesLevel = filters.studyLevelId === '' || course.study_level_id === Number(filters.studyLevelId);
        const matchesMode = filters.studyModeId === '' || course.study_mode_id === Number(filters.studyModeId);

        return matchesSearch && matchesLevel && matchesMode;
    });
});
</script>
