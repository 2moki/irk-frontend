<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

// Poprawne importy dla Formularzy PrimeVue oraz Zod
import { z } from 'zod';
import { zodResolver } from '@primevue/forms/resolvers/zod';

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const toast = useToast();
const countriesList = ref<{ id: number; name_pl: string }[]>([]);
const activeTab = ref(0);
const isSaving = ref(false);

/**
 * =========================================================================
 * SCHEMATY WALIDACJI ZOD (Zabezpieczone przed pustymi polami)
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

const addressSchema = z.object({
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
            id: z.number({ required_error: 'Wybierz kraj' }),
            name_pl: z.string(),
        })
        .refine((data) => data.id !== null, {
            message: 'Wybierz kraj',
            path: ['id'],
        }),
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
 * REAKTYWNE MODELE FORMULARZY
 * =========================================================================
 */
const personalForm = ref({
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

const addressForm = ref({
    street: '',
    house_number: '',
    apartment_number: '',
    post_code: '',
    city: '',
    country: { id: null as number | null, name_pl: '' },
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

    const userCountryId = user.value.address?.country?.id || user.value.address?.country_id;
    const matchedCountry = countriesList.value.find((c) => Number(c.id) === Number(userCountryId));
    const finalCountry =
        matchedCountry || (addressForm.value.country?.id ? addressForm.value.country : { id: null, name_pl: '' });

    addressForm.value = {
        street: user.value.address?.street ?? '',
        house_number: user.value.address?.house_number ?? '',
        apartment_number: user.value.address?.apartment_number ?? '',
        post_code: user.value.address?.post_code ?? '',
        city: user.value.address?.city ?? '',
        country: finalCountry,
    };
};

watch(
    user,
    () => {
        if (!isSaving.value) {
            fillForms();
        }
    },
    { immediate: true, deep: true },
);

onMounted(async () => {
    try {
        const response = await axios.get('/api/v1/countries');
        countriesList.value = response.data?.data || response.data;
    } catch (error) {
        console.error('Nie udało się pobrać listy krajów:', error);
    }

    await auth.fetchUser();
    fillForms();
});

/**
 * =========================================================================
 * METODY ZAPISU (SUBMIT) - NAPRAWIONE ODBIERANIE EMBEDDED EVENTÓW
 * =========================================================================
 */
const savePersonal = async (event: any) => {
    // W PrimeVue Forms poprawny parametr to event.valid
    if (!event.valid) return;

    try {
        isSaving.value = true;
        await auth.updateUser(personalForm.value);

        toast.add({
            severity: 'success',
            summary: 'Zapisano dane',
            detail: 'Dane osobowe zostały zaktualizowane.',
            life: 3000,
        });
    } catch (err) {
        console.error(err);
    } finally {
        isSaving.value = false;
    }
};

const saveAddress = async (event: any) => {
    if (!event.valid) return;

    try {
        isSaving.value = true;

        await auth.updateUser({
            address: {
                street: addressForm.value.street,
                house_number: addressForm.value.house_number,
                apartment_number: addressForm.value.apartment_number,
                city: addressForm.value.city,
                post_code: addressForm.value.post_code,
                country_id: addressForm.value.country?.id,
            },
        });

        await auth.fetchUser();
        fillForms();

        toast.add({
            severity: 'success',
            summary: 'Zapisano adres',
            detail: 'Adres został pomyślnie zaktualizowany.',
            life: 3000,
        });
    } catch (err) {
        console.error(err);
    } finally {
        isSaving.value = false;
    }
};

const changePassword = async (event: any) => {
    if (!event.valid) return;

    try {
        await auth.updateUser(passwordForm.value);

        passwordForm.value = {
            current_password: '',
            password: '',
            password_confirmation: '',
        };

        toast.add({
            severity: 'success',
            summary: 'Zmieniono hasło pomyślnie',
            detail: 'Twoje hasło zostało zmienione.',
            life: 3000,
        });
    } catch (e: any) {
        const errors = e.response?.data?.errors;
        if (errors) {
            Object.values(errors).forEach((fieldErrors: any) => {
                fieldErrors.forEach((msg: string) => {
                    toast.add({ severity: 'error', summary: msg, life: 4000 });
                });
            });
        }
    }
};
</script>

<template>
    <div class="mx-auto max-w-4xl space-y-6">
        <h1 class="text-2xl font-bold">Mój profil</h1>

        <TabView v-model:activeIndex="activeTab">
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
                        <InputText name="first_name" v-model="personalForm.first_name" class="w-full" />
                        <Message v-if="$form?.first_name?.invalid" severity="error" variant="text" size="small">{{
                            $form.first_name.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Drugie imię</label>
                        <InputText name="middle_name" v-model="personalForm.middle_name" class="w-full" />
                        <Message v-if="$form?.middle_name?.invalid" severity="error" variant="text" size="small">{{
                            $form.middle_name.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Nazwisko</label>
                        <InputText name="last_name" v-model="personalForm.last_name" class="w-full" />
                        <Message v-if="$form?.last_name?.invalid" severity="error" variant="text" size="small">{{
                            $form.last_name.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Email</label>
                        <InputText name="email" v-model="personalForm.email" class="w-full" />
                        <Message v-if="$form?.email?.invalid" severity="error" variant="text" size="small">{{
                            $form.email.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Telefon</label>
                        <div class="flex gap-2">
                            <InputText name="phone_prefix" v-model="personalForm.phone_prefix" class="w-24" />
                            <InputText name="phone_number" v-model="personalForm.phone_number" class="w-full" />
                        </div>
                        <Message v-if="$form?.phone_number?.invalid" severity="error" variant="text" size="small">{{
                            $form.phone_number.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>PESEL</label>
                        <InputText name="pesel" v-model="personalForm.pesel" class="w-full" />
                        <Message v-if="$form?.pesel?.invalid" severity="error" variant="text" size="small">{{
                            $form.pesel.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Data urodzenia</label>
                        <InputText
                            name="date_of_birth"
                            v-model="personalForm.date_of_birth"
                            type="date"
                            class="w-full"
                        />
                        <Message v-if="$form?.date_of_birth?.invalid" severity="error" variant="text" size="small">{{
                            $form.date_of_birth.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Płeć</label>
                        <Select
                            name="gender"
                            v-model="personalForm.gender"
                            :options="['male', 'female', 'other']"
                            class="w-full"
                        />
                        <Message v-if="$form?.gender?.invalid" severity="error" variant="text" size="small">{{
                            $form.gender.error?.message
                        }}</Message>
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
                        <InputText name="street" v-model="addressForm.street" class="w-full" />
                        <Message v-if="$form?.street?.invalid" severity="error" variant="text" size="small">{{
                            $form.street.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Numer domu</label>
                        <InputText name="house_number" v-model="addressForm.house_number" class="w-full" />
                        <Message v-if="$form?.house_number?.invalid" severity="error" variant="text" size="small">{{
                            $form.house_number.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Mieszkanie</label>
                        <InputText name="apartment_number" v-model="addressForm.apartment_number" class="w-full" />
                        <Message v-if="$form?.apartment_number?.invalid" severity="error" variant="text" size="small">{{
                            $form.apartment_number.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Kod pocztowy</label>
                        <InputText name="post_code" v-model="addressForm.post_code" class="w-full" />
                        <Message v-if="$form?.post_code?.invalid" severity="error" variant="text" size="small">{{
                            $form.post_code.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Miasto</label>
                        <InputText name="city" v-model="addressForm.city" class="w-full" />
                        <Message v-if="$form?.city?.invalid" severity="error" variant="text" size="small">{{
                            $form.city.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Kraj</label>
                        <Select
                            name="country"
                            v-model="addressForm.country"
                            :options="countriesList"
                            optionLabel="name_pl"
                            placeholder="Wybierz kraj"
                            class="w-full"
                            filter
                        />
                        <Message v-if="$form?.['country.id']?.invalid" severity="error" variant="text" size="small">{{
                            $form['country.id'].error?.message
                        }}</Message>
                    </div>

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
                    class="mt-4 grid gap-4"
                >
                    <div class="flex flex-col gap-1">
                        <label>Aktualne hasło</label>
                        <Password
                            name="current_password"
                            v-model="passwordForm.current_password"
                            :feedback="false"
                            toggleMask
                            class="w-full"
                        />
                        <Message v-if="$form?.current_password?.invalid" severity="error" variant="text" size="small">{{
                            $form.current_password.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Nowe hasło</label>
                        <Password
                            name="password"
                            v-model="passwordForm.password"
                            :feedback="false"
                            toggleMask
                            class="w-full"
                        />
                        <Message v-if="$form?.password?.invalid" severity="error" variant="text" size="small">{{
                            $form.password.error?.message
                        }}</Message>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label>Powtórz hasło</label>
                        <Password
                            name="password_confirmation"
                            v-model="passwordForm.password_confirmation"
                            :feedback="false"
                            toggleMask
                            class="w-full"
                        />
                        <Message
                            v-if="$form?.password_confirmation?.invalid"
                            severity="error"
                            variant="text"
                            size="small"
                            >{{ $form.password_confirmation.error?.message }}</Message
                        >
                    </div>

                    <Button type="submit" label="Zmień hasło" class="mt-2 w-full" />
                </Form>
            </TabPanel>
        </TabView>
    </div>
</template>
