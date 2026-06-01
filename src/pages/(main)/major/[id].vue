<template>
    <div class="mx-auto w-full max-w-6xl p-4 text-slate-800 transition-colors duration-200 md:p-8 dark:text-slate-100">
        <RouterLink
            to="/major"
            class="mb-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Wróć do listy kierunków
        </RouterLink>

        <div v-if="isLoading" class="py-12 text-center text-gray-500">
            <div class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p class="animate-pulse">Ładowanie szczegółów kierunku...</p>
        </div>

        <div v-else-if="hasError || !course" class="py-12 text-center text-red-500">
            <h3 class="text-lg font-bold">Kierunek nie istnieje</h3>
            <p class="mt-1 text-sm text-gray-500">Nie udało się znaleźć wybranego kierunku studiów.</p>
        </div>

        <div v-else class="animate-fade-in space-y-6">
            <div
                class="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8 dark:border-slate-700 dark:bg-slate-800"
            >
                <div class="relative z-10">
                    <div class="mb-4 flex flex-wrap gap-1.5">
                        <span
                            v-if="course.study_mode"
                            class="rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                        >
                            {{ $te(`enums.studyMode.${course.study_mode}`) ? $t(`enums.studyMode.${course.study_mode}`) : course.study_mode }}
                        </span>
                    </div>
                    
                    <h1 class="text-3xl font-extrabold tracking-tight text-[#11224d] md:text-4xl dark:text-white">
                        {{ course.name }}
                    </h1>
                    
                    <p class="mt-2 text-sm font-medium text-gray-400 dark:text-gray-500">
                        Uzyskiwany tytuł: 
                        <span class="text-gray-600 dark:text-gray-300 font-semibold">
                            {{ formatDegreeTitle(course.degree_title) }}
                        </span>
                    </p>
                </div>

                <div class="relative z-10 flex w-full shrink-0 flex-col items-center gap-2 md:w-auto md:items-end">
                    <button
                        @click="handleApply"
                        class="w-full rounded-xl bg-[#11224d] px-8 py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-[#1a316c] md:w-auto dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                        {{ isAlreadyAdded ? 'Przejdź do aplikacji ✓' : 'Zapisz się na kierunek' }}
                    </button>

                    <div class="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Czas trwania: <span class="font-semibold text-gray-700 dark:text-gray-200">{{ course.semesters }} {{ course.semesters === 1 ? 'semestr' : (course.semesters < 5 ? 'semestry' : 'semestrów') }}</span>
                    </div>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div class="space-y-4 lg:col-span-2">
                    <h2 class="text-xl font-bold text-[#11224d] dark:text-slate-100">Informacje o kierunku</h2>
                    <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        Ten kierunek oferuje limit języków obcych wynoszący:
                        <span class="font-bold text-slate-800 dark:text-slate-200">{{ course.languages_limit ?? 'brak limitu' }}</span>.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // <-- Dodany useRouter
import { axiosInstance } from '@/services/api/axiosInstance';
import { useMajorStore } from '@/stores/major';

interface LaravelMajor {
    id: number;
    name: string;
    semesters: number;
    study_level_id: number;
    study_mode_id: number;
    degree_title_id: number;
    languages_limit: number | null;
    study_level?: string;
    study_mode?: string;
    degree_title?: string;
}

interface LaravelResourceResponse<T> {
    data: T;
}

const route = useRoute();
const router = useRouter(); // <-- Inicjalizacja routera
const majorStore = useMajorStore();

const course = ref<LaravelMajor | null>(null);
const isLoading = ref(true);
const hasError = ref(false);

// MAPOWANIE SKRÓTÓW TYTUŁÓW NA PEŁNE SŁOWA
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

const isAlreadyAdded = computed(() => {
    if (!course.value) return false;
    return majorStore.selectedMajors.some((item: any) => {
        const selectedId = item?.recruitment?.id || item?.id;
        return selectedId === course.value?.id;
    });
});

onMounted(async () => {
    try {
        const response = await axiosInstance.get<LaravelResourceResponse<LaravelMajor> | LaravelMajor>(
            `/api/v1/majors/${route.params.id}`,
        );

        let rawCourse: LaravelMajor;
        if (response.data && 'data' in response.data) {
            rawCourse = response.data.data;
        } else {
            rawCourse = response.data as LaravelMajor;
        }

        // Ujednolicenie trybów zdalnych/online na "Niestacjonarne"
        const mode = (rawCourse.study_mode || '').toLowerCase().trim();
        if (mode.includes('online') || mode.includes('internet') || mode.includes('zdaln')) {
            rawCourse.study_mode = 'Niestacjonarne';
            rawCourse.study_mode_id = 2;
        }

        course.value = rawCourse;
    } catch (error) {
        console.error('Błąd pobierania szczegółów kierunku:', error);
        hasError.value = true;
    } finally {
        isLoading.value = false;
    }
});

// LOGIKA DODAWANIA I PRZEKIEROWANIA
const handleApply = () => {
    if (course.value) {
        if (!isAlreadyAdded.value) {
            majorStore.addMajor(course.value);
        }
        router.push('/application/study-programs');
    }
};
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.25s ease-out forwards;
}
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>