<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios';

const router = useRouter();

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFiles = ref<File[]>([]);
const isUploading = ref(false);
const errorMessage = ref<string | null>(null);

// Dla dokumentów pozwalamy na PDF, JPG i PNG oraz zwiększamy limit do 5MB per plik
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

const triggerFileSelect = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (!files) return;

    errorMessage.value = null;

    // Przetwarzanie wielu plików na raz
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!ALLOWED_TYPES.includes(file.type)) {
            errorMessage.value = `Plik "${file.name}" ma niepoprawny format. Akceptujemy tylko PDF, JPG, PNG.`;
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            errorMessage.value = `Plik "${file.name}" przekracza maksymalny rozmiar 5MB.`;
            return;
        }

        // Unikanie duplikatów o tej samej nazwie
        if (!uploadedFiles.value.some(f => f.name === file.name)) {
            uploadedFiles.value.push(file);
        }
    }

    // Reset natywnego inputa, aby można było wybrać ten sam plik ponownie w razie usunięcia
    if (fileInput.value) fileInput.value.value = '';
};

const removeFile = (index: number) => {
    uploadedFiles.value.splice(index, 1);
};

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const submitDocuments = async () => {
    if (uploadedFiles.value.length === 0) {
        errorMessage.value = 'Wgraj przynajmniej jeden dokument przed przejściem dalej.';
        return;
    }

    isUploading.value = true;
    errorMessage.value = null;

    const formData = new FormData();
    // Dodajemy wszystkie pliki do tablicy w FormData (backend powinien odbierać np. 'documents[]')
    uploadedFiles.value.forEach((file) => {
        formData.append('documents[]', file);
    });

    try {
        // Endpoint dostosowany pod Twój backend dla skanów dokumentów
        await api.post('/recruitment/documents', formData);
        
        // Po udanym uplodzie idziemy dalej (np. profil lub Krok 7)
        router.push('/recruitment/profile'); 
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Błąd podczas przesyłania dokumentów.';
    } finally {
        isUploading.value = false;
    }
};
</script>

<template>
    <div class="max-w-4xl mx-auto p-6 text-slate-800">
        <div class="flex justify-between items-end mb-2">
            <div>
                <span class="text-blue-600 font-bold text-xs uppercase tracking-wider">KROK 6 Z 10</span>
                <h1 class="text-2xl font-bold text-[#1d2d5b] mt-1">Skany dokumentów</h1>
            </div>
            <span class="text-xs text-gray-400 font-medium">Postęp aplikacji</span>
        </div>

        <div class="w-full bg-gray-200 h-2 rounded-full mb-8">
            <div class="bg-[#1d2d5b] h-2 rounded-full transition-all duration-300" style="width: 60%"></div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div class="flex items-start gap-4">
                <div class="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                
                <div class="flex-1 w-full">
                    <h3 class="text-lg font-semibold text-slate-800">Wymagane dokumenty</h3>
                    <p class="text-sm text-gray-500 mt-1 mb-6">
                        Proszę przesłać czytelne skany lub zdjęcia dokumentów potwierdzających wykształcenie (np. świadectwo dojrzałości). Akceptowane formaty: PDF, JPG, PNG. Maksymalny rozmiar jednego pliku: 5MB.
                    </p>

                    <input 
                        type="file" 
                        ref="fileInput" 
                        class="hidden" 
                        accept="application/pdf, image/jpeg, image/png"
                        multiple
                        @change="handleFileChange" 
                    />

                    <div 
                        @click="triggerFileSelect"
                        class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:border-blue-500 hover:bg-blue-50/30 transition-all mb-6"
                    >
                        <span class="text-4xl block mb-3">📁</span>
                        <span class="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Kliknij tutaj, aby wybrać pliki z dysku
                        </span>
                        <span class="block text-xs text-gray-400 mt-1">Możesz wybrać kilka plików jednocześnie (PDF, JPG, PNG do 5MB)</span>
                    </div>

                    <div v-if="uploadedFiles.length > 0" class="space-y-2">
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Lista wybranych plików ({{ uploadedFiles.length }}):</h4>
                        <div 
                            v-for="(file, index) in uploadedFiles" 
                            :key="file.name"
                            class="flex items-center justify-between p-3 bg-slate-50 border border-gray-200 rounded-lg text-sm"
                        >
                            <div class="flex items-center gap-3 truncate pr-4">
                                <span class="text-xl shrink-0">{{ file.type === 'application/pdf' ? '📕' : '🖼️' }}</span>
                                <div class="truncate">
                                    <p class="font-medium text-slate-700 truncate">{{ file.name }}</p>
                                    <p class="text-xs text-gray-400">{{ formatSize(file.size) }}</p>
                                </div>
                            </div>
                            
                            <button 
                                type="button" 
                                @click="removeFile(index)"
                                class="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-100 transition-colors shrink-0"
                                title="Usuń plik"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
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
                @click="router.push('/recruitment/Step5')"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Wstecz
            </button>
            
            <button 
                type="button" 
                class="bg-[#1d2d5b] text-white rounded-lg px-5 py-2.5 flex items-center gap-2 hover:bg-[#152244] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm"
                :disabled="uploadedFiles.length === 0 || isUploading"
                @click="submitDocuments"
            >
                <span>{{ isUploading ? 'Przesyłanie...' : 'Zapisz i kontynuuj' }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>
        </div>
    </div>
</template>