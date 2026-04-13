<script setup lang="ts">
import { computed } from 'vue';
import { Gender } from '@/types/gender.ts';
import { useI18n } from 'vue-i18n';
import { useRegisterFormStore } from '@/stores/registerForm.ts';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { personalInformationSchema } from '@/schemas/registerSchema.ts';
import type { FormSubmitEvent } from '@primevue/forms';

const emit = defineEmits(['nextStep']);

const { t } = useI18n();
const registerFormStore = useRegisterFormStore();

const genders = computed(() => {
    return Object.values(Gender).map((value) => ({
        name: t(`gender.${value}`),
        value,
    }));
});

const resolver = computed(() => zodResolver(personalInformationSchema(t, registerFormStore.formData.no_pesel)));

const onFormSubmit = ({ valid, values }: FormSubmitEvent) => {
    if (valid) {
        if (registerFormStore.formData.no_pesel) {
            delete values.pesel;
            registerFormStore.formData.pesel = null;
        } else {
            delete values.document_number;
            registerFormStore.formData.document_number = null;
        }

        emit('nextStep', values);
    }
};
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
            <label for="first_name" class="text-sm font-semibold">{{ $t('field.firstName') }}</label>
            <InputText id="first_name" name="first_name" type="text" fluid />
            <Message v-if="$form.first_name?.invalid" severity="error" size="small" variant="simple">
                {{ $form.first_name.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.first_name" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.first_name[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="middle_name" class="text-sm font-semibold"
                >{{ $t('field.middleName') }} ({{ $t('field.optional') }})</label
            >
            <InputText id="middle_name" name="middle_name" type="text" fluid />
            <Message v-if="$form.middle_name?.invalid" severity="error" size="small" variant="simple">
                {{ $form.middle_name.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.middle_name" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.middle_name[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="last_name" class="text-sm font-semibold">{{ $t('field.lastName') }}</label>
            <InputText id="last_name" name="last_name" type="text" fluid />
            <Message v-if="$form.last_name?.invalid" severity="error" size="small" variant="simple">
                {{ $form.last_name.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.last_name" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.last_name[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="date_of_birth" class="text-sm font-semibold">{{ $t('field.dateOfBirth') }}</label>
            <DatePicker
                id="date_of_birth"
                name="date_of_birth"
                v-model="registerFormStore.formData.date_of_birth"
                dateFormat="yy-mm-dd"
                dataType="string"
                showIcon
                iconDisplay="input"
                :placeholder="$t('placeholder.dateFormat')"
                fluid
            />
            <Message v-if="$form.date_of_birth?.invalid" severity="error" size="small" variant="simple">
                {{ $form.date_of_birth.error?.message }}
            </Message>
            <Message
                v-if="registerFormStore.serverErrors?.date_of_birth"
                severity="error"
                size="small"
                variant="simple"
            >
                {{ registerFormStore.serverErrors?.date_of_birth[0] }}
            </Message>
        </div>

        <div>
            <div v-if="!registerFormStore.formData.no_pesel" class="flex flex-col gap-1">
                <label for="pesel" class="text-sm font-semibold">{{ $t('field.pesel') }}</label>
                <InputMask id="pesel" name="pesel" mask="99999999999" type="text" fluid />
                <Message v-if="$form.pesel?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.pesel.error?.message }}
                </Message>
                <Message v-if="registerFormStore.serverErrors?.pesel" severity="error" size="small" variant="simple">
                    {{ registerFormStore.serverErrors?.pesel[0] }}
                </Message>
            </div>

            <div v-else class="flex flex-col gap-1">
                <label for="document_number" class="text-sm font-semibold">{{ $t('field.otherDocument') }}</label>
                <InputText id="document_number" name="document_number" type="text" fluid />
                <Message v-if="$form.document_number?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.document_number.error?.message }}
                </Message>
                <Message
                    v-if="registerFormStore.serverErrors?.document_number"
                    severity="error"
                    size="small"
                    variant="simple"
                >
                    {{ registerFormStore.serverErrors?.document_number[0] }}
                </Message>
            </div>

            <div class="mt-2 flex items-center gap-2">
                <Checkbox v-model="registerFormStore.formData.no_pesel" inputId="no_pesel" binary size="small" />
                <label for="no_pesel" class="text-sm"> {{ $t('auth.registerProcess.noPeselNumber') }}</label>
            </div>
        </div>

        <div class="flex flex-col gap-1">
            <label for="gender" class="text-sm font-semibold">{{ $t('field.gender') }}</label>
            <Select
                name="gender"
                :options="genders"
                optionLabel="name"
                optionValue="value"
                :placeholder="$t('placeholder.selectGender')"
                fluid
            />
            <Message v-if="$form.gender?.invalid" severity="error" size="small" variant="simple">
                {{ $form.gender.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.gender" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.gender[0] }}
            </Message>
        </div>

        <div class="col-span-full flex justify-end pt-6">
            <Button type="submit" :label="$t('stepperPagination.next')" icon="pi pi-arrow-right" iconPos="right" />
        </div>
    </Form>
</template>
