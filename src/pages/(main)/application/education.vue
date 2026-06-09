<template>
    <div class="mx-auto w-full max-w-5xl text-slate-800 transition-colors duration-200 dark:text-slate-100">
        <ApplicationHeader
            :current-step="2"
            :steps="10"
            :title="$t('application.education.title', 'Wykształcenie')"
            :subtitle="$t('application.education.subtitle', 'Wybór Dokumentu i Szkoły')"
        />

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
            <div
                class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
                <div class="mb-2 flex items-center gap-3">
                    <div class="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                        <i class="pi pi-graduation-cap text-xl"></i>
                    </div>
                    <h2 class="text-lg font-bold text-[#1e293b] dark:text-white">Szkoła Ponadpodstawowa</h2>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >Wyszukaj szkołę średnią</label
                    >

                    <div v-if="!formData.hasCustomSchool" class="w-full">
                        <AutoComplete
                            v-model="formData.school"
                            :suggestions="filteredSchools"
                            optionLabel="name"
                            dataKey="id"
                            placeholder="Wpisz nazwę szkoły lub miasto..."
                            @complete="searchSchool"
                            @change="errors.school_id = ''"
                            dropdown
                            class="w-full"
                            :inputClass="{ 'p-invalid': errors.school_id }"
                        />
                        <small v-if="errors.school_id" class="p-error mt-1 block text-red-500 dark:text-red-400">{{
                            errors.school_id
                        }}</small>
                    </div>

                    <div v-else class="w-full">
                        <InputText
                            v-model="formData.school_custom_name"
                            @input="errors.school_custom_name = ''"
                            placeholder="Wpisz pełną nazwę swojej szkoły"
                            class="w-full"
                            :class="{ 'p-invalid': errors.school_custom_name }"
                        />
                        <small
                            v-if="errors.school_custom_name"
                            class="p-error mt-1 block text-red-500 dark:text-red-400"
                            >{{ errors.school_custom_name }}</small
                        >
                    </div>

                    <div class="mt-2 flex items-center gap-2">
                        <Checkbox
                            id="hasCustomSchool"
                            v-model="formData.hasCustomSchool"
                            :binary="true"
                            @change="handleSchoolModeChange"
                        />
                        <label
                            for="hasCustomSchool"
                            class="cursor-pointer text-xs font-medium text-gray-600 select-none dark:text-gray-400"
                        >
                            Mojej szkoły nie ma na liście
                        </label>
                    </div>
                </div>
            </div>

            <div
                class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
                <div class="mb-2 flex items-center gap-3">
                    <div class="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                        <i class="pi pi-file text-xl"></i>
                    </div>
                    <h2 class="text-lg font-bold text-[#1e293b] dark:text-white">Typ Dokumentu</h2>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >Rodzaj świadectwa maturalnego</label
                        >
                        <Dropdown
                            v-model="formData.maturityType"
                            :options="maturityOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Wybierz typ matury..."
                            @change="handleMaturityChange"
                            class="w-full"
                            :class="{ 'p-invalid': errors.maturityType }"
                        />
                        <small v-if="errors.maturityType" class="p-error mt-1 block text-red-500 dark:text-red-400">{{
                            errors.maturityType
                        }}</small>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300"
                            >Kraj wydania dokumentu</label
                        >
                        <div class="w-full">
                            <AutoComplete
                                v-if="isForeignMatura"
                                v-model="formData.country"
                                :suggestions="filteredCountries"
                                optionLabel="name_pl"
                                dataKey="id"
                                placeholder="Wpisz lub wybierz kraj, np. Niemcy"
                                @complete="searchCountry"
                                @change="errors.country_id = ''"
                                dropdown
                                class="w-full"
                                :inputClass="{ 'p-invalid': errors.country_id }"
                            />
                            <InputText
                                v-else
                                value="Polska"
                                disabled
                                class="w-full cursor-not-allowed bg-gray-100 text-gray-500 opacity-70 dark:bg-slate-700 dark:text-gray-400"
                            />
                        </div>
                        <small
                            v-if="errors.country_id && isForeignMatura"
                            class="p-error mt-1 block text-red-500 dark:text-red-400"
                            >{{ errors.country_id }}</small
                        >
                    </div>
                </div>
            </div>

            <div
                class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
                <div class="mb-2 flex items-center gap-3">
                    <div class="rounded-xl bg-blue-100 p-2.5 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400">
                        <i class="pi pi-id-card text-xl"></i>
                    </div>
                    <h2 class="text-lg font-bold text-[#1e293b] dark:text-white">Szczegóły Świadectwa</h2>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Numer Dokumentu</label>
                        <InputText
                            v-model="formData.docNumber"
                            @input="errors.docNumber = ''"
                            placeholder="np. ABC 123456"
                            class="w-full"
                            :class="{ 'p-invalid': errors.docNumber }"
                        />
                        <small v-if="errors.docNumber" class="p-error mt-1 block text-red-500 dark:text-red-400">{{
                            errors.docNumber
                        }}</small>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Rok Wydania</label>
                        <InputText
                            v-model="formData.docYear"
                            @input="handleYearInput"
                            placeholder="2026"
                            class="w-full"
                            maxlength="4"
                            :class="{ 'p-invalid': errors.docYear }"
                        />
                        <small v-if="errors.docYear" class="p-error mt-1 block text-red-500 dark:text-red-400">{{
                            errors.docYear
                        }}</small>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-semibold text-gray-700 dark:text-gray-300">Organ Wydający</label>
                        <InputText
                            v-model="formData.docIssuer"
                            @input="errors.docIssuer = ''"
                            placeholder="np. OKE w Poznaniu"
                            class="w-full"
                            :class="{ 'p-invalid': errors.docIssuer }"
                        />
                        <small v-if="errors.docIssuer" class="p-error mt-1 block text-red-500 dark:text-red-400">{{
                            errors.docIssuer
                        }}</small>
                    </div>
                </div>

                <div
                    class="flex items-start gap-3 rounded-xl border border-gray-200/60 bg-gray-50 p-4 dark:border-slate-700/50 dark:bg-slate-900/40"
                >
                    <i class="pi pi-info-circle mt-0.5 text-slate-600 dark:text-slate-400"></i>
                    <p class="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                        Prosimy o dokładne wprowadzenie danych zgodnie z oryginałem świadectwa. Błędne dane mogą
                        skutkować odrzuceniem wniosku na etapie weryfikacji dokumentów papierowych.
                    </p>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <Button
                    type="button"
                    :label="$t('stepperPagination.back')"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    outlined
                    class="rounded-lg px-6 py-3 font-bold"
                    @click="handleBack"
                />
                <Button
                    type="submit"
                    :label="$t('stepperPagination.next')"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="rounded-lg px-10 py-3 text-lg font-bold shadow-lg"
                />
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';

import AutoComplete from 'primevue/autocomplete';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

import ApplicationHeader from '@/components/application/ApplicationHeader.vue';

import { useApplicationStore } from '@/stores/application';
import { useCountryStore } from '@/stores/country';
import { useRouter } from 'vue-router';

const toast = useToast();
const appStore = useApplicationStore();
const countriesStore = useCountryStore();
const router = useRouter();

// POPRAWKA 1: Dodano "Wybierz rodzaj matury" z pustą wartością jako pierwszą pozycję
const maturityOptions = ref([
    { label: 'Wybierz rodzaj matury...', value: '' },
    { label: 'Nowa matura (od 2005 r.)', value: 'new_matura' },
    { label: 'Stara matura (do 1991 r.)', value: 'old_matura_pre_1991' },
    { label: 'Stara matura (1992 - 2004 r.)', value: 'old_matura_post_1991' },
    { label: 'Matura Międzynarodowa (IB)', value: 'international_baccalaureate' },
    { label: 'Matura Europejska (EB)', value: 'european_baccalaureate' },
    { label: 'Świadectwo uzyskane za granicą', value: 'foreign' },
]);

const formData = reactive({
    school: null as any,
    hasCustomSchool: false,
    school_custom_name: '',
    maturityType: '',
    country: 'Polska' as any,
    docNumber: '',
    docYear: '',
    docIssuer: '',
});

const errors = reactive({
    school_id: '',
    school_custom_name: '',
    maturityType: '',
    country_id: '',
    docNumber: '',
    docYear: '',
    docIssuer: '',
});

const filteredSchools = ref<any[]>([]);
const filteredCountries = ref<any[]>([]);

const isForeignMatura = computed(() => {
    return ['international_baccalaureate', 'european_baccalaureate', 'foreign'].includes(formData.maturityType);
});

// POPRAWKA 2: Funkcja usuwająca litery "w locie" podczas wpisywania roku
const handleYearInput = () => {
    formData.docYear = formData.docYear.replace(/\D/g, '');
    errors.docYear = '';
};

const handleMaturityChange = () => {
    errors.maturityType = '';
    if (!isForeignMatura.value) {
        formData.country = 'Polska';
        errors.country_id = '';
    } else {
        formData.country = null;
    }
};

const handleSchoolModeChange = () => {
    errors.school_id = '';
    errors.school_custom_name = '';
    if (formData.hasCustomSchool) {
        formData.school = null;
    } else {
        formData.school_custom_name = '';
    }
};

onMounted(async () => {
    try {
        if (typeof countriesStore.fetchCountries === 'function') {
            await countriesStore.fetchCountries();
        }
    } catch (e) {
        console.error('Błąd pobierania krajów:', e);
    }

    if (appStore.step4Data) {
        Object.assign(formData, appStore.step4Data);
    }
});

const localSchools = [
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

const searchSchool = (event: { query: string }) => {
    const query = event.query ? event.query.toLowerCase().trim() : '';

    if (!query) {
        filteredSchools.value = [...localSchools];
    } else {
        filteredSchools.value = localSchools.filter((school) => {
            return school.name.toLowerCase().includes(query);
        });
    }
};

const searchCountry = (event: { query: string }) => {
    const query = event.query ? event.query.toLowerCase().trim() : '';
    const rawCountries = countriesStore.countries || [];

    if (!query) {
        filteredCountries.value = [...rawCountries];
    } else {
        filteredCountries.value = rawCountries.filter((c: any) => c.name_pl && c.name_pl.toLowerCase().includes(query));
    }
};

const validateForm = () => {
    let isValid = true;
    Object.keys(errors).forEach((k) => (errors[k as keyof typeof errors] = ''));

    if (!formData.hasCustomSchool) {
        if (!formData.school || !formData.school.id) {
            errors.school_id = 'Wskazanie szkoły z listy jest wymagane.';
            isValid = false;
        }
    } else {
        if (!formData.school_custom_name || formData.school_custom_name.trim().length < 3) {
            errors.school_custom_name = 'Wpisz pełną nazwę szkoły (min. 3 znaki).';
            isValid = false;
        }
    }

    // Walidacja typu matury (wyłapie też opcję "Wybierz rodzaj matury...")
    if (!formData.maturityType) {
        errors.maturityType = 'Wybór rodzaju matury jest wymagany.';
        isValid = false;
    }

    if (isForeignMatura.value && (!formData.country || !formData.country.id)) {
        errors.country_id = 'Wybór państwa jest wymagany.';
        isValid = false;
    }

    if (!formData.docNumber || formData.docNumber.trim().length < 3) {
        errors.docNumber = 'Wpisz poprawny numer dokumentu.';
        isValid = false;
    }

    // POPRAWKA 2: Dokładniejsza walidacja formatu roku w JS
    const yearRegex = /^\d{4}$/;
    if (!formData.docYear) {
        errors.docYear = 'Pole wymagane.';
        isValid = false;
    } else if (!yearRegex.test(formData.docYear)) {
        errors.docYear = 'Wpisz poprawny rok (4 cyfry).';
        isValid = false;
    }

    if (!formData.docIssuer || formData.docIssuer.trim().length < 3) {
        errors.docIssuer = 'Podaj instytucję wystawiającą.';
        isValid = false;
    }

    return isValid;
};

const handleSubmit = async () => {
    if (!validateForm()) {
        toast.add({ severity: 'warn', summary: 'Błędy formularza', detail: 'Popraw podświetlone pola.', life: 3000 });
        return;
    }

    try {
        const payload = {
            school: formData.school,
            hasCustomSchool: formData.hasCustomSchool,
            school_custom_name: formData.school_custom_name,
            maturityType: formData.maturityType,
            country: formData.country,
            docNumber: formData.docNumber,
            docYear: formData.docYear,
            docIssuer: formData.docIssuer,
        };

        if (typeof appStore.updateStep4 === 'function') {
            appStore.updateStep4(payload);
        }

        toast.add({
            severity: 'success',
            summary: 'Zapisano',
            detail: 'Dane edukacyjne zostały zapamiętane.',
            life: 3000,
        });

        await router.push('/application/photo');
    } catch (error) {
        console.error(error);
    }
};

const handleBack = () => {
    router.push('/application/study-programs');
};
</script>
