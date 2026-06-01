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
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                        <option :value="3">Studia doktoranckie</option>
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
            <div class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p class="animate-pulse">Pobieranie oferty kierunków...</p>
        </div>

        <div v-else-if="hasError" class="py-12 text-center text-red-500">
            <p>{{ $t('study_programs.error_fetch') }}</p>
        </div>

        <div v-else-if="filteredCourses.length === 0" class="py-12 text-center text-gray-500">
            <p>{{ $t('study_programs.no_records') }}</p>
            <button @click="resetFilters" class="mt-4 text-sm font-semibold text-blue-500 hover:underline">
                Wyczyść filtry
            </button>
        </div>

        <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
                v-for="course in filteredCourses"
                :key="course.id"
                class="group flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800"
            >
                <div>
                    <div class="mb-4 flex flex-wrap gap-1.5">
                        <span
                            v-if="course.study_mode"
                            class="rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                        >
                            {{ $te(`enums.studyMode.${course.study_mode}`) ? $t(`enums.studyMode.${course.study_mode}`) : course.study_mode }}
                        </span>
                    </div>

                    <div class="min-h-[4.5rem]">
                        <h2 class="line-clamp-2 text-xl font-bold tracking-tight text-[#11224d] transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                            {{ course.name }}
                        </h2>
                        <p class="mt-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                            Uzyskiwany tytuł: 
                            <span class="text-gray-600 dark:text-gray-300 font-semibold">
                                {{ formatDegreeTitle(course.degree_title) }}
                            </span>
                        </p>
                    </div>

                    <hr class="my-4 border-gray-100 dark:border-slate-700/50" />

                    <div class="mb-6 grid grid-cols-2 gap-4 text-xs">
                        <div>
                            <span class="mb-0.5 block font-medium text-gray-400 dark:text-gray-500">Czas trwania</span>
                            <span class="font-semibold text-gray-700 dark:text-gray-200">
                                {{ course.semesters }} {{ course.semesters === 1 ? 'semestr' : (course.semesters < 5 ? 'semestry' : 'semestrów') }}
                            </span>
                        </div>
                        <div>
                            <span class="mb-0.5 block font-medium text-gray-400 dark:text-gray-500">Limit miejsc</span>
                            <span class="font-semibold text-amber-600 dark:text-amber-400">
                                {{ course.students_limit ?? 'Brak limitu' }}
                            </span>
                        </div>
                    </div>
                </div>

                <RouterLink
                    :to="`/major/${course.id}`"
                    class="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-100 bg-[#f8fafc] py-3 text-sm font-bold text-[#11224d] transition duration-200 hover:border-transparent hover:bg-[#11224d] hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-blue-600 dark:hover:text-white"
                >
                    {{ $t('dashboard.details') }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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

interface LaravelMajor {
    id: number;
    name: string;
    semesters: number;
    study_level_id: number;
    study_mode_id: number;
    degree_title_id: number;
    students_limit: number | null;
    study_level?: string;
    study_mode?: string;
    degree_title?: string;
}

const courses = ref<LaravelMajor[]>([]);
const isLoading = ref(true);
const hasError = ref(false);

const filters = reactive({
    search: '',
    studyLevelId: '' as string | number,
    studyModeId: '' as string | number,
});

const resetFilters = () => {
    filters.search = '';
    filters.studyLevelId = '';
    filters.studyModeId = '';
};

// SŁOWNIK MAPOWANIA (wzbogacony o potencjalne kropki i spacje)
const degreeMap: Record<string, string> = {
    'lic': 'Licencjat',
    'lic.': 'Licencjat',
    'inż': 'Inżynier',
    'inż.': 'Inżynier',
    'inz': 'Inżynier',
    'inz.': 'Inżynier',
    'mgr': 'Magister',
    'mgr.': 'Magister',
    'mgr inż.': 'Magister Inżynier',
    'mgr inż': 'Magister Inżynier',
    'mgr inz.': 'Magister Inżynier',
    'mgr inz': 'Magister Inżynier',
    'dr': 'Doktor',
    'dr.': 'Doktor',
};

const formatDegreeTitle = (title: string | undefined): string => {
    if (!title) return '—';
    const cleanTitle = title.toLowerCase().trim();
    return degreeMap[cleanTitle] || title;
};

onMounted(async () => {
    try {
        const response = await axiosInstance.get<PaginatedResponse<LaravelMajor[]>>(`/api/v1/majors`);
        let rawData: LaravelMajor[] = [];
        
        if (response.data && Array.isArray(response.data)) {
            rawData = response.data;
        } else if (response.data && 'data' in response.data) {
            rawData = (response.data as any).data;
        }

        courses.value = rawData.map((course) => {
            const mode = (course.study_mode || '').toLowerCase().trim();
            
            if (mode.includes('online') || mode.includes('internet') || mode.includes('zdaln')) {
                return {
                    ...course,
                    study_mode: 'Niestacjonarne', 
                    study_mode_id: 2 
                };
            }
            
            return course;
        });

    } catch (error) {
        console.error('Błąd pobierania kierunków IRK:', error);
        hasError.value = true;
    } finally {
        isLoading.value = false;
    }
});

const filteredCourses = computed(() => {
    return courses.value.filter((course) => {
        // 1. Wyszukiwarka po nazwie
        const matchesSearch = course.name.toLowerCase().includes(filters.search.toLowerCase());
        
        // 2. NOWY: Filtr oparty wyłącznie na czyszczonym skrócie uzyskiwanego tytułu
        const degreeText = (course.degree_title || '').toLowerCase().trim();
        const selectedLevel = Number(filters.studyLevelId);

        let matchesLevel = false;

        if (filters.studyLevelId === '') {
            // Jeśli nie wybrano stopnia, pokuj wszystko
            matchesLevel = true;
        } else {
            if (selectedLevel === 1) {
                // Studia I stopnia -> Licencjat lub Inżynier
                matchesLevel = degreeText.includes('lic') || degreeText.includes('inż') || degreeText.includes('inz');
            } else if (selectedLevel === 2) {
                // Studia II stopnia -> Magister
                matchesLevel = degreeText.includes('mgr');
            } else if (selectedLevel === 3) {
                // Studia doktoranckie -> Doktor
                matchesLevel = degreeText.includes('dr');
            }
        }

        // 3. Filtr trybów (zostaje bez zmian)
        const modeText = (course.study_mode || '').toLowerCase().trim();
        const selectedMode = Number(filters.studyModeId);
        
        const matchesMode = 
            filters.studyModeId === '' || 
            Number(course.study_mode_id) === selectedMode ||
            (selectedMode === 1 && (
                modeText === 'stacjonarne' || 
                modeText === 'stac' || 
                (modeText.includes('stacjonarn') && !modeText.includes('niestacjonarn'))
            )) || 
            (selectedMode === 2 && (
                modeText.includes('niestacjonarn') || 
                modeText === 'niestac'
            ));

        return matchesSearch && matchesLevel && matchesMode;
    });
});
</script>