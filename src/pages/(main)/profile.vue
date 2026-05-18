<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import axios, { AxiosError } from 'axios';

import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';

interface FormSubmitEvent {
    valid: boolean;
}

interface ApiValidationErrorResponse {
    errors?: Record<string, string[]>;
}

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const toast = useToast();
const countriesList = ref<{ id: number; name_pl: string }[]>([]);
const activeTab = ref(0);
const isSaving = ref(false);
const hasDifferentCorrespondenceAddress = ref(false);

// Flaga uniemożliwiająca renderowanie komponentów przed pobraniem danych
const isLoaded = ref(false);

/**
 * =========================================================================
 * SCHEMATY WALIDACJI ZOD
 * =========================================================================
 */
const personalSchema = z.object({
    first_name: z.string().min(1, 'Imię jest wymagane'),
    middle_name: z.string().optional().nullable().or(z.literal('')),
    last_name: z.string().min(1, 'Nazwisko jest wymagane'),
    email: z.string().min(1, 'Email jest wymagany').email('Niepoprawny format adresu email'),
    phone_prefix: z.string().min(1, 'Prefiks jest wymagany'),
    phone_number: z.string().min(7, 'Numer telefonu jest za krótki').regex(/^\d+$/, 'Numer może zawierać tylko cyfry'),
    pesel: z
        .string()
        .length(11, 'PESEL musi mieć 11 znaków')
        .regex(/^\d+$/, 'PESEL może zawierać tylko cyfry')
        .or(z.literal('')),
    date_of_birth: z.string().min(1, 'Data urodzenia jest wymagana'),
    gender: z.string().min(1, 'Wybierz płeć'),
});

const addressSchema = z
    .object({
        street: z.string().min(1, 'Ulica jest wymagana'),
        house_number: z.string().min(1, 'Numer domu jest wymagany'),
        apartment_number: z.string().optional().nullable().or(z.literal('')),
        post_code: z
            .string()
            .min(1, 'Kod pocztowy jest wymagany')
            .regex(/^\d{2}-\d{3}$/, 'Niepoprawny format (00-000)'),
        city: z.string().min(1, 'Miasto jest wymagane'),
        country: z
            .object({
                id: z.number({ required_error: 'Wybierz kraj' }).nullable(),
                name_pl: z.string(),
            })
            .refine((data) => data.id !== null, {
                message: 'Wybierz kraj',
                path: ['id'],
            }),
        c_street: z.string().optional().nullable().or(z.literal('')),
        c_house_number: z.string().optional().nullable().or(z.literal('')),
        c_apartment_number: z.string().optional().nullable().or(z.literal('')),
        c_post_code: z.string().optional().nullable().or(z.literal('')),
        c_city: z.string().optional().nullable().or(z.literal('')),
        c_country: z
            .object({
                id: z.number().nullable().optional(),
                name_pl: z.string().optional(),
            })
            .optional()
            .nullable(),
    })
    .superRefine((data, ctx) => {
        if (hasDifferentCorrespondenceAddress.value) {
            if (!data.c_street || data.c_street.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Ulica korespondencyjna jest wymagana',
                    path: ['c_street'],
                });
            }
            if (!data.c_house_number || data.c_house_number.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Numer domu jest wymagany',
                    path: ['c_house_number'],
                });
            }
            if (!data.c_city || data.c_city.trim() === '') {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Miasto korespondencyjne jest wymagane',
                    path: ['c_city'],
                });
            }
            if (!data.c_post_code || !/^\d{2}-\d{3}$/.test(data.c_post_code)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Niepoprawny format (00-000)',
                    path: ['c_post_code'],
                });
            }
            if (!data.c_country || data.c_country.id === null) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Wybierz kraj korespondencji',
                    path: ['c_country.id'],
                });
            }
        }
    });

const passwordSchema = z
    .object({
        current_password: z.string().min(1, 'Aktualne hasło jest wymagane'),
        password: z.string().min(8, 'Nowe hasło musi mieć minimum 8 znaków'),
        password_confirmation: z.string().min(1, 'Potwierdzenie hasła jest wymagane'),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Hasła nie są identyczne',
        path: ['password_confirmation'],
    });

const personalResolver = zodResolver(personalSchema);
const addressResolver = zodResolver(addressSchema);
const passwordResolver = zodResolver(passwordSchema);

/**
 * =========================================================================
 * STRUKTURY DANYCH WEJŚCIOWYCH (INITIAL VALUES)
 * =========================================================================
 */
const personalForm = ref<any>({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_prefix: '+48',
    phone_number: '',
    pesel: '',
    date_of_birth: '',
    gender: '',
});

const addressForm = ref<any>({
    street: '',
    house_number: '',
    apartment_number: '',
    post_code: '',
    city: '',
    country: { id: null, name_pl: '' },
    c_street: '',
    c_house_number: '',
    c_apartment_number: '',
    c_post_code: '',
    c_city: '',
    c_country: { id: null, name_pl: '' },
});

const passwordForm = ref({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const formatToInputDate = (date: string | null) => {
    if (!date) return '';
    return date.split('T')[0];
};

const fillForms = () => {
    if (!user.value) return;

    // 1. Wypełnianie danych osobowych
    personalForm.value = {
        first_name: user.value.first_name ?? '',
        middle_name: user.value.middle_name ?? '',
        last_name: user.value.last_name ?? '',
        email: user.value.email ?? '',
        phone_prefix: user.value.phone_prefix ?? '+48',
        phone_number: user.value.phone_number ?? '',
        pesel: user.value.pesel ?? '',
        date_of_birth: formatToInputDate(user.value?.date_of_birth ?? null),
        gender: user.value.gender ?? '',
    };

    // 2. Mapowanie kraju dla adresu głównego
    const userCountryId = user.value.address?.country?.id || user.value.address?.country_id;
    const matchedCountry = countriesList.value.find((c) => Number(c.id) === Number(userCountryId));
    const finalCountry = matchedCountry || { id: null, name_pl: '' };

    // 3. Mapowanie kraju dla adresu korespondencyjnego (z mailing_address)
    const userCorrCountryId = user.value.mailing_address?.country?.id || user.value.mailing_address?.country_id;
    const matchedCorrCountry = countriesList.value.find((c) => Number(c.id) === Number(userCorrCountryId));
    const finalCorrCountry = matchedCorrCountry || { id: null, name_pl: '' };

    // FIX: Flaga aktywująca checkbox - sprawdza czy obiekt relacji istnieje w profilu
    hasDifferentCorrespondenceAddress.value = !!user.value.mailing_address;

    // 4. Wypełnianie danych adresowych (z uwzględnieniem struktury Laravela)
    addressForm.value = {
        street: user.value.address?.street ?? '',
        house_number: user.value.address?.house_number ?? '',
        apartment_number: user.value.address?.apartment_number ?? '',
        post_code: user.value.address?.post_code ?? '',
        city: user.value.address?.city ?? '',
        country: finalCountry,

        // FIX: Pobieranie wartości z relacji 'mailing_address' i przypisywanie do pól formularza z prefiksem 'c_'
        c_street: user.value.mailing_address?.street ?? '',
        c_house_number: user.value.mailing_address?.house_number ?? '',
        c_apartment_number: user.value.mailing_address?.apartment_number ?? '',
        c_post_code: user.value.mailing_address?.post_code ?? '',
        c_city: user.value.mailing_address?.city ?? '',
        c_country: finalCorrCountry,
    };
};

onMounted(async () => {
    try {
        const response = await axios.get('/api/v1/countries');
        countriesList.value = response.data?.data || response.data;

        await auth.fetchUser();
        fillForms();

        isLoaded.value = true;
    } catch (error) {
        console.error('Błąd podczas ładowania profilu:', error);
        isLoaded.value = true;
    }
});

const savePersonal = async (event: any) => {
    if (!event.valid) return;
    try {
        isSaving.value = true;
        await auth.updateUser(event.values); // Zapisujemy bezpośrednio stan z formularza PrimeVue
        toast.add({ severity: 'success', summary: 'Zapisano dane', life: 3000 });
    } catch (err) {
        console.error(err);
    } finally {
        isSaving.value = false;
    }
};

const saveAddress = async (event: FormSubmitEvent) => {
    if (!event.valid) return;
    try {
        isSaving.value = true;
        const vals = event.values;

        // Budujemy czysty obiekt payloadu dopasowany do struktur Laravela
        const payload: Record<string, any> = {
            // Dane adresu głównego
            street: vals.street,
            house_number: vals.house_number,
            apartment_number: vals.apartment_number,
            city: vals.city,
            post_code: vals.post_code,
            country_id: vals.country?.id, // Wyciągamy samo ID kraju, serwer rzadko przyjmuje cały obiekt

            // Logika adresu korespondencyjnego
            has_correspondence: hasDifferentCorrespondenceAddress.value,
        };

        // Jeśli użytkownik zaznaczył inny adres korespondencyjny,
        // pakujemy go w strukturę, którą Laravel łatwo przypisze do relacji mailingAddress
        if (hasDifferentCorrespondenceAddress.value) {
            payload.mailing_address = {
                street: vals.c_street,
                house_number: vals.c_house_number,
                apartment_number: vals.c_apartment_number,
                city: vals.c_city,
                post_code: vals.c_post_code,
                country_id: vals.c_country?.id, // Wyciągamy samo ID kraju
            };
        } else {
            payload.mailing_address = null;
        }

        // Wysyłamy sformatowane dane do akcji Pinia
        await auth.updateUser(payload);

        // Odświeżamy stan w aplikacji
        await auth.fetchUser();
        fillForms();

        toast.add({
            severity: 'success',
            summary: 'Zapisano adres',
            detail: 'Adres został pomyślnie zaktualizowany.',
            life: 3000,
        });
    } catch (err) {
        console.error('Błąd podczas zapisu adresu:', err);
        toast.add({
            severity: 'error',
            summary: 'Błąd zapisu',
            detail: 'Nie udało się zapisać adresu. Spróbuj ponownie.',
            life: 4000,
        });
    } finally {
        isSaving.value = false;
    }
};

const changePassword = async (event: any) => {
    if (!event.valid) return;
    try {
        await auth.updateUser(event.values);
        toast.add({ severity: 'success', summary: 'Zmieniono hasło pomyślnie', life: 3000 });
    } catch (e) {
        console.error(e);
    }
};
</script>

<template>
    <div class="mx-auto max-w-4xl space-y-6">
        <h1 class="text-2xl font-bold">Mój profil</h1>

        <div v-if="!isLoaded" class="flex items-center justify-center py-12">
            <ProgressSpinner style="width: 50px; height: 50px" />
        </div>

        <TabView v-else v-model:activeIndex="activeTab">
            <TabPanel header="Dane osobowe">
                <Form
                    v-slot="$form"
                    :initialValues="personalForm"
                    :resolver="personalResolver"
                    @submit="savePersonal"
                    class="mt-4 grid gap-4 md:grid-cols-2"
                >
                    <div class="flex flex-col gap-1">
                        <label>Imię</label>
                        <InputText name="first_name" class="w-full" />
                        <Message v-if="$form?.first_name?.invalid" severity="error" variant="text" size="small">
                            {{ $form.first_name.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Drugie imię</label>
                        <InputText name="middle_name" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Nazwisko</label>
                        <InputText name="last_name" class="w-full" />
                        <Message v-if="$form?.last_name?.invalid" severity="error" variant="text" size="small">
                            {{ $form.last_name.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Email</label>
                        <InputText name="email" class="w-full" />
                        <Message v-if="$form?.email?.invalid" severity="error" variant="text" size="small">
                            {{ $form.email.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Telefon</label>
                        <div class="flex gap-2">
                            <InputText name="phone_prefix" class="w-24" />
                            <InputText name="phone_number" class="w-full" />
                        </div>
                        <Message v-if="$form?.phone_number?.invalid" severity="error" variant="text" size="small">
                            {{ $form.phone_number.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>PESEL</label>
                        <InputText name="pesel" class="w-full" />
                        <Message v-if="$form?.pesel?.invalid" severity="error" variant="text" size="small">
                            {{ $form.pesel.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Data urodzenia</label>
                        <InputText name="date_of_birth" type="date" class="w-full" />
                        <Message v-if="$form?.date_of_birth?.invalid" severity="error" variant="text" size="small">
                            {{ $form.date_of_birth.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Płeć</label>
                        <Select name="gender" :options="['male', 'female', 'other']" class="w-full" />
                        <Message v-if="$form?.gender?.invalid" severity="error" variant="text" size="small">
                            {{ $form.gender.error?.message }}
                        </Message>
                    </div>

                    <div class="md:col-span-2">
                        <Button type="submit" label="Zapisz dane" class="mt-2 w-full" />
                    </div>
                </Form>
            </TabPanel>

            <TabPanel header="Adres">
                <Form
                    v-slot="$form"
                    :initialValues="addressForm"
                    :resolver="addressResolver"
                    @submit="saveAddress"
                    class="mt-4 grid gap-4 md:grid-cols-2"
                >
                    <div class="flex flex-col gap-1">
                        <label>Ulica</label>
                        <InputText name="street" class="w-full" />
                        <Message v-if="$form?.street?.invalid" severity="error" variant="text" size="small">
                            {{ $form.street.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Numer domu</label>
                        <InputText name="house_number" class="w-full" />
                        <Message v-if="$form?.house_number?.invalid" severity="error" variant="text" size="small">
                            {{ $form.house_number.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Mieszkanie</label>
                        <InputText name="apartment_number" class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Kod pocztowy</label>
                        <InputText name="post_code" class="w-full" />
                        <Message v-if="$form?.post_code?.invalid" severity="error" variant="text" size="small">
                            {{ $form.post_code.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Miasto</label>
                        <InputText name="city" class="w-full" />
                        <Message v-if="$form?.city?.invalid" severity="error" variant="text" size="small">
                            {{ $form.city.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Kraj</label>
                        <Select
                            name="country"
                            :options="countriesList"
                            optionLabel="name_pl"
                            placeholder="Wybierz kraj"
                            class="w-full"
                            filter
                        />
                    </div>

                    <div class="my-2 flex items-center gap-2 border-t border-b border-gray-100 py-2 md:col-span-2">
                        <Checkbox
                            id="correspondence_toggle"
                            v-model="hasDifferentCorrespondenceAddress"
                            :binary="true"
                        />
                        <label for="correspondence_toggle" class="cursor-pointer text-sm font-medium select-none">
                            Inny adres do korespondencji
                        </label>
                    </div>

                    <template v-if="hasDifferentCorrespondenceAddress">
                        <div class="flex flex-col gap-1">
                            <label>Ulica (korespondencja)</label>
                            <InputText name="c_street" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label>Numer domu (korespondencja)</label>
                            <InputText name="c_house_number" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label>Mieszkanie (korespondencja)</label>
                            <InputText name="c_apartment_number" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label>Kod pocztowy (korespondencja)</label>
                            <InputText name="c_post_code" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label>Miasto (korespondencja)</label>
                            <InputText name="c_city" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-1">
                            <label>Kraj (korespondencja)</label>
                            <Select
                                name="c_country"
                                :options="countriesList"
                                optionLabel="name_pl"
                                placeholder="Wybierz kraj"
                                class="w-full"
                                filter
                            />
                        </div>
                    </template>

                    <div class="md:col-span-2">
                        <Button type="submit" label="Zapisz adres" class="mt-2 w-full" />
                    </div>
                </Form>
            </TabPanel>

            <TabPanel header="Bezpieczeństwo">
                <Form
                    v-slot="$form"
                    :initialValues="passwordForm"
                    :resolver="passwordResolver"
                    @submit="changePassword"
                    class="mt-4 grid max-w-md gap-4"
                >
                    <div class="flex flex-col gap-1">
                        <label>Aktualne hasło</label>
                        <Password name="current_password" :feedback="false" toggleMask fluid />
                        <Message v-if="$form?.current_password?.invalid" severity="error" variant="text" size="small">
                            {{ $form.current_password.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Nowe hasło</label>
                        <Password name="password" :feedback="false" toggleMask fluid />
                        <Message v-if="$form?.password?.invalid" severity="error" variant="text" size="small">
                            {{ $form.password.error?.message }}
                        </Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Powtórz hasło</label>
                        <Password name="password_confirmation" :feedback="false" toggleMask fluid />
                        <Message
                            v-if="$form?.password_confirmation?.invalid"
                            severity="error"
                            variant="text"
                            size="small"
                        >
                            {{ $form.password_confirmation.error?.message }}
                        </Message>
                    </div>

                    <Button type="submit" label="Zmień hasło" class="mt-2 w-full" />
                </Form>
            </TabPanel>
        </TabView>
    </div>
</template>
