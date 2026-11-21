<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ApplicationHeader from '@/components/application/ApplicationHeader.vue';
import api from '@/plugins/axios';

interface DocumentItem {
    id: string | number;
    thumbnail_url: string;
    full_url: string;
}

interface ApiDocument {
    id: string | number;
    thumbnail_url?: string;
    full_url?: string;
}

interface DocumentsPayload {
    data?: ApiDocument[];
}

const router = useRouter();
const documents = ref<DocumentItem[]>([]);
const isLoading = ref(false);
const errorMessage = ref<string | null>(null);

const goBack = () => {
    router.back();
};

const openFullDocument = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

const parseDocumentsFromResponse = (rawData: unknown): ApiDocument[] => {
    if (typeof rawData === 'string') {
        const headerSeparatorIndex = rawData.indexOf('\r\n\r\n');
        const bodyText =
            headerSeparatorIndex !== -1
                ? rawData.slice(headerSeparatorIndex + 4).trim()
                : rawData.slice(rawData.indexOf('{')).trim();

        const parsed = JSON.parse(bodyText) as DocumentsPayload | ApiDocument[];
        if (Array.isArray(parsed)) {
            return parsed;
        }
        return Array.isArray(parsed.data) ? parsed.data : [];
    }

    if (rawData && typeof rawData === 'object') {
        const obj = rawData as DocumentsPayload;
        return Array.isArray(obj.data) ? obj.data : [];
    }

    return [];
};

const getPhotos = async () => {
    isLoading.value = true;
    errorMessage.value = null;

    try {
        const result = await api.get('v1/documents');
        const data = parseDocumentsFromResponse(result.data);

        const mappedDocuments: DocumentItem[] = data.map((item) => ({
            id: item.id,
            thumbnail_url: item.thumbnail_url ?? '',
            full_url: item.full_url ?? '',
        }));

        documents.value = mappedDocuments;

        console.log(documents.value);
    } catch (error) {
        console.error('Błąd pobierania dokumentów:', error);
        errorMessage.value = 'Nie udało się pobrać dokumentów.';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <ApplicationHeader
        :current-step="6"
        :steps="10"
        :title="$t('language_selection.title')"
        :subtitle="$t('language_selection.subtitle')"
    />

    <div class="space-y-8">
        <p v-if="errorMessage" class="text-sm font-medium text-red-600">
            {{ errorMessage }}
        </p>

        <div v-if="documents.length > 0" class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            <button
                v-for="doc in documents"
                :key="doc.id"
                type="button"
                class="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm transition hover:border-primary-500"
                @click="openFullDocument(doc.full_url)"
            >
                <img
                    :src="doc.thumbnail_url"
                    :alt="`Dokument #${doc.id}`"
                    class="h-44 w-full object-cover transition group-hover:scale-105"
                    loading="lazy"
                />
                <span
                    class="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white"
                >
                    Pełny rozmiar
                </span>
            </button>
        </div>

        <div class="flex items-center justify-between">
            <Button
                :label="$t('stepperPagination.back')"
                icon="pi pi-arrow-left"
                severity="secondary"
                outlined
                class="rounded-lg px-6 py-3 font-bold"
                @click="goBack"
            />
            <Button
                :label="$t('stepperPagination.next')"
                icon="pi pi-arrow-right"
                iconPos="right"
                :loading="isLoading"
                class="rounded-lg px-10 py-3 text-lg font-bold shadow-lg"
                @click="getPhotos"
            />
        </div>
    </div>
</template>