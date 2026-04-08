<script setup lang="ts">
import { computed, ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useToast } from 'primevue/usetoast';
import type { FormSubmitEvent } from '@primevue/forms';
import { useI18n } from 'vue-i18n';
import { AxiosError } from 'axios';
import type { LoginForm } from '@/types/auth.ts';
import { useAuthStore } from '@/stores/auth.ts';

const { t } = useI18n();
const toast = useToast();
const { login } = useAuthStore();

const initialValues = ref<LoginForm>({
    email: '',
    password: '',
});

const serverErrors = ref<Record<string, string[]>>({});

const resolver = computed(() =>
    zodResolver(
        z.object({
            email: z.string().min(1, {
                message: t('validation.isRequired', {
                    field: t('field.email').toLowerCase(),
                }),
            }),
            password: z.string().min(1, {
                message: t('validation.isRequired', {
                    field: t('field.password').toLowerCase(),
                }),
            }),
        }),
    ),
);

const onFormSubmit = async (e: FormSubmitEvent) => {
    if (e.valid) {
        const { email, password } = e.values;

        try {
            await login({ email, password });
            toast.add({ severity: 'success', summary: t('auth.loggedInSuccessfully'), life: 3000 });

            e.reset();
        } catch (error) {
            if (error instanceof AxiosError) {
                serverErrors.value = error.response?.data?.errors;
            }
        }
    }
};

const onFormChange = () => {
    if (Object.keys(serverErrors.value).length > 0) {
        serverErrors.value = {};
    }
};
</script>

<template>
    <div class="flex justify-center">
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            @input="onFormChange"
            class="mb-12 flex w-full flex-col gap-4"
        >
            <div class="flex flex-col gap-1">
                <label for="email" class="text-sm font-semibold">{{ $t('field.email') }}</label>
                <InputText id="email" name="email" type="email" fluid />
                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.email.error.message }}
                </Message>

                <Message v-if="serverErrors.email" severity="error" size="small" variant="simple">
                    {{ serverErrors.email[0] }}
                </Message>
            </div>

            <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                    <label for="password" class="text-sm font-semibold">{{ $t('field.password') }}</label>
                    <a href="#" class="text-sm">{{ $t('auth.forgotPassword') }}</a>
                </div>

                <Password id="password" name="password" :feedback="false" toggleMask fluid />
                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                    <ul class="my-0 flex flex-col gap-1">
                        <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                    </ul>
                </Message>

                <Message v-if="serverErrors.password" severity="error" size="small" variant="simple">
                    {{ serverErrors.password[0] }}
                </Message>
            </div>

            <Button type="submit" severity="primary" :label="t('auth.signIn')" />
        </Form>
    </div>
</template>
