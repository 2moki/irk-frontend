import { defineStore } from 'pinia';

export const useEducationFormStore = defineStore('educationForm', {
    state: () => ({
        formData: {
            school: null,
            hasCustomSchool: false,
            school_custom_name: '',
            maturityType: '',
            country: null,
            docNumber: '',
            docYear: '',
            docIssuer: '',
        },
    }),
    actions: {
        saveEducationStep(data: any) {
            this.formData = { ...this.formData, ...data };
            // Tutaj możesz też od razu strzelić do API, jeśli chcesz zapisywać w locie
        },
    },
    persist: true, // Jeśli używasz pluginu pinia-plugin-persistedstate do cache w localStorage
});
