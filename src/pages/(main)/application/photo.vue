<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/plugins/axios'; // Poprawny import domyślny
import ApplicationHeader from '@/components/application/ApplicationHeader.vue';
import Button from 'primevue/button';

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
        // await api.post('/recruitment/photo', formData);

        // 🔥 POPRAWKA 2: Przekierowanie do kolejnego kroku
        router.push('/application/documents');
    } catch (error: any) {
        errorMessage.value = error.response?.data?.message || 'Błąd podczas przesyłania zdjęcia.';
    } finally {
        isUploading.value = false;
    }
};
</script>

<template>
    <div class="mx-auto w-full max-w-5xl text-slate-800 transition-colors duration-200 dark:text-slate-100">
        <ApplicationHeader
            :current-step="3"
            :steps="10"
            title="Zdjęcie do legitymacji"
            subtitle="Fotografia kandydata"
        />

        <div class="mt-8 space-y-6">
            <div
                class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
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
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>

                    <div class="w-full flex-1">
                        <h3 class="text-lg font-semibold text-slate-800">Fotografia kandydata</h3>
                        <p class="mt-1 mb-6 text-sm text-gray-500">
                            Wgraj aktualne zdjęcie spełniające wymagania zdjęcia do dowodu osobistego lub paszportu
                            (format JPG lub PNG, maksymalny rozmiar pliku to 2MB).
                        </p>

                        <input
                            type="file"
                            ref="fileInput"
                            class="hidden"
                            accept="image/jpeg, image/png"
                            @change="handleFileChange"
                        />

                        <div class="mx-auto max-w-md">
                            <div
                                v-if="!previewUrl"
                                @click="triggerFileSelect"
                                class="cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-slate-50 p-8 text-center transition-all hover:border-blue-500 hover:bg-blue-50/30"
                            >
                                <span class="mb-3 block text-4xl">📷</span>
                                <span class="text-sm font-medium text-blue-600 hover:text-blue-700">
                                    Kliknij tutaj, aby wybrać plik z dysku
                                </span>
                                <span class="mt-1 block text-xs text-gray-400">JPG, PNG do 2MB</span>
                            </div>

                            <div
                                v-else
                                class="flex flex-col items-center rounded-xl border border-gray-200 bg-slate-50 p-4"
                            >
                                <div
                                    class="h-52 w-40 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md"
                                >
                                    <img :src="previewUrl" alt="Podgląd" class="h-full w-full object-cover" />
                                </div>
                                <button
                                    type="button"
                                    @click="removePhoto"
                                    class="mt-4 flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                                >
                                    ❌ Usuń i wybierz inne zdjęcie
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

            <div class="flex items-center justify-between">
                <Button
                    :label="$t('stepperPagination.back')"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    outlined
                    class="rounded-lg px-6 py-3 font-bold"
                    :disabled="isUploading"
                    @click="router.push('/application/education')"
                />
                <Button
                    :label="isUploading ? 'Przesyłanie...' : $t('stepperPagination.next')"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="rounded-lg px-10 py-3 text-lg font-bold shadow-lg"
                    :disabled="!selectedFile || isUploading"
                    @click="submitPhoto"
                />
            </div>
        </div>
    </div>
</template>
