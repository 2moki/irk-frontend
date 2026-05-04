<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';

const auth = useAuthStore();
const { user } = storeToRefs(auth);
const toast = useToast();

const activeTab = ref(0);

/**
 * DANE OSOBOWE (POŁĄCZONE Z PROFILE)
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

/**
 * ADRES
 */
const addressForm = ref({
    street: '',
    house_number: '',
    apartment_number: '',
    post_code: '',
    city: '',
    country: '',
});

/**
 * HASŁO
 */
const passwordForm = ref({
    current_password: '',
    password: '',
    password_confirmation: '',
});

/**
 * MAPOWANIE USER → FORM
 */
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
        date_of_birth: user.value.date_of_birth ?? '',
        gender: user.value.gender ?? '',
    };

    addressForm.value = {
        street: user.value.address?.street ?? '',
        house_number: user.value.address?.house_number ?? '',
        apartment_number: user.value.address?.apartment_number ?? '',
        post_code: user.value.address?.post_code ?? '',
        city: user.value.address?.city ?? '',
        country: user.value.address?.country?.name_pl ?? '',
    };
};

onMounted(async () => {
    await auth.fetchUser();
    fillForms();
});

watch(user, () => fillForms(), { immediate: true });

/**
 * SAVE
 */
const savePersonal = async () => {
    await auth.updateUser(personalForm.value);

    toast.add({
        severity: 'success',
        summary: 'Zapisano dane',
        life: 3000,
    });
};

const saveAddress = async () => {
    await auth.updateUser({
        address: {
            street: addressForm.value.street,
            house_number: addressForm.value.house_number,
            apartment_number: addressForm.value.apartment_number,
            city: addressForm.value.city,
            postal_code: addressForm.value.postal_code,
            post_office: addressForm.value.post_office,
            state: addressForm.value.state,

            // 🔥 KLUCZOWE
            country_id: addressForm.value.country?.id,
        },
    });

    toast.add({
        severity: 'success',
        summary: 'Zapisano adres',
        life: 3000,
    });
};

const changePassword = async () => {
    await auth.updateUser(passwordForm.value);

    passwordForm.value = {
        current_password: '',
        password: '',
        password_confirmation: '',
    };

    toast.add({
        severity: 'success',
        summary: 'Zmieniono hasło',
        life: 3000,
    });
};
</script>

<template>
    <div class="mx-auto max-w-4xl space-y-6 p-6">
        <h1 class="text-2xl font-bold">Mój profil</h1>

        <TabView v-model:activeIndex="activeTab">
            <!-- DANE OSOBOWE -->
            <TabPanel header="Dane osobowe">
                <div class="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                        <label>Imię</label>
                        <InputText v-model="personalForm.first_name" class="w-full" />
                    </div>

                    <div>
                        <label>Drugie imię</label>
                        <InputText v-model="personalForm.middle_name" class="w-full" />
                    </div>

                    <div>
                        <label>Nazwisko</label>
                        <InputText v-model="personalForm.last_name" class="w-full" />
                    </div>

                    <div>
                        <label>Email</label>
                        <InputText v-model="personalForm.email" class="w-full" />
                    </div>

                    <div class="flex gap-2">
                        <div>
                            <label>Prefiks</label>
                            <InputText v-model="personalForm.phone_prefix" class="w-24" />
                        </div>
                        <div class="w-full">
                            <label>Telefon</label>
                            <InputText v-model="personalForm.phone_number" class="w-full" />
                        </div>
                    </div>

                    <div>
                        <label>PESEL</label>
                        <InputText v-model="personalForm.pesel" class="w-full" />
                    </div>

                    <div>
                        <label>Data urodzenia</label>
                        <InputText v-model="personalForm.date_of_birth" type="date" class="w-full" />
                    </div>

                    <div>
                        <label>Płeć</label>
                        <Select v-model="personalForm.gender" :options="['male', 'female', 'other']" class="w-full" />
                    </div>
                </div>

                <Button label="Zapisz dane" class="mt-6 w-full" @click="savePersonal" />
            </TabPanel>

            <!-- ADRES -->
            <TabPanel header="Adres">
                <div class="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                        <label>Ulica</label>
                        <InputText v-model="addressForm.street" class="w-full" />
                    </div>

                    <div>
                        <label>Numer domu</label>
                        <InputText v-model="addressForm.house_number" class="w-full" />
                    </div>

                    <div>
                        <label>Mieszkanie</label>
                        <InputText v-model="addressForm.apartment_number" class="w-full" />
                    </div>

                    <div>
                        <label>Kod pocztowy</label>
                        <InputText v-model="addressForm.post_code" class="w-full" />
                    </div>

                    <div>
                        <label>Miasto</label>
                        <InputText v-model="addressForm.city" class="w-full" />
                    </div>

                    <div>
                        <label>Kraj</label>
                        <InputText v-model="addressForm.country" class="w-full" />
                    </div>
                </div>

                <Button label="Zapisz adres" class="mt-6 w-full" @click="saveAddress" />
            </TabPanel>

            <!-- HASŁO -->
            <TabPanel header="Bezpieczeństwo">
                <div class="mt-4 grid gap-4">
                    <div>
                        <label>Aktualne hasło</label>
                        <Password v-model="passwordForm.current_password" toggleMask class="w-full" />
                    </div>

                    <div>
                        <label>Nowe hasło</label>
                        <Password v-model="passwordForm.password" toggleMask class="w-full" />
                    </div>

                    <div>
                        <label>Powtórz hasło</label>
                        <Password v-model="passwordForm.password_confirmation" toggleMask class="w-full" />
                    </div>
                </div>

                <Button label="Zmień hasło" class="mt-6 w-full" @click="changePassword" />
            </TabPanel>
        </TabView>
    </div>
</template>
