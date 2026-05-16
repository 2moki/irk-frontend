import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useApplicationStore = defineStore('application', () => {
    // Krok 4: Dokumenty i szkoła
    const step4Data = ref({
        school: '',
        maturityType: '',
        docNumber: '',
        docYear: '',
        docIssuer: ''
    });

    // Miejsce na kolejne kroki w przyszłości...
    // const step5Data = ref({ ... });

    // Funkcja do aktualizacji konkretnego kroku
    const updateStep4 = (data: typeof step4Data.value) => {
        step4Data.value = { ...data };
    };

    // Resetowanie całego formularza po udanej rejestracji
    const resetStore = () => {
        step4Data.value = {
            school: '',
            maturityType: '',
            docNumber: '',
            docYear: '',
            docIssuer: ''
        };
    };

    return {
        step4Data,
        updateStep4,
        resetStore
    };
}, {
    persist: true // 🔥 Wtyczka automatycznie zapisze to w localStorage pod kluczem 'application'
});