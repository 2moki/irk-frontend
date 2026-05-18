<script setup lang="ts">
import { computed } from 'vue';

// Definiujemy propsy dokładnie pod wymagania z feedbacku Twojego lidera
const props = defineProps({
    currentStep: {
        type: Number,
        required: true
    },
    steps: {
        type: Number,
        default: 10
    },
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    }
});

// Obliczamy procentowy postęp paska ładowania
const progressPercentage = computed(() => {
    return Math.min(Math.max((props.currentStep / props.steps) * 100, 0), 100);
});
</script>

<template>
    
        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div class="space-y-1">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ title }}</h2>
                <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400">{{ subtitle }}</p>
            </div>
            
            <div class="flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold self-start md:self-auto shrink-0 dark:bg-blue-950/40 dark:text-blue-400">
                <span>Krok {{ currentStep }} z {{ steps }}</span>
            </div>
        </div>

        <div class="mt-5">
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden dark:bg-slate-700">
                <div 
                    class="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out dark:bg-blue-500"
                    :style="{ width: `${progressPercentage}%` }"
                ></div>
            </div>
        </div>
</template>