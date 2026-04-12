<script setup lang="ts">
import { useRegisterFormStore } from '@/stores/registerForm.ts';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { contactInformationSchema } from '@/schemas/registerSchema.ts';
import type { FormSubmitEvent } from '@primevue/forms';

const emit = defineEmits(['nextStep', 'backStep']);

const { t } = useI18n();

const registerFormStore = useRegisterFormStore();

const resolver = computed(() => zodResolver(contactInformationSchema(t)));

const onFormSubmit = ({ valid, values }: FormSubmitEvent) => {
    if (valid) {
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
        <div class="col-span-full flex flex-col gap-1">
            <label for="email" class="text-sm font-semibold">{{ $t('field.email') }}</label>
            <InputText id="email" name="email" type="email" fluid />
            <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                {{ $form.email.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.email" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.email[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="password" class="text-sm font-semibold">{{ $t('field.password') }}</label>
            <Password name="password" :feedback="false" toggleMask fluid />

            <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                <ul class="my-0 flex flex-col gap-1">
                    <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                </ul>
            </Message>
            <Message v-if="registerFormStore.serverErrors?.password" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.password[0] }}
            </Message>
        </div>

        <div class="flex flex-col gap-1">
            <label for="password_confirmation" class="text-sm font-semibold">
                {{ $t('field.confirmPassword') }}
            </label>
            <Password name="password_confirmation" :feedback="false" toggleMask fluid />

            <Message v-if="$form.password_confirmation?.invalid" severity="error" size="small" variant="simple">
                <ul class="my-0 flex flex-col gap-1">
                    <li v-for="(error, index) of $form.password_confirmation.errors" :key="index">
                        {{ error.message }}
                    </li>
                </ul>
            </Message>
            <Message
                v-if="registerFormStore.serverErrors?.password_confirmation"
                severity="error"
                size="small"
                variant="simple"
            >
                {{ registerFormStore.serverErrors?.password_confirmation[0] }}
            </Message>
        </div>

        <div class="col-span-full flex flex-col gap-1">
            <label for="phone_number" class="text-sm font-semibold">
                {{ $t('field.phone') }}
            </label>

            <InputGroup class="w-full">
                <InputMask name="phone_prefix" mask="+9?999" placeholder="+XX" class="max-w-20" />

                <InputText id="phone_number" name="phone_number" placeholder="123 456 789" type="tel" />
            </InputGroup>

            <Message v-if="$form.phone_prefix?.invalid" severity="error" size="small" variant="simple">
                {{ $form.phone_prefix.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.phone_prefix" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.phone_prefix[0] }}
            </Message>

            <Message v-if="$form.phone_number?.invalid" severity="error" size="small" variant="simple">
                {{ $form.phone_number.error?.message }}
            </Message>
            <Message v-if="registerFormStore.serverErrors?.phone_number" severity="error" size="small" variant="simple">
                {{ registerFormStore.serverErrors?.phone_number[0] }}
            </Message>
        </div>

        <div class="col-span-full flex justify-between pt-6">
            <Button
                type="button"
                :label="$t('stepperPagination.back')"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="emit('backStep')"
            />

            <Button type="submit" :label="$t('auth.signUp')" icon="pi pi-arrow-right" iconPos="right" />
        </div>
    </Form>
</template>
