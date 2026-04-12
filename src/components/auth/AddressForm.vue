<script setup lang="ts">
import { useRegisterFormStore } from '@/stores/registerForm.ts';
import { useCountryStore } from '@/stores/country.ts';
import { computed, onMounted } from 'vue';
import type { SelectChangeEvent } from 'primevue';
import { useVoivodeshipStore } from '@/stores/voivodeship.ts';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useI18n } from 'vue-i18n';
import { addressSchema } from '@/schemas/registerSchema.ts';
import type { FormSubmitEvent } from '@primevue/forms';

const emit = defineEmits(['nextStep', 'backStep']);

const { t } = useI18n();

const registerFormStore = useRegisterFormStore();
const countryStore = useCountryStore();
const voivodeshipStore = useVoivodeshipStore();

const isPoland = computed(() => {
    if (registerFormStore.formData.country_id === null) return true;

    const currentId = registerFormStore.formData.country_id;
    return currentId === countryStore.polandId;
});

const resolver = computed(() =>
    zodResolver(addressSchema(t, isPoland.value, registerFormStore.formData.different_mailing_address)),
);

const countryChange = (e: SelectChangeEvent) => {
    const selectedId = e.value;

    registerFormStore.formData.country_id = selectedId;
    registerFormStore.formData.m_country_id = selectedId;
};

const onFormSubmit = ({ valid, values }: FormSubmitEvent) => {
    if (valid) {
        if (isPoland.value) {
            delete values.state;
            registerFormStore.formData.state = null;
        } else {
            delete values.voivodeship_id;
            registerFormStore.formData.voivodeship_id = null;
        }

        emit('nextStep', values);
    }
};

onMounted(async () => {
    await countryStore.fetchCountries();
    await voivodeshipStore.fetchVoivodeships();

    if (registerFormStore.formData.country_id === null && countryStore.polandId) {
        registerFormStore.formData.country_id = countryStore.polandId;
        registerFormStore.formData.m_country_id = countryStore.polandId;
    }
});
</script>

<template>
    <Form
        v-slot="$form"
        :initialValues="registerFormStore.formData"
        :resolver
        @submit="onFormSubmit"
        class="grid w-full grid-cols-1 gap-4 lg:grid-cols-2"
    >
        <div class="flex flex-col gap-1">
            <label for="country_id" class="text-sm font-semibold">{{ $t('field.country') }}</label>
            <Select
                v-model="registerFormStore.formData.country_id"
                name="country_id"
                inputId="country_id"
                :options="countryStore.getLocalizedCountries()"
                filter
                optionLabel="name"
                optionValue="id"
                :placeholder="$t('placeholder.selectCountry')"
                @change="countryChange"
                fluid
            />
            <Message v-if="$form.country_id?.invalid" severity="error" size="small" variant="simple">
                {{ $form.country_id.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.country_id" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.country_id[0] }}
            </Message>
        </div>

        <div>
            <div v-if="isPoland" class="flex flex-col gap-1">
                <label for="voivodeship_id" class="text-sm font-semibold">{{ $t('field.voivodeship') }}</label>
                <Select
                    name="voivodeship_id"
                    :options="voivodeshipStore.getLocalizedVoivodeships()"
                    filter
                    optionLabel="name"
                    optionValue="id"
                    :placeholder="$t('placeholder.selectVoivodeship')"
                    fluid
                />
                <Message v-if="$form.voivodeship_id?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.voivodeship_id.error?.message }}
                </Message>
                <Message
                    v-if="registerFormStore.serverErrors?.voivodeship_id"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ registerFormStore.serverErrors?.voivodeship_id[0] }}
                </Message>
            </div>

            <div v-else class="flex flex-col gap-1">
                <label for="state" class="text-sm font-semibold">{{ $t('field.state') }}</label>
                <InputText id="state" name="state" type="text" fluid />
                <Message v-if="$form.state?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.state.error?.message }}
                </Message>
                <Message v-if="registerFormStore.serverErrors?.state" severity="error" size="small" variant="simple">
                    {{ registerFormStore.serverErrors?.state[0] }}
                </Message>
            </div>
        </div>

        <div class="flex flex-col gap-1">
            <label for="post_code" class="text-sm font-semibold">{{ $t('field.postCode') }}</label>
            <InputText id="post_code" name="post_code" type="text" fluid />
            <Message v-if="$form.post_code?.invalid" severity="error" size="small" variant="simple">
                {{ $form.post_code.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.post_code" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.post_code[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="city" class="text-sm font-semibold">{{ $t('field.city') }}</label>
            <InputText id="city" name="city" type="text" />
            <Message v-if="$form.city?.invalid" severity="error" size="small" variant="simple">
                {{ $form.city.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.city" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.city[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="street" class="text-sm font-semibold">{{ $t('field.street') }}</label>
            <InputText id="street" name="street" type="text" />
            <Message v-if="$form.street?.invalid" severity="error" size="small" variant="simple">
                {{ $form.street.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.street" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.street[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="house_number" class="text-sm font-semibold">{{ $t('field.houseNumber') }}</label>
            <InputText id="house_number" name="house_number" type="text" />
            <Message v-if="$form.house_number?.invalid" severity="error" size="small" variant="simple">
                {{ $form.house_number.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.house_number" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.house_number[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="apartment_number" class="text-sm font-semibold">
                {{ $t('field.apartmentNumber') }} ({{ $t('field.optional') }})
            </label>
            <InputText id="apartment_number" name="apartment_number" type="text" />
            <Message v-if="$form.apartment_number?.invalid" severity="error" size="small" variant="simple">
                {{ $form.apartment_number.error?.message }}
            </Message>
            <Message
                v-if="registerFormStore.serverErrors?.apartment_number"
                severity="error"
                size="small"
                variant="simple"
            >
                {{ registerFormStore.serverErrors?.apartment_number[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="post_office" class="text-sm font-semibold">{{ $t('field.postOffice') }}</label>
            <InputText id="post_office" name="post_office" type="text" />
            <Message v-if="$form.post_office?.invalid" severity="error" size="small" variant="simple">
                {{ $form.post_office.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.post_office" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.post_office[0] }}
            </Message>
        </div>

        <div class="col-span-full my-2 flex items-center gap-2">
            <Checkbox
                v-model="registerFormStore.formData.different_mailing_address"
                inputId="different_mailing_address"
                binary
                size="small"
            />
            <label for="different_mailing_address" class="text-sm">
                {{ $t('auth.registerProcess.otherMailingAddress') }}</label
            >
        </div>

        <div
            v-if="registerFormStore.formData.different_mailing_address"
            class="col-span-full grid w-full grid-cols-1 gap-4 lg:grid-cols-2"
        >
            <div class="flex flex-col gap-1">
                <label for="m_country_id" class="text-sm font-semibold">{{ $t('field.country') }}</label>
                <Select
                    v-model="registerFormStore.formData.m_country_id"
                    name="m_country_id"
                    inputId="m_country_id"
                    :options="countryStore.getLocalizedCountries()"
                    filter
                    optionLabel="name"
                    optionValue="id"
                    :placeholder="$t('placeholder.selectCountry')"
                    @change="countryChange"
                    fluid
                />
                <Message v-if="$form.m_country_id?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.m_country_id.error?.message }}
                </Message>
                <Message
                    v-if="registerFormStore.serverErrors?.m_country_id"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ registerFormStore.serverErrors?.m_country_id[0] }}
                </Message>
            </div>

            <div>
                <div v-if="isPoland" class="flex flex-col gap-1">
                    <label for="m_voivodeship_id" class="text-sm font-semibold">{{ $t('field.voivodeship') }}</label>
                    <Select
                        name="m_voivodeship_id"
                        :options="voivodeshipStore.getLocalizedVoivodeships()"
                        filter
                        optionLabel="name"
                        optionValue="id"
                        :placeholder="$t('placeholder.selectVoivodeship')"
                        fluid
                    />
                    <Message v-if="$form.m_voivodeship_id?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.m_voivodeship_id.error?.message }}
                    </Message>
                    <Message
                        v-if="registerFormStore.serverErrors?.m_voivodeship_id"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ registerFormStore.serverErrors?.m_voivodeship_id[0] }}
                    </Message>
                </div>

                <div v-else class="flex flex-col gap-1">
                    <label for="m_state" class="text-sm font-semibold">{{ $t('field.state') }}</label>
                    <InputText id="m_state" name="m_state" type="text" fluid />
                    <Message v-if="$form.m_state?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.m_state.error?.message }}
                    </Message>
                    <Message
                        v-if="registerFormStore.serverErrors?.m_state"
                        severity="error"
                        size="small"
                        variant="simple"
                    >
                        {{ registerFormStore.serverErrors?.m_state[0] }}
                    </Message>
                </div>
            </div>

            <div class="flex flex-col gap-1">
                <label for="m_post_code" class="text-sm font-semibold">{{ $t('field.postCode') }}</label>
                <InputText id="m_post_code" name="m_post_code" type="text" fluid />
                <Message v-if="$form.m_post_code?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.m_post_code.error?.message }}
                </Message>
                <Message
                    v-if="registerFormStore.serverErrors?.m_post_code"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ registerFormStore.serverErrors?.m_post_code[0] }}
                </Message>
            </div>

            <div class="flex flex-col gap-1">
                <label for="m_city" class="text-sm font-semibold">{{ $t('field.city') }}</label>
                <InputText id="m_city" name="m_city" type="text" />
                <Message v-if="$form.m_city?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.m_city.error?.message }}
                </Message>
                <Message v-if="registerFormStore.serverErrors?.m_city" severity="error" size="small" variant="simple">
                    {{ registerFormStore.serverErrors?.m_city[0] }}
                </Message>
            </div>

            <div class="flex flex-col gap-1">
                <label for="m_street" class="text-sm font-semibold">{{ $t('field.street') }}</label>
                <InputText id="m_street" name="m_street" type="text" />
                <Message v-if="$form.m_street?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.m_street.error?.message }}
                </Message>
                <Message v-if="registerFormStore.serverErrors?.m_street" severity="error" size="small" variant="simple">
                    {{ registerFormStore.serverErrors?.m_street[0] }}
                </Message>
            </div>

            <div class="flex flex-col gap-1">
                <label for="m_house_number" class="text-sm font-semibold">{{ $t('field.houseNumber') }}</label>
                <InputText id="m_house_number" name="m_house_number" type="text" />
                <Message v-if="$form.m_house_number?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.m_house_number.error?.message }}
                </Message>
                <Message
                    v-if="registerFormStore.serverErrors?.m_house_number"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ registerFormStore.serverErrors?.m_house_number[0] }}
                </Message>
            </div>

            <div class="flex flex-col gap-1">
                <label for="m_apartment_number" class="text-sm font-semibold">
                    {{ $t('field.apartmentNumber') }} ({{ $t('field.optional') }})
                </label>
                <InputText id="m_apartment_number" name="m_apartment_number" type="text" />
                <Message v-if="$form.m_apartment_number?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.m_apartment_number.error?.message }}
                </Message>
                <Message
                    v-if="registerFormStore.serverErrors?.m_apartment_number"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ registerFormStore.serverErrors?.m_apartment_number[0] }}
                </Message>
            </div>

            <div class="flex flex-col gap-1">
                <label for="m_post_office" class="text-sm font-semibold">{{ $t('field.postOffice') }}</label>
                <InputText id="m_post_office" name="m_post_office" type="text" />
                <Message v-if="$form.m_post_office?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.m_post_office.error?.message }}
                </Message>
                <Message
                    v-if="registerFormStore.serverErrors?.m_post_office"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ registerFormStore.serverErrors?.m_post_office[0] }}
                </Message>
            </div>
        </div>

        <div class="col-span-full flex justify-between pt-6">
            <Button
                type="button"
                :label="$t('stepperPagination.back')"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="emit('backStep')"
            />

            <Button type="submit" :label="$t('stepperPagination.next')" icon="pi pi-arrow-right" iconPos="right" />
        </div>
    </Form>
</template>
