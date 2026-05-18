<template>
  <div class="w-full max-w-6xl mx-auto p-4 md:p-8 text-slate-800 dark:text-slate-100 transition-colors duration-200">
    
    <RouterLink to="/major" class="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Wróć do listy kierunków
    </RouterLink>

    <div v-if="isLoading" class="text-center py-12 text-gray-500">
      <p class="animate-pulse">Ładowanie szczegółów kierunku...</p>
    </div>

    <div v-else-if="hasError || !course" class="text-center py-12 text-red-500">
      <h3 class="text-lg font-bold">Kierunek nie istnieje</h3>
      <p class="text-sm text-gray-500 mt-1">Nie udało się znaleźć wybranego kierunku studiów.</p>
    </div>

    <div v-else class="space-y-6 animate-fade-in">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row md:justify-between md:items-center gap-6 relative overflow-hidden">
        
        <div class="relative z-10">
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
              {{ course.study_level?.name }}
            </span>
            <span class="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
              {{ course.study_mode?.name }}
            </span>
          </div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-[#11224d] dark:text-white tracking-tight">
            {{ course.name }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Tytuł zawodowy: {{ course.degree_title?.name || 'Brak' }}
          </p>
        </div>

        <div class="flex flex-col items-center md:items-end gap-2 relative z-10 shrink-0 w-full md:w-auto">
          <button 
            @click="handleApply"
            :disabled="isAlreadyAdded"
            :class="[
              'w-full md:w-auto px-8 py-3.5 font-semibold rounded-xl transition shadow-md text-sm text-center',
              isAlreadyAdded 
                ? 'bg-emerald-600 text-white cursor-not-allowed opacity-90' 
                : 'bg-[#11224d] dark:bg-blue-600 text-white hover:bg-[#1a316c] dark:hover:bg-blue-500'
            ]"
          >
            {{ isAlreadyAdded ? 'Kierunek został już wybrany ✓' : 'Zapisz się na kierunek' }}
          </button>
          
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Liczba semestrów: {{ course.semesters }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div class="lg:col-span-2 space-y-4">
          <h2 class="text-xl font-bold text-[#11224d] dark:text-slate-100">Informacje o kierunku</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Ten kierunek oferuje limit języków obcych wynoszący: <span class="font-bold">{{ course.languages_limit ?? 'brak limitu' }}</span>.
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { axiosInstance } from '@/services/api/axiosInstance' // Używamy Twojego działającego instance
import { useMajorStore } from '@/stores/major'

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

const route = useRoute()
const majorStore = useMajorStore()

const course = ref<LaravelMajor | null>(null)
const isLoading = ref(true)
const hasError = ref(false)

// Sprawdzanie w Pinia store (dopasowane do Twojego useMajorStore)
const isAlreadyAdded = computed(() => {
  if (!course.value) return false
  return majorStore.selectedMajors.some((item) => item.recruitment.id === course.value?.id)
})

onMounted(async () => {
  try {
    // 1. Zmieniony endpoint na /api/v1/majors/{id}
    // 2. Obsługa opakowania w .data.data (jeśli LaravelResource zwraca obiekt zagnieżdżony)
    const response = await axiosInstance.get<LaravelResourceResponse<LaravelMajor>>(`/api/v1/majors/${route.params.id}`)
    
    // Sprawdzamy czy odpowiedź ma strukturę resource (.data.data) czy bezpośrednią
    if (response.data && 'data' in response.data) {
      course.value = response.data.data
    } else {
      course.value = response.data as any
    }
  } catch (error) {
    console.error('Błąd pobierania szczegółów kierunku:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
})

const handleApply = () => {
  if (course.value) {
    // Rzutujemy obiekt na ApiRecruitment, jeśli struktury w Pinia są identyczne z modelem
    majorStore.addMajor(course.value as any)
  }
}
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