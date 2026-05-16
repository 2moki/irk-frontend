import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { ApiRecruitment, SelectedMajor } from '@/types/recruitment';

export const useMajorStore = defineStore('major', () => {
    const selectedMajors = useLocalStorage<SelectedMajor[]>('study_programs_selection', []);
    const errors = ref<string[]>([]);

    const recalculatePriorities = () => {
        selectedMajors.value.forEach((selectedMajor, index) => {
            selectedMajor.priority = index + 1;
        });
    };

    const addMajor = (newRecruitment: ApiRecruitment) => {
        const isAlreadySelected = selectedMajors.value.some((item) => item.recruitment.id === newRecruitment.id);

        if (isAlreadySelected) {
            return;
        }

        const newPriorityLevel = selectedMajors.value.length + 1;

        selectedMajors.value.push({
            recruitment: newRecruitment,
            priority: newPriorityLevel,
        });

        errors.value = [];
    };

    const removeMajor = (recruitmentIdToRemove: number) => {
        selectedMajors.value = selectedMajors.value.filter((item) => item.recruitment.id !== recruitmentIdToRemove);
        recalculatePriorities();
    };

    const updateMajorsList = (newList: SelectedMajor[]) => {
        selectedMajors.value = newList;
        recalculatePriorities();
    };

    return {
        selectedMajors,
        errors,
        addMajor,
        removeMajor,
        updateMajorsList,
    };
});
