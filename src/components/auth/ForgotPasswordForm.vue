<script setup lang="ts">
import { computed, ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth.ts';
import type { FormSubmitEvent } from '@primevue/forms';
import type { ForgotPasswordForm } from '@/types/auth.ts';
import { AxiosError } from 'axios';
import { useCountdown } from '@vueuse/core';
import { useLoadingStore } from '@/stores/loading.ts';
import { storeToRefs } from 'pinia';

const { t } = useI18n();
const { forgotPassword } = useAuthStore();
const { remaining, start } = useCountdown(60, {
    onComplete() {
        hasSent.value = false;
    },
});
const loadingStore = useLoadingStore();
const { isLoading } = storeToRefs(loadingStore);

const initialValues = ref<ForgotPasswordForm>({
    email: '',
});

const serverErrors = ref<Record<string, string[]>>({});
const hasSent = ref<boolean>(false);

const resolver = computed(() =>
    zodResolver(
        z.object({
            email: z
                .email({
                    message: t('validation.invalidEmail'),
                })
                .min(1, {
                    message: t('validation.isRequired', {
                        field: t('field.email').toLowerCase(),
                    }),
                }),
        }),
    ),
);

const onFormSubmit = async (e: FormSubmitEvent) => {
    hasSent.value = false;
    serverErrors.value = {};

    if (e.valid) {
        const { email } = e.values;

        try {
            await forgotPassword({ email });

            hasSent.value = true;
            start();
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

    hasSent.value = false;
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
                <InputText id="email" name="email" type="text" fluid />
                <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.email.error?.message }}
                </Message>

                <Message v-if="serverErrors?.email" severity="error" size="small" variant="simple">
                    {{ serverErrors?.email[0] }}
                </Message>
            </div>

            <Button
                type="submit"
                severity="primary"
                :label="$t('auth.sendEmailWithPasswordReset')"
                :disabled="hasSent"
                :loading="isLoading"
            />

            <Message v-if="hasSent" severity="success">
                {{ $t('auth.passwordResetLinkSent', { remaining }) }}
            </Message>
        </Form>
    </div>
</template>
