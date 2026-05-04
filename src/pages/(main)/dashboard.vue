<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// PrimeVue
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressBar from 'primevue/progressbar'

const { t } = useI18n()

// 🔹 MOCK - później podmienisz na backend
const user = ref({
    name: 'Jan Kowalski',
    course: 'Informatyka',
    progress: 65,
})

// 🔹 MOCK aplikacji
const applications = ref([
    {
        id: 1,
        course: 'Informatyka',
        level: 'I stopień',
        faculty: 'Politechniczny',
        status: 'OCZEKIWANIE',
    },
    {
        id: 2,
        course: 'Zarządzanie',
        level: 'I stopień',
        faculty: 'Społeczny',
        status: 'BRAK_OPLATY',
    },
])

// 🔹 MOCK terminów
const deadlines = ref([
    {
        id: 1,
        label: 'REJESTRACJA',
        title: 'Wszystkie kierunki I stopnia',
        date: '15 Lipca',
        progress: 100,
        color: '#ef4444',
    },
    {
        id: 2,
        label: 'EGZAMINY',
        title: 'Kierunki artystyczne',
        date: '20 Lipca',
        progress: 40,
        color: '#1e3a8a',
    },
])
</script>

<template>
    <div class="p-6 max-w-7xl mx-auto space-y-8">

        <!-- HERO -->
        <section class="bg-[#1a2b4b] rounded-3xl p-8 text-white flex justify-between items-center shadow-xl">
            <div class="space-y-3">
                <h1 class="text-3xl font-bold">
                    Witaj, {{ user.name }}
                </h1>

                <p class="text-blue-200">
                    Twoja aplikacja na:
                    <span class="text-white font-bold">
                        {{ user.course }}
                    </span>
                </p>
            </div>

            <div class="text-right">
                <p class="text-xs text-blue-300 uppercase mb-2">
                    Postęp
                </p>

                <p class="text-5xl font-light mb-2">
                    {{ user.progress }}%
                </p>

                <ProgressBar
                    :value="user.progress"
                    :showValue="false"
                    class="h-2 w-48"
                />
            </div>
        </section>

        <!-- GRID -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- LEFT -->
            <div class="lg:col-span-2 space-y-6">

                <!-- TABLE -->
                <div class="bg-white rounded-xl p-6 shadow border">
                    <h2 class="font-bold mb-4">
                        Aktywne zgłoszenia
                    </h2>

                    <DataTable :value="applications" responsiveLayout="stack">
                        <Column field="course" header="Kierunek" />
                        <Column field="faculty" header="Wydział" />

                        <Column field="status" header="Status">
                            <template #body="{ data }">
                                <span
                                    class="px-3 py-1 rounded-full text-xs font-bold"
                                    :class="{
                                        'bg-blue-100 text-blue-600': data.status === 'OCZEKIWANIE',
                                        'bg-red-100 text-red-500': data.status === 'BRAK_OPLATY'
                                    }"
                                >
                                    {{ data.status }}
                                </span>
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <!-- ALERT -->
                <div class="bg-white border-l-4 border-red-500 p-5 rounded-xl">
                    <p class="font-bold">Brakujące dokumenty</p>
                    <p class="text-sm text-gray-500">
                        Wgraj wymagane dokumenty do systemu.
                    </p>
                </div>

            </div>

            <!-- RIGHT -->
            <div class="space-y-6">

                <div class="bg-white p-6 rounded-xl border">
                    <h2 class="font-bold mb-4">Terminy</h2>

                    <div
                        v-for="d in deadlines"
                        :key="d.id"
                        class="mb-5"
                    >
                        <div class="flex justify-between text-xs mb-1">
                            <span class="text-gray-400 uppercase">
                                {{ d.label }}
                            </span>
                            <span class="text-red-500">
                                {{ d.date }}
                            </span>
                        </div>

                        <p class="font-semibold text-sm mb-2">
                            {{ d.title }}
                        </p>

                        <div class="h-1 bg-gray-100 rounded">
                            <div
                                class="h-1"
                                :style="{ width: d.progress + '%', backgroundColor: d.color }"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>