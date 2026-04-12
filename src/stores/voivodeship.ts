import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Voivodeship } from '@/types/address.ts';
import { axiosInstance } from '@/services/api/axiosInstance.ts';
import { useLanguageStore } from '@/stores/language.ts';

export const useVoivodeshipStore = defineStore('voivodeship', () => {
    const voivodeships = ref<Array<Voivodeship>>([]);

    const fetchVoivodeships = async () => {
        if (voivodeships.value.length > 0) return;

        try {
            const res = await axiosInstance.get('api/v1/voivodeships');
            voivodeships.value = res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const getLocalizedVoivodeships = () => {
        const languageStore = useLanguageStore();
        const lang = languageStore.currentLocale;

        return [...voivodeships.value]
            .map((voivodeship) => ({
                id: voivodeship.id,
                name: lang === 'pl' ? voivodeship.name_pl : voivodeship.name_en,
            }))
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), lang));
    };

    return {
        voivodeships,
        fetchVoivodeships,
        getLocalizedVoivodeships,
    };
});
