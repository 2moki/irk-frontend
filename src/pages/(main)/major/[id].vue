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
                    <div class="mb-3 flex flex-wrap gap-2">
                        <span
                            class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                        >
                            {{ course.study_level?.name }}
                        </span>
                        <span
                            class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                        >
                            {{ course.study_mode?.name }}
                        </span>
                    </div>
                    <h1 class="text-3xl font-extrabold tracking-tight text-[#11224d] md:text-4xl dark:text-white">
                        {{ course.name }}
                    </h1>
                    <p class="mt-1 font-medium text-gray-500 dark:text-gray-400">
                        Tytuł zawodowy: {{ course.degree_title?.name || 'Brak' }}
                    </p>
                </div>

                <div class="relative z-10 flex w-full shrink-0 flex-col items-center gap-2 md:w-auto md:items-end">
                    <button
                        @click="handleApply"
                        :disabled="isAlreadyAdded"
                        :class="[
                            'w-full rounded-xl px-8 py-3.5 text-center text-sm font-semibold shadow-md transition md:w-auto',
                            isAlreadyAdded
                                ? 'cursor-not-allowed bg-emerald-600 text-white opacity-90'
                                : 'bg-[#11224d] text-white hover:bg-[#1a316c] dark:bg-blue-600 dark:hover:bg-blue-500',
                        ]"
                    >
                        {{ isAlreadyAdded ? 'Kierunek został już wybrany ✓' : 'Zapisz się na kierunek' }}
                    </button>

                    <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Liczba semestrów: {{ course.semesters }}
                    </div>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div class="space-y-4 lg:col-span-2">
                    <h2 class="text-xl font-bold text-[#11224d] dark:text-slate-100">Informacje o kierunku</h2>
                    <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        Ten kierunek oferuje limit języków obcych wynoszący:
                        <span class="font-bold">{{ course.languages_limit ?? 'brak limitu' }}</span
                        >.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { axiosInstance } from '@/services/api/axiosInstance'; // Używamy Twojego działającego instance
import { useMajorStore } from '@/stores/major';

// Definicja typów identyczna jak w pliku index.vue
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

// Interfejs dla Resource z Laravela (często zawija obiekt w klucz data)
interface LaravelResourceResponse<T> {
    data: T;
}

const route = useRoute();
const majorStore = useMajorStore();

const course = ref<LaravelMajor | null>(null);
const isLoading = ref(true);
const hasError = ref(false);

// Sprawdzanie w Pinia store (dopasowane do Twojego useMajorStore)
const isAlreadyAdded = computed(() => {
    if (!course.value) return false;
    return majorStore.selectedMajors.some((item) => item.recruitment.id === course.value?.id);
});

onMounted(async () => {
    try {
        // 1. Zmieniony endpoint na /api/v1/majors/{id}
        // 2. Obsługa opakowania w .data.data (jeśli LaravelResource zwraca obiekt zagnieżdżony)
        const response = await axiosInstance.get<LaravelResourceResponse<LaravelMajor>>(
            `/api/v1/majors/${route.params.id}`,
        );

        // Sprawdzamy czy odpowiedź ma strukturę resource (.data.data) czy bezpośrednią
        if (response.data && 'data' in response.data) {
            course.value = response.data.data;
        } else {
            course.value = response.data as any;
        }
    } catch (error) {
        console.error('Błąd pobierania szczegółów kierunku:', error);
        hasError.value = true;
    } finally {
        isLoading.value = false;
    }
});

const handleApply = () => {
    if (course.value) {
        // Rzutujemy obiekt na ApiRecruitment, jeśli struktury w Pinia są identyczne z modelem
        majorStore.addMajor(course.value as any);
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
