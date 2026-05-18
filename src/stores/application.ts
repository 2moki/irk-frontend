import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useApplicationStore = defineStore(
    'application',
    () => {
        // Krok 4: Dokumenty i szkoła (rozbudowany o nowe pola z formularza)
        const step4Data = ref({
            school: null as any,
            hasCustomSchool: false,
            school_custom_name: '',
            maturityType: '',
            country: 'Polska' as any,
            docNumber: '',
            docYear: '',
            docIssuer: '',
        });

        // Akcja do dynamicznego pobierania szkół z bazy danych przez API
        const fetchSchoolsFromApi = async (searchQuery: string) => {
            try {
                // Podmień poniższy URL na faktyczny punkt końcowy (endpoint) Twojego API
                const response = await fetch(`/api/schools?search=${encodeURIComponent(searchQuery)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Jeśli API wymaga autoryzacji tokenem, odkomentuj poniższą linię:
                        // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
                    }
                });

                if (!response.ok) {
                    throw new Error(`Błąd serwera: ${response.status}`);
                }

                const data = await response.json();
                
                // Zwracamy tablicę obiektów ze szkołami (np. [{ id: 1, name: '...' }])
                return data; 
            } catch (error) {
                console.error('Błąd podczas pobierania szkół z API:', error);
                return []; // Zwracamy pustą tablicę w razie błędu, żeby aplikacja się nie zawiesiła
            }
        };

        // Funkcja do aktualizacji konkretnego kroku
        const updateStep4 = (data: typeof step4Data.value) => {
            step4Data.value = { ...data };
        };

        // Resetowanie całego formularza po udanej rejestracji
        const resetStore = () => {
            step4Data.value = {
                school: null,
                hasCustomSchool: false,
                school_custom_name: '',
                maturityType: '',
                country: 'Polska',
                docNumber: '',
                docYear: '',
                docIssuer: '',
            };
        };

        return {
            step4Data,
            fetchSchoolsFromApi,
            updateStep4,
            resetStore,
        };
    },
    {
        persist: true, // 🔥 Wtyczka automatycznie zapisze to w localStorage pod kluczem 'application'
    },
);