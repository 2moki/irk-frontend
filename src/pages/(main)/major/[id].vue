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

        <div v-else class="animate-fade-in space-y-8">
            <div
                class="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8 dark:border-slate-700 dark:bg-slate-800"
            >
                <div class="relative z-10">
                    <div class="mb-4 flex flex-wrap gap-1.5">
                        <span
                            v-if="course.study_mode"
                            class="rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
                        >
                            {{ course.study_mode }}
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
                        Zapisz się na kierunek
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <div>
                        <span class="block text-xs font-medium text-gray-400 dark:text-gray-500">Poziom studiów</span>
                        <span class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ course.study_level ?? '—' }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <span class="block text-xs font-medium text-gray-400 dark:text-gray-500">Forma kształcenia</span>
                        <span class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ course.study_mode ?? 'Stacjonarne' }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-800">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <span class="block text-xs font-medium text-gray-400 dark:text-gray-500">Okres studiów</span>
                        <span class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ course.semesters }} semestrów</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div class="space-y-6 lg:col-span-2">
                    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <h2 class="text-xl font-bold text-[#11224d] dark:text-slate-100">O kierunku</h2>
                        <p class="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                            Kierunek studiów <span class="font-semibold text-slate-800 dark:text-slate-200">"{{ course.name }}"</span> oferuje wszechstronne wykształcenie dopasowane do aktualnych potrzeb rynku pracy. Program kładzie nacisk zarówno na gruntowne przygotowanie teoretyczne, jak i rozwijanie umiejętności praktycznych niezbędnych w przyszłej pracy zawodowej.
                        </p>
                    </div>

                    <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                        <div class="flex items-center gap-2 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 0c-.813 2.146-2.185 4.16-4 5.5m3.712-5.5a14.197 14.197 0 00-2.312-3.667M7 19l2.712-6.78M12 19l-2.712-6.78L7 19z" />
                            </svg>
                            <h3 class="text-lg font-bold text-[#11224d] dark:text-slate-100">Języki obce do wyboru</h3>
                        </div>

                        <div v-if="course.languages && course.languages.length > 0">
                            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                W ramach tego kierunku masz możliwość wyboru spośród następujących języków obcych:
                            </p>
                            <div class="flex flex-wrap gap-2.5">
                                <span 
                                    v-for="lang in course.languages" 
                                    :key="lang.id" 
                                    class="inline-flex items-center gap-1.5 rounded-xl bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-100/50 dark:border-blue-900/30"
                                >
                                    <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                    {{ lang.name }}
                                </span>
                            </div>
                        </div>

                        <div v-else class="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50 border border-dashed border-gray-200 dark:border-slate-700">
                            <p class="text-sm text-gray-500 dark:text-gray-400 italic">
                                Wybór lektoratu odbywa się zazwyczaj na etapie składania dokumentów rekrutacyjnych lub podczas inauguracji roku akademickiego.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="rounded-2xl border border-gray-100 bg-[#f8fafc] p-6 dark:border-slate-700 dark:bg-slate-900 shadow-sm">
                        <h3 class="text-sm font-bold text-[#11224d] dark:text-slate-200">Status rekrutacji</h3>
                        
                        <div v-if="hasRecruitmentDates" class="mt-4 space-y-3 rounded-xl bg-white p-4 border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                            <div class="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Trwa nabór wniosków
                            </div>
                            
                            <div class="space-y-2 pt-1">
                                <div v-if="getStartDate" class="text-xs">
                                    <span class="block text-gray-400 dark:text-gray-500 font-medium">Rozpoczęcie rekrutacji:</span>
                                    <span class="font-bold text-gray-700 dark:text-gray-200 text-sm">{{ formatDate(getStartDate) }}</span>
                                </div>
                                <div v-if="getEndDate" class="text-xs">
                                    <span class="block text-gray-400 dark:text-gray-500 font-medium">Zakończenie przyjmowania zgłoszeń:</span>
                                    <span class="font-bold text-red-600 dark:text-red-400 text-sm">{{ formatDate(getEndDate) }}</span>
                                </div>
                            </div>
                        </div>

                        <p v-else class="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                            Rekrutacja na ten kierunek jest otwarta. Ostatnia aktualizacja oferty miała miejsce: <span class="font-medium text-slate-700 dark:text-slate-300">{{ course.updated_at?.human || 'niedawno' }}</span>.
                        </p>
                        
                        <hr class="my-4 border-gray-200 dark:border-slate-700" />
                        
                        <h3 class="text-sm font-bold text-[#11224d] dark:text-slate-200">Kontakt z Działem Rekrutacji</h3>
                        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-5">
                            E-mail: rekrutacja@uczelnia.edu.pl<br />
                            Tel: +48 12 345 67 89
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { axiosInstance } from '@/services/api/axiosInstance';

interface Language {
    id: number;
    name: string;
    code?: string;
}

interface DateMeta {
    human: string;
    local: string;
    string: string;
    timestamp: number;
}

interface LaravelMajor {
    id: number;
    name: string;
    semesters: number;
    study_level: string;
    study_mode: string;
    degree_title: string;
    languages: Language[];
    start_at?: string | DateMeta; // Sprawdzamy na wypadek gdyby pole było bezpośrednio tu
    end_at?: string | DateMeta;
    recruitment?: {
        start_at?: string | DateMeta; // Lub w zagnieżdżonym obiekcie rekrutacji
        end_at?: string | DateMeta;
    } | null;
    created_at?: DateMeta;
    updated_at?: DateMeta;
}

const route = useRoute();
const router = useRouter();

const course = ref<LaravelMajor | null>(null);
const isLoading = ref(true);
const hasError = ref(false);

// Gettery sprawdzające bezpiecznie, gdzie ukryte są daty rekrutacji w JSON
const getStartDate = computed(() => course.value?.start_at || course.value?.recruitment?.start_at);
const getEndDate = computed(() => course.value?.end_at || course.value?.recruitment?.end_at);
const hasRecruitmentDates = computed(() => !!(getStartDate.value || getEndDate.value));

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
    'dr': 'Doktor',
};

const formatDegreeTitle = (title: string | undefined): string => {
    if (!title) return '—';
    const cleanTitle = title.toLowerCase().trim();
    return degreeMap[cleanTitle] || title;
};

const formatDate = (dateValue: any): string => {
    if (!dateValue) return '—';
    const dateStr = typeof dateValue === 'object' ? dateValue.local || dateValue.string : dateValue;
    try {
        const date = new Date(dateStr);
        return date.toLocaleString('pl-PL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateStr;
    }
};

onMounted(async () => {
    try {
        // Powrót do bezpiecznego adresu URL, który na 100% działał w Twojej konsoli
        const response = await axiosInstance.get(`/api/v1/majors/${route.params.id}?include=languages`);
        
        const rawCourse = response.data?.data || response.data;

        if (rawCourse && rawCourse.study_mode) {
            const mode = rawCourse.study_mode.toLowerCase().trim();
            if (mode.includes('online') || mode.includes('internet') || mode.includes('zdaln')) {
                rawCourse.study_mode = 'Niestacjonarne';
            }
        }

        course.value = rawCourse;
    } catch (error) {
        console.error('Błąd pobierania szczegółów kierunku:', error);
        hasError.value = true;
    } finally {
        isLoading.value = false;
    }
});

const handleApply = () => {
    router.push('/application/study-programs');
};
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.25s ease-out forwards;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>