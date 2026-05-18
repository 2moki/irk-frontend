<template>
    <div class="mx-auto w-full max-w-5xl text-slate-800 transition-colors duration-200 dark:text-slate-100">

        <div class="mt-8 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
            
            <div class="mb-6 rounded-full bg-amber-50 p-6 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse">
                <i class="pi pi-cog text-5xl md:text-6xl"></i>
            </div>

            <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-3xl">
                Strona w trakcie budowy
            </h2>
            
            <p class="mt-4 max-w-md text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Aktualnie pracujemy nad ulepszeniem tej sekcji formularza. Przepraszamy za chwilowe niedogodności. Zapraszamy ponownie wkrótce!
            </p>

            <div class="mt-8 h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                <div class="h-full w-2/3 rounded-full bg-amber-500 dark:bg-amber-600"></div>
            </div>
        </div>

        <div class="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 dark:border-slate-700/50">
            <Button
                type="button"
                label="Wstecz"
                icon="pi pi-arrow-left"
                class="p-button-outlined p-button-secondary px-6 py-3 rounded-xl transition-colors duration-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                @click="handleBack"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import ApplicationHeader from '@/components/application/ApplicationHeader.vue';

const handleBack = () => {
    // Logika powrotu do poprzedniego kroku rekrutacji
    console.log('Powrót do kroku 3');
};
</script>

<style scoped>
/* Obrót zębatki dla lepszego efektu wizualnego "pracy" w tle */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
.animate-pulse {
    animation: pulse 3s infinite ease-in-out;
}
</style>