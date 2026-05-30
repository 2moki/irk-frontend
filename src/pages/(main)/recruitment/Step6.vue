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
        if (!uploadedFiles.value.some((f) => f.name === file.name)) {
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
    <div class="mx-auto max-w-4xl p-6 text-slate-800">
        <div class="mb-2 flex items-end justify-between">
            <div>
                <span class="text-xs font-bold tracking-wider text-blue-600 uppercase">KROK 6 Z 10</span>
                <h1 class="mt-1 text-2xl font-bold text-[#1d2d5b]">Skany dokumentów</h1>
            </div>
            <span class="text-xs font-medium text-gray-400">Postęp aplikacji</span>
        </div>

        <div class="mb-8 h-2 w-full rounded-full bg-gray-200">
            <div class="h-2 rounded-full bg-[#1d2d5b] transition-all duration-300" style="width: 60%"></div>
        </div>

        <div class="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>

                <div class="w-full flex-1">
                    <h3 class="text-lg font-semibold text-slate-800">Wymagane dokumenty</h3>
                    <p class="mt-1 mb-6 text-sm text-gray-500">
                        Proszę przesłać czytelne skany lub zdjęcia dokumentów potwierdzających wykształcenie (np.
                        świadectwo dojrzałości). Akceptowane formaty: PDF, JPG, PNG. Maksymalny rozmiar jednego pliku:
                        5MB.
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
                        class="mb-6 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 p-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50/30"
                    >
                        <span class="mb-3 block text-4xl">📁</span>
                        <span class="text-sm font-medium text-blue-600 hover:text-blue-700">
                            Kliknij tutaj, aby wybrać pliki z dysku
                        </span>
                        <span class="mt-1 block text-xs text-gray-400"
                            >Możesz wybrać kilka plików jednocześnie (PDF, JPG, PNG do 5MB)</span
                        >
                    </div>

                    <div v-if="uploadedFiles.length > 0" class="space-y-2">
                        <h4 class="mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                            Lista wybranych plików ({{ uploadedFiles.length }}):
                        </h4>
                        <div
                            v-for="(file, index) in uploadedFiles"
                            :key="file.name"
                            class="flex items-center justify-between rounded-lg border border-gray-200 bg-slate-50 p-3 text-sm"
                        >
                            <div class="flex items-center gap-3 truncate pr-4">
                                <span class="shrink-0 text-xl">{{
                                    file.type === 'application/pdf' ? '📕' : '🖼️'
                                }}</span>
                                <div class="truncate">
                                    <p class="truncate font-medium text-slate-700">{{ file.name }}</p>
                                    <p class="text-xs text-gray-400">{{ formatSize(file.size) }}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="removeFile(index)"
                                class="shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                                title="Usuń plik"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div
                        v-if="errorMessage"
                        class="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600"
                    >
                        {{ errorMessage }}
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 flex items-center justify-between">
            <button
                type="button"
                class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                :disabled="isUploading"
                @click="router.push('/recruitment/Step5')"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Wstecz
            </button>

            <button
                type="button"
                class="flex items-center gap-2 rounded-lg bg-[#1d2d5b] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#152244] disabled:cursor-not-allowed disabled:bg-gray-300"
                :disabled="uploadedFiles.length === 0 || isUploading"
                @click="submitDocuments"
            >
                <span>{{ isUploading ? 'Przesyłanie...' : 'Zapisz i kontynuuj' }}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>
