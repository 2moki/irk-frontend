<template>
    <div
        class="mx-auto w-full max-w-5xl bg-[#f8fafc] p-6 text-slate-800 transition-colors duration-200 md:p-8 dark:bg-slate-900 dark:text-slate-100"
    >
        <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <span class="text-xs font-bold tracking-wider text-blue-900 uppercase dark:text-blue-400"
                    >Krok 4 z 10</span
                >
                <h1 class="mt-1 text-3xl font-bold text-[#1e293b] dark:text-white">Wybór Dokumentu i Szkoły</h1>
            </div>
            <div class="flex flex-col items-end gap-1">
                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Postęp aplikacji</span>
                <div class="h-1.5 w-40 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                    <div class="h-full w-2/5 bg-[#11224d] dark:bg-blue-500"></div>
                </div>
            </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
            <div
                class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
                <div class="mb-2 flex items-center gap-3">
                    <div class="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                            />
                        </svg>
                    </div>
                    <h2 class="text-lg font-bold text-[#1e293b] dark:text-white">Szkoła Ponadpodstawowa</h2>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >Wyszukaj szkołę średnią (Kalisz)</label
                    >
                    <div class="p-autocomplete-custom relative w-full">
                        <span
                            class="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-gray-400 dark:text-gray-500"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </span>

                        <AutoComplete
                            v-model="formData.school"
                            :suggestions="filteredSchools"
                            optionLabel="name"
                            placeholder="Wpisz nazwę, np. Asnyk, III LO, Technikum..."
                            @complete="searchSchool"
                            @change="errors.school = ''"
                            dropdown
                            class="w-full"
                            :inputClass="[
                                'w-full pl-11 pr-4 py-3 bg-[#e2e8f0]/50 dark:bg-slate-700/50 border rounded-xl outline-none transition text-sm text-slate-800 dark:text-slate-100',
                                errors.school
                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50'
                                    : 'border-transparent dark:border-slate-600 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900',
                            ]"
                        />
                    </div>
                    <span v-if="errors.school" class="mt-0.5 pl-1 text-xs font-medium text-red-500">{{
                        errors.school
                    }}</span>
                    <p class="mt-1 text-xs text-gray-400 italic dark:text-gray-500">
                        Jeśli Twojej szkoły nie ma na liście, skontaktuj się z biurem rekrutacji.
                    </p>
                </div>
            </div>

            <div
                class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
                <div class="mb-2 flex items-center gap-3">
                    <div class="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                        </svg>
                    </div>
                    <h2 class="text-lg font-bold text-[#1e293b] dark:text-white">Typ Dokumentu</h2>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >Rodzaj świadectwa maturalnego</label
                        >
                        <div class="relative">
                            <select
                                v-model="formData.maturityType"
                                @change="handleMaturityChange"
                                :class="[
                                    'w-full cursor-pointer appearance-none rounded-xl border bg-[#e2e8f0]/50 px-4 py-3 text-sm text-gray-700 transition outline-none dark:bg-slate-700/50 dark:text-gray-300',
                                    errors.maturityType
                                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:focus:bg-slate-700',
                                ]"
                            >
                                <option value="" disabled selected>Wybierz typ matury...</option>
                                <option value="new_matura">Nowa matura (od 2005 r.)</option>
                                <option value="old_matura_pre_1991">Stara matura (do 1991 r.)</option>
                                <option value="old_matura_post_1991">Stara matura (1992 - 2004 r.)</option>
                                <option value="international_baccalaureate">Matura Międzynarodowa (IB)</option>
                                <option value="european_baccalaureate">Matura Europejska (EB)</option>
                                <option value="foreign">Świadectwo uzyskane za granicą</option>
                            </select>
                            <span
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 dark:text-gray-400"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    stroke-width="2.5"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </div>
                        <span v-if="errors.maturityType" class="mt-0.5 pl-1 text-xs font-medium text-red-500">{{
                            errors.maturityType
                        }}</span>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >Kraj wydania dokumentu</label
                        >
                        <div class="p-autocomplete-custom relative w-full">
                            <AutoComplete
                                v-if="isForeignMatura"
                                v-model="formData.country"
                                :suggestions="filteredCountries"
                                placeholder="Wpisz lub wybierz kraj, np. Niemcy"
                                @complete="searchCountry"
                                @change="errors.country = ''"
                                dropdown
                                class="w-full"
                                :inputClass="[
                                    'w-full px-4 py-3 bg-[#e2e8f0]/50 dark:bg-slate-700/50 border rounded-xl outline-none transition text-sm text-slate-800 dark:text-slate-100',
                                    errors.country
                                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-transparent dark:border-slate-600 focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
                                ]"
                            />

                            <div v-else>
                                <input
                                    type="text"
                                    value="Polska"
                                    disabled
                                    class="w-full cursor-not-allowed rounded-xl border border-transparent bg-[#e2e8f0]/30 py-3 pr-11 pl-4 text-sm font-medium text-gray-400 dark:border-slate-700 dark:bg-slate-700/20 dark:text-gray-500"
                                />
                                <span
                                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-600"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <span
                            v-if="errors.country && isForeignMatura"
                            class="mt-0.5 pl-1 text-xs font-medium text-red-500"
                            >{{ errors.country }}</span
                        >
                    </div>
                </div>
            </div>

            <div
                class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
                <div class="mb-2 flex items-center gap-3">
                    <div class="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h2 class="text-lg font-bold text-[#1e293b] dark:text-white">Szczegóły Świadectwa</h2>
                </div>

                <div class="mb-2 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Numer Dokumentu</label>
                        <input
                            v-model="formData.docNumber"
                            @input="errors.docNumber = ''"
                            placeholder="np. ABC 123456"
                            :class="[
                                'w-full rounded-xl border bg-[#e2e8f0]/50 px-4 py-3 text-sm text-slate-800 placeholder-gray-400 transition outline-none dark:bg-slate-700/50 dark:text-white dark:placeholder-gray-500',
                                errors.docNumber
                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:focus:bg-slate-700',
                            ]"
                        />
                        <span v-if="errors.docNumber" class="mt-0.5 pl-1 text-xs font-medium text-red-500">{{
                            errors.docNumber
                        }}</span>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Rok Wydania</label>
                        <input
                            v-model="formData.docYear"
                            @input="errors.docYear = ''"
                            placeholder="2026"
                            :class="[
                                'w-full rounded-xl border bg-[#e2e8f0]/50 px-4 py-3 text-sm text-slate-800 placeholder-gray-400 transition outline-none dark:bg-slate-700/50 dark:text-white dark:placeholder-gray-500',
                                errors.docYear
                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:focus:bg-slate-700',
                            ]"
                        />
                        <span v-if="errors.docYear" class="mt-0.5 pl-1 text-xs font-medium text-red-500">{{
                            errors.docYear
                        }}</span>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Organ Wydający</label>
                        <input
                            v-model="formData.docIssuer"
                            @input="errors.docIssuer = ''"
                            placeholder="np. OKE w Poznaniu"
                            :class="[
                                'w-full rounded-xl border bg-[#e2e8f0]/50 px-4 py-3 text-sm text-slate-800 placeholder-gray-400 transition outline-none dark:bg-slate-700/50 dark:text-white dark:placeholder-gray-500',
                                errors.docIssuer
                                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:focus:bg-slate-700',
                            ]"
                        />
                        <span v-if="errors.docIssuer" class="mt-0.5 pl-1 text-xs font-medium text-red-500">{{
                            errors.docIssuer
                        }}</span>
                    </div>
                </div>

                <div
                    class="flex items-start gap-3 rounded-xl border border-gray-200/50 bg-[#e2e8f0]/40 p-4 dark:border-slate-700/50 dark:bg-slate-900/30"
                >
                    <span class="mt-0.5 shrink-0 text-slate-700 dark:text-slate-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </span>
                    <p class="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                        Prosimy o dokładne wprowadzenie danych zgodnie z oryginałem świadectwa. Błędne dane mogą
                        skutkować odrzuceniem wniosku na etapie weryfikacji dokumentów papierowych.
                    </p>
                </div>
            </div>

            <div class="flex items-center justify-between pt-4">
                <button
                    type="button"
                    @click="handleBack"
                    class="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 active:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Wstecz
                </button>

                <button
                    type="submit"
                    class="flex items-center gap-2 rounded-xl bg-[#11224d] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1a316c] active:bg-[#0b1633] dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                    Zapisz i kontynuuj
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApplicationStore } from '@/stores/application';

const toast = useToast();
const appStore = useApplicationStore();

// Baza 55 państw do filtrowania wyszukiwarki
const countriesList = [
    'Albania',
    'Algieria',
    'Argentyna',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbejdżan',
    'Belgia',
    'Białoruś',
    'Brazylia',
    'Bułgaria',
    'Chiny',
    'Chorwacja',
    'Cypr',
    'Czechy',
    'Dania',
    'Egipt',
    'Estonia',
    'Finlandia',
    'Francja',
    'Grecja',
    'Gruzja',
    'Hiszpania',
    'Holandia',
    'Indie',
    'Irlandia',
    'Islandia',
    'Izrael',
    'Japonia',
    'Kanada',
    'Kazachstan',
    'Korea Południowa',
    'Litwa',
    'Luksemburg',
    'Łotwa',
    'Malta',
    'Maroko',
    'Mołdawia',
    'Monako',
    'Niemcy',
    'Norwegia',
    'Nowa Zelandia',
    'Portugalia',
    'Rumunia',
    'San Marino',
    'Słowacja',
    'Słowenia',
    'Stany Zjednoczone',
    'Szwajcaria',
    'Szwecja',
    'Turcja',
    'Ukraina',
    'Watykan',
    'Węgry',
    'Wielka Brytania',
    'Włochy',
];

// Lista szkół średnich w Kaliszu
const kaliszSchools = [
    { id: 1, name: 'I Liceum Ogólnokształcące im. Adama Asnyka w Kaliszu' },
    { id: 2, name: 'II Liceum Ogólnokształcące im. Tadeusza Kościuszki w Kaliszu' },
    { id: 3, name: 'III Liceum Ogólnokształcące im. Mikołaja Kopernika w Kaliszu' },
    { id: 4, name: 'IV Liceum Ogólnokształcące im. Ignacego Jana Paderewskiego w Kaliszu' },
    { id: 5, name: 'V Liceum Ogólnokształcące im. Jana Pawła II w Kaliszu' },
    { id: 6, name: 'Technikum im. św. Józefa w Kaliszu' },
    { id: 7, name: 'Zespół Szkół Techniczno-Elektronicznych w Kaliszu (ZSTE)' },
    { id: 8, name: 'Zespół Szkół Ekonomicznych im. gen. Mieczysława Smorawińskiego w Kaliszu' },
    { id: 9, name: 'Zespół Szkół Gastronomiczno-Hotelarskich w Kaliszu' },
    { id: 10, name: 'Zespół Szkół Ponadpodstawowych im. Józefa Marczewskiego w Kaliszu' },
];

// Główne dane formularza
const formData = reactive({
    school: null,
    maturityType: '',
    country: 'Polska',
    docNumber: '',
    docYear: '',
    docIssuer: '',
});

// Obiekt przechowujący komunikaty błędów
const errors = reactive({
    school: '',
    maturityType: '',
    country: '',
    docNumber: '',
    docYear: '',
    docIssuer: '',
});

const filteredSchools = ref([]);
const filteredCountries = ref([]);

// Czy wybrana matura wymaga wpisania kraju innego niż Polska
const isForeignMatura = computed(() => {
    return ['international_baccalaureate', 'european_baccalaureate', 'foreign'].includes(formData.maturityType);
});

// Reakcja na zmianę rodzaju świadectwa
const handleMaturityChange = () => {
    errors.maturityType = '';
    if (!isForeignMatura.value) {
        formData.country = 'Polska';
        errors.country = '';
    } else if (formData.country === 'Polska') {
        formData.country = ''; // czyszczenie pola, by wymusić poprawny wybór z listy
    }
};

// Inicjalizacja stanu na podstawie danych ze Store Pinii
onMounted(() => {
    if (appStore.step4Data) {
        formData.maturityType = appStore.step4Data.maturityType || '';
        formData.docNumber = appStore.step4Data.docNumber || '';
        formData.docYear = appStore.step4Data.docYear || '';
        formData.docIssuer = appStore.step4Data.docIssuer || '';
        formData.school = appStore.step4Data.school || null;
        formData.country = appStore.step4Data.country || 'Polska';
    }
});

// Filtrowanie podpowiedzi dla szkół (AutoComplete)
const searchSchool = (event) => {
    const query = event.query.toLowerCase().trim();
    if (!query) {
        filteredSchools.value = [...kaliszSchools];
    } else {
        filteredSchools.value = kaliszSchools.filter((school) => {
            return school.name.toLowerCase().includes(query);
        });
    }
};

// Filtrowanie podpowiedzi dla państw (AutoComplete)
const searchCountry = (event) => {
    const query = event.query.toLowerCase().trim();
    if (!query) {
        filteredCountries.value = [...countriesList];
    } else {
        filteredCountries.value = countriesList.filter((country) => {
            return country.toLowerCase().includes(query);
        });
    }
};

// Funkcja walidująca pola formularza
const validateForm = () => {
    let isValid = true;

    // Resetowanie błędów
    Object.keys(errors).forEach((key) => (errors[key] = ''));

    // 1. Szkoła
    if (!formData.school) {
        errors.school = 'Wskazanie ukończonej szkoły średniej jest wymagane.';
        isValid = false;
    }

    // 2. Typ matury
    if (!formData.maturityType) {
        errors.maturityType = 'Wybór rodzaju świadectwa jest wymagany.';
        isValid = false;
    }

    // 3. Kraj (walidacja tylko gdy matura jest zagraniczna/międzynarodowa)
    if (isForeignMatura.value) {
        const countryVal = typeof formData.country === 'string' ? formData.country.trim() : formData.country;
        if (!countryVal) {
            errors.country = 'Wybór państwa wydającego dokument jest wymagany.';
            isValid = false;
        }
    }

    // 4. Numer dokumentu
    if (!formData.docNumber || formData.docNumber.trim().length < 3) {
        errors.docNumber = 'Wpisz poprawny numer dokumentu (minimum 3 znaki).';
        isValid = false;
    }

    // 5. Rok wydania
    const currentYear = new Date().getFullYear(); // 2026
    const yearNum = parseInt(formData.docYear, 10);

    if (!formData.docYear) {
        errors.docYear = 'Podanie roku wydania dokumentu jest wymagane.';
        isValid = false;
    } else if (isNaN(yearNum) || yearNum < 1950 || yearNum > currentYear) {
        errors.docYear = `Wprowadź prawidłowy rok (od 1950 do ${currentYear}).`;
        isValid = false;
    }

    // 6. Organ wydający
    if (!formData.docIssuer || formData.docIssuer.trim().length < 3) {
        errors.docIssuer = 'Podaj poprawną nazwę instytucji wystawiającej świadectwo.';
        isValid = false;
    }

    return isValid;
};

// Przesłanie i zapis formularza
const handleSubmit = async () => {
    if (!validateForm()) {
        toast.add({
            severity: 'warn',
            summary: 'Formularz zawiera błędy',
            detail: 'Uzupełnij poprawnie podświetlone pola przed przejściem dalej.',
            life: 4000,
        });
        return;
    }

    try {
        appStore.updateStep4({
            school: formData.school,
            maturityType: formData.maturityType,
            country: formData.country,
            docNumber: formData.docNumber,
            docYear: formData.docYear,
            docIssuer: formData.docIssuer,
        });

        toast.add({
            severity: 'success',
            summary: 'Dane zostały zapisane',
            detail: 'Krok 4 został pomyślnie zaktualizowany.',
            life: 3000,
        });
    } catch (error) {
        console.error('Błąd zapisu w Pinia:', error);
        toast.add({
            severity: 'error',
            summary: 'Błąd systemu',
            detail: 'Wystąpił problem z zapisem struktury w pamięci aplikacji.',
            life: 4000,
        });
    }
};

const handleBack = () => {
    console.log('Powrót do kroku 3');
};
</script>

<style scoped>
.p-autocomplete-custom :deep(.p-autocomplete-input) {
    width: 100% !important;
}
/* Poprawka wyświetlania tekstu w trybie ciemnym dla obu wyszukiwarek PrimeVue */
.dark .p-autocomplete-custom :deep(.p-autocomplete-input) {
    background-color: rgb(51 65 85 / 0.5) !important;
    color: rgb(241 245 249) !important;
}
</style>
