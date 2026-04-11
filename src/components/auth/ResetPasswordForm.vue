<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ResetPasswordForm } from '@/types/auth.ts';
import type { FormSubmitEvent } from '@primevue/forms';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.ts';
import { AxiosError } from 'axios';
import { useToast } from 'primevue/usetoast';
import { router } from '@/router.ts';
import { useLoadingStore } from '@/stores/loading.ts';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const toast = useToast();
const { resetPassword } = useAuthStore();

const route = useRoute();
const token = route.query.token as string;
const email = route.query.email as string;

const loadingStore = useLoadingStore();
const { isLoading } = storeToRefs(loadingStore);

const initialValues = ref<ResetPasswordForm>({
    password: '',
    password_confirmation: '',
});

const serverErrors = ref<Record<string, string[]>>({});

const resolver = computed(() =>
    zodResolver(
        z
            .object({
                password: z.string().min(8, { message: t('validation.minLength', { length: 8 }) }),
                password_confirmation: z.string(),
            })
            .refine((data) => data.password === data.password_confirmation, {
                message: t('validation.passwordNotMatch'),
                path: ['password_confirmation'],
            }),
    ),
);

const onFormSubmit = async (e: FormSubmitEvent) => {
    serverErrors.value = {};

    if (e.valid) {
        const { password, password_confirmation } = e.values;

        try {
            await resetPassword({ email, password, password_confirmation, token });

            toast.add({
                severity: 'success',
                summary: t('auth.passwordChangedSuccessfully'),
                life: 3000,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                serverErrors.value = error.response?.data.errors;
            }
        }
    }
};

const onFormChange = () => {
    if (Object.keys(serverErrors.value).length > 0) {
        serverErrors.value = {};
    }
};

onBeforeMount(() => {
    if (!token || !email) {
        router.push('/login');
    }
});
</script>

<template>
    <div class="flex justify-center">
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onFormSubmit"
            @input="onFormChange"
            class="flex w-full flex-col gap-4"
        >
            <div class="flex flex-col gap-1">
                <label for="password" class="text-sm font-semibold">{{ $t('field.newPassword') }}</label>
                <Password name="password" :feedback="false" toggleMask fluid />

                <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">
                    <ul class="my-0 flex flex-col gap-1">
                        <li v-for="(error, index) of $form.password.errors" :key="index">{{ error.message }}</li>
                    </ul>
                </Message>
            </div>

            <div class="flex flex-col gap-1">
                <label for="password_confirmation" class="text-sm font-semibold">
                    {{ $t('field.reenterNewPassword') }}
                </label>
                <Password name="password_confirmation" :feedback="false" toggleMask fluid />

                <Message v-if="$form.password_confirmation?.invalid" severity="error" size="small" variant="simple">
                    <ul class="my-0 flex flex-col gap-1">
                        <li v-for="(error, index) of $form.password_confirmation.errors" :key="index">
                            {{ error.message }}
                        </li>
                    </ul>
                </Message>

                <Message v-if="serverErrors" severity="error" size="small" variant="simple">
                    <ul class="my-0 flex flex-col gap-1">
                        <li v-for="(error, index) of serverErrors" :key="index">{{ error[0] }}</li>
                    </ul>
                </Message>
            </div>

            <Button type="submit" severity="primary" :label="$t('auth.changePassword')" :loading="isLoading" />
        </Form>
    </div>
</template>
