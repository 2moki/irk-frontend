import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { useMajorStore } from '@/stores/major';
import { axiosInstance } from '@/services/api/axiosInstance';
import type { Language, LanguageSelection } from '@/types/recruitment';

export const useApplicationLanguagesStore = defineStore('applicationLanguages', () => {
    const majorStore = useMajorStore();

    const selections = useLocalStorage<LanguageSelection[]>('application_languages_selection', []);

    const findExisting = (recruitmentId: number) => {
        return selections.value.find((selection) => selection.recruitmentId === recruitmentId);
    };

    const fetchLanguagesForMajor = async (recruitmentId: number, majorId: number) => {
        const response = await axiosInstance.get(`/api/v1/majors/${majorId}`, {
            params: { include: 'languages' },
        });

        const majorData = response.data.data ?? response.data;
        const rawLanguages = majorData.languages ?? [];

        const languages: Language[] = [];
        for (let i = 0; i < rawLanguages.length; i++) {
            languages.push({
                id: rawLanguages[i].id,
                name: rawLanguages[i].name,
                priority: i + 1,
            });
        }

        return {
            recruitmentId,
            orderedLanguages: languages,
        } as LanguageSelection;
    };

    const fetchLanguages = async () => {
        const results: LanguageSelection[] = [];

        for (const selected of majorStore.selectedMajors) {
            const majorId = selected.recruitment.major?.id;
            if (!majorId) continue;

            const existing = findExisting(selected.recruitment.id);
            if (existing && existing.orderedLanguages.length > 0) {
                results.push(existing);
                continue;
            }

            try {
                const entry = await fetchLanguagesForMajor(selected.recruitment.id, majorId);
                results.push(entry);
            } catch {
                console.error(`Failed to fetch languages for major #${majorId}`);
            }
        }

        selections.value = results;
    };

    const updateLanguageOrder = (recruitmentId: number, newOrder: Language[]) => {
        const updated: LanguageSelection[] = [];

        for (const selection of selections.value) {
            if (selection.recruitmentId !== recruitmentId) {
                updated.push(selection);
                continue;
            }

            const reordered: Language[] = [];
            for (let i = 0; i < newOrder.length; i++) {
                const lang = newOrder[i];
                if (lang) {
                    reordered.push({ ...lang, priority: i + 1 });
                }
            }

            updated.push({ recruitmentId, orderedLanguages: reordered });
        }

        selections.value = updated;
    };

    return {
        selections,
        fetchLanguages,
        updateLanguageOrder,
    };
});
