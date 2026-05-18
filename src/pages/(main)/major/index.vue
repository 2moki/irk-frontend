<template>
  <div class="w-full max-w-6xl mx-auto p-4 md:p-8 text-slate-800 dark:text-slate-100 transition-colors duration-200">
    <div class="mb-8 space-y-6">
      <div>
        <h1 class="text-3xl font-extrabold text-[#11224d] dark:text-blue-400 tracking-tight">
          {{ $t('study_programs.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 font-medium mt-1">
          {{ $t('study_programs.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200">
        <div class="md:col-span-2 relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            v-model="filters.search"
            type="text" 
            :placeholder="$t('study_programs.search')" 
            class="w-full pl-11 pr-4 py-2.5 bg-[#f8fafc] dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition text-sm text-slate-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div class="relative">
          <select v-model="filters.studyLevelId" class="w-full pl-4 pr-10 py-2.5 bg-[#f8fafc] dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition appearance-none text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <option value="">Wszystkie stopnie</option>
            <option :value="1">Studia I stopnia</option>
            <option :value="2">Studia II stopnia</option>
            <option :value="3">Jednolite magisterskie</option>
          </select>
        </div>

        <div class="relative">
          <select v-model="filters.studyModeId" class="w-full pl-4 pr-10 py-2.5 bg-[#f8fafc] dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition appearance-none text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <option value="">Wszystkie tryby</option>
            <option :value="1">Stacjonarne</option>
            <option :value="2">Niestacjonarne</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-gray-500">
      <p class="animate-pulse">Pobieranie oferty kierunków...</p>
    </div>

    <div v-else-if="hasError" class="text-center py-12 text-red-500">
      <p>{{ $t('study_programs.error_fetch') }}</p>
    </div>

    <div v-else-if="filteredCourses.length === 0" class="text-center py-12 text-gray-500">
      <p>{{ $t('study_programs.no_records') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in filteredCourses" :key="course.id" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700/60 flex flex-col justify-between hover:shadow-md transition duration-300 group">
        <div>
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span v-if="course.study_level?.name" class="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full text-[11px] font-semibold">
              {{ $te(`enums.studyLevel.${course.study_level.name}`) ? $t(`enums.studyLevel.${course.study_level.name}`) : course.study_level.name }}
            </span>
            <span v-if="course.study_mode?.name" class="px-2.5 py-0.5 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full text-[11px] font-semibold">
              {{ $te(`enums.studyMode.${course.study_mode.name}`) ? $t(`enums.studyMode.${course.study_mode.name}`) : course.study_mode.name }}
            </span>
          </div>

          <h2 class="text-xl font-bold text-[#11224d] dark:text-slate-100 line-clamp-1">
            {{ course.name }}
          </h2>
          <p class="text-xs text-gray-400 mt-1 mb-4">
            Tytuł zawodowy: {{ course.degree_title?.name || '—' }}
          </p>
          <hr class="border-gray-100 dark:border-slate-700 my-4" />

          <div class="grid grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <span class="block text-gray-400 font-medium mb-0.5">{{ $t('study_programs.semesters') }}</span>
              <span class="font-semibold text-gray-700 dark:text-gray-200">
                {{ course.semesters }}
              </span>
            </div>
            <div>
              <span class="block text-gray-400 mb-0.5">Limit języków</span>
              <span class="font-semibold text-amber-600 dark:text-amber-400">
                {{ course.languages_limit ?? '—' }}
              </span>
            </div>
          </div>
        </div>

        <RouterLink 
          :to="`/major/${course.id}`"
          class="w-full flex items-center justify-center gap-2 py-3 bg-[#f8fafc] dark:bg-slate-900 text-[#11224d] dark:text-slate-300 font-bold rounded-xl hover:bg-[#11224d] dark:hover:bg-blue-600 hover:text-white transition duration-200 text-sm border dark:border-slate-700"
        >
          {{ $t('dashboard.details') }}
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
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

const courses = ref<LaravelMajor[]>([])
const isLoading = ref(true)
const hasError = ref(false)

const filters = reactive({
  search: '',
  studyLevelId: '' as string | number,
  studyModeId: '' as string | number
})

onMounted(async () => {
  try {
    const response = await axiosInstance.get<PaginatedResponse<LaravelMajor[]>>(`/api/v1/majors`);
    courses.value = response.data
  } catch (error) {
    console.error('Błąd pobierania kierunków:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
})

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(filters.search.toLowerCase())
    const matchesLevel = filters.studyLevelId === '' || course.study_level_id === Number(filters.studyLevelId)
    const matchesMode = filters.studyModeId === '' || course.study_mode_id === Number(filters.studyModeId)
    
    return matchesSearch && matchesLevel && matchesMode
  })
})
</script>