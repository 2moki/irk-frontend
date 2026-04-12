import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Country } from '@/types/address.ts';
import { axiosInstance } from '@/services/api/axiosInstance.ts';
import { useLanguageStore } from '@/stores/language.ts';

export const useCountryStore = defineStore('country', () => {
    const countries = ref<Array<Country>>([]);
    const polandId = ref<number>();

    const fetchCountries = async () => {
        if (countries.value.length > 0) return;

        try {
            const res = await axiosInstance.get('api/v1/countries');
            countries.value = res.data;

            await fetchPolandId();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPolandId = async () => {
        if (polandId.value !== undefined) return;

        try {
            const res = await axiosInstance.get('api/v1/countries/PL');
            polandId.value = res.data.id;
        } catch (error) {
            console.error(error);
        }
    };

    const getLocalizedCountries = () => {
        const languageStore = useLanguageStore();
        const lang = languageStore.currentLocale;

        return [...countries.value]
            .map((country) => ({
                id: country.id,
                code: country.code,
                name: lang === 'pl' ? country.name_pl : country.name_en,
            }))
            .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), lang));
    };

    const isPoland = (countryId: number | null) => {
        if (countryId === null) return false;

        return countries.value.find((country) => country.id === countryId)?.code === 'PL';
    };

    return {
        countries,
        polandId,
        isPoland,
        fetchCountries,
        getLocalizedCountries,
    };
});
