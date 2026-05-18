<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios'; // Poprawny import domyślny

const router = useRouter();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isUploading = ref(false);
const errorMessage = ref<string | null>(null);

const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; 

const triggerFileSelect = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
        errorMessage.value = 'Dozwolone formaty to JPG i PNG.';
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        errorMessage.value = 'Zdjęcie jest za duże. Maksymalny rozmiar to 2MB.';
        return;
    }

    errorMessage.value = null;
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
};

const removePhoto = () => {
    selectedFile.value = null;
    previewUrl.value = null;
    if (fileInput.value) fileInput.value.value = '';
};

const submitPhoto = async () => {
    if (!selectedFile.value) {
        errorMessage.value = 'Wybierz zdjęcie przed przejściem dalej.';
        return;
    }

    isUploading.value = true;
    errorMessage.value = null;

    const formData = new FormData();
    formData.append('photo', selectedFile.value);

    try {
        // 🔥 POPRAWKA 1: Używamy instancji 'api' i skróconej ścieżki (bo /api jest już w baseURL)
        await api.post('/recruitment/photo', formData);
        
        // 🔥 POPRAWKA 2: Przekierowanie do kolejnego kroku (Step6) zamiast profilu
        router.push('/recruitment/Step6'); 
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Błąd podczas przesyłania zdjęcia.';
    } finally {
        isUploading.value = false;
    }
};
</script>

<template>
    <div class="max-w-4xl mx-auto p-6 text-slate-800">
        <div class="flex justify-between items-end mb-2">
            <div>
                <span class="text-blue-600 font-bold text-xs uppercase tracking-wider">KROK 5 Z 10</span>
                <h1 class="text-2xl font-bold text-[#1d2d5b] mt-1">Zdjęcie do legitymacji</h1>
            </div>
            <span class="text-xs text-gray-400 font-medium">Postęp aplikacji</span>
        </div>

        <div class="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div class="bg-[#1d2d5b] h-2 rounded-full transition-all duration-300" style="width: 50%"></div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div class="flex items-start gap-4">
                <div class="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                
                <div class="flex-1 w-full">
                    <h3 class="text-lg font-semibold text-slate-800">Fotografia kandydata</h3>
                    <p class="text-sm text-gray-500 mt-1 mb-6">
                        Wgraj aktualne zdjęcie spełniające wymagania zdjęcia do dowodu osobistego lub paszportu (format JPG lub PNG, maksymalny rozmiar pliku to 2MB).
                    </p>

                    <input 
                        type="file" 
                        ref="fileInput" 
                        class="hidden" 
                        accept="image/jpeg, image/png"
                        @change="handleFileChange" 
                    />

                    <div class="max-w-md mx-auto">
                        <div 
                            v-if="!previewUrl"
                            @click="triggerFileSelect"
                            class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:border-blue-500 hover:bg-blue-50/30 transition-all"
                        >
                            <span class="text-4xl block mb-3">📷</span>
                            <span class="text-sm font-medium text-blue-600 hover:text-blue-700">
                                Kliknij tutaj, aby wybrać plik z dysku
                            </span>
                            <span class="block text-xs text-gray-400 mt-1">JPG, PNG do 2MB</span>
                        </div>

                        <div v-else class="flex flex-col items-center border border-gray-200 rounded-xl p-4 bg-slate-50">
                            <div class="w-40 h-52 overflow-hidden rounded-lg shadow-md bg-white border border-gray-300">
                                <img :src="previewUrl" alt="Podgląd" class="w-full h-full object-cover" />
                            </div>
                            <button 
                                type="button" 
                                @click="removePhoto" 
                                class="mt-4 text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                                ❌ Usuń i wybierz inne zdjęcie
                            </button>
                        </div>
                    </div>

                    <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {{ errorMessage }}
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-between items-center mt-8">
            <button 
                type="button" 
                class="border border-gray-300 text-gray-700 bg-white rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors text-sm font-medium"
                :disabled="isUploading"
                @click="router.push('/recruitment/Step4')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Wstecz
            </button>
            
            <button 
                type="button" 
                class="bg-[#1d2d5b] text-white rounded-lg px-5 py-2.5 flex items-center gap-2 hover:bg-[#152244] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
                :disabled="!selectedFile || isUploading"
                @click="submitPhoto"
            >
                <span>{{ isUploading ? 'Przesyłanie...' : 'Zapisz i kontynuuj' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    </div>
</template>