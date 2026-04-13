<script setup lang="ts">
import AuthHeader from '@/components/auth/AuthHeader.vue';
import ContactInformationForm from '@/components/auth/ContactInformationForm.vue';
import UniversityHeader from '@/components/ui/UniversityHeader.vue';
import AddressForm from '@/components/auth/AddressForm.vue';
import { useRegisterFormStore } from '@/stores/registerForm.ts';
import PersonalInformationForm from '@/components/auth/PersonalInformationForm.vue';
import { useAuthStore } from '@/stores/auth.ts';
import type { FormSubmitEvent } from '@primevue/forms';
import { AxiosError } from 'axios';
import { ref } from 'vue';

definePage({
    meta: {
        layout: 'auth',
        requiresGuest: true,
        authMaxWidth: 'max-w-5xl',
    },
});

const registerFormStore = useRegisterFormStore();
const { register } = useAuthStore();

const activeStep = ref('1');

const handleStepSave = (
    values: FormSubmitEvent,
    activateCallback: (step: string | number) => void,
    nextStep: string,
) => {
    Object.assign(registerFormStore.formData, values);

    activateCallback(nextStep);
};

const registerAccount = async (values: FormSubmitEvent) => {
    registerFormStore.clearServerErrors();

    Object.assign(registerFormStore.formData, values);

    try {
        await register(registerFormStore.formData);
        registerFormStore.resetForm();
    } catch (error) {
        if (error instanceof AxiosError) {
            const errors = error.response?.data?.errors;
            registerFormStore.serverErrors = errors || {};

            if (errors) {
                const errorKeys = Object.keys(errors);
                const stepOneFields = [
                    'first_name',
                    'middle_name',
                    'last_name',
                    'date_of_birth',
                    'pesel',
                    'document_number',
                    'gender',
                ];
                const stepTwoFields = [
                    'country_id',
                    'voivodeship_id',
                    'state',
                    'post_code',
                    'city',
                    'street',
                    'house_number',
                    'apartment_number',
                    'post_office',
                    'm_country_id',
                    'm_voivodeship_id',
                    'm_state',
                    'm_post_code',
                    'm_city',
                    'm_street',
                    'm_house_number',
                    'm_apartment_number',
                    'm_post_office',
                ];

                if (errorKeys.some((key) => stepOneFields.includes(key))) {
                    activeStep.value = '1';
                } else if (errorKeys.some((key) => stepTwoFields.includes(key))) {
                    activeStep.value = '2';
                }
            }
        }
    }
};
</script>

<template>
    <UniversityHeader />

    <AuthHeader
        :title="$t('auth.createCandidateAccount')"
        :subtitle="$t('auth.enterDataToStart')"
        :mobile-visibility="true"
    />

    <div class="flex w-full justify-center">
        <Stepper v-model:value="activeStep" linear class="w-full">
            <StepList>
                <Step value="1">
                    <span class="hidden sm:inline lg:hidden xl:inline">
                        {{ $t('auth.registerProcess.personalInformation') }}
                    </span>
                </Step>
                <Step value="2">
                    <span class="hidden sm:inline lg:hidden xl:inline">
                        {{ $t('auth.registerProcess.address') }}
                    </span>
                </Step>
                <Step value="3">
                    <span class="hidden sm:inline lg:hidden xl:inline">
                        {{ $t('auth.registerProcess.contactAndLoginInformation') }}
                    </span>
                </Step>
            </StepList>
            <StepPanels>
                <StepPanel v-slot="{ activateCallback }" value="1" class="bg-transparent">
                    <PersonalInformationForm @next-step="(values) => handleStepSave(values, activateCallback, '2')" />
                </StepPanel>

                <StepPanel v-slot="{ activateCallback }" value="2" class="bg-transparent">
                    <AddressForm
                        @back-step="(values) => handleStepSave(values, activateCallback, '1')"
                        @next-step="(values) => handleStepSave(values, activateCallback, '3')"
                    />
                </StepPanel>

                <StepPanel v-slot="{ activateCallback }" value="3" class="bg-transparent">
                    <ContactInformationForm
                        @back-step="(values) => handleStepSave(values, activateCallback, '2')"
                        @next-step="(values) => registerAccount(values)"
                    />
                </StepPanel>
            </StepPanels>
        </Stepper>
    </div>

    <p class="flex justify-center">
        {{ $t('auth.haveAccount') }}&nbsp;
        <RouterLink
            to="/login"
            class="text-uk-800 hover:text-uk-900 dark:text-uk-300 dark:hover:text-uk-400 font-semibold transition-colors"
        >
            {{ $t('auth.signIn') }}
        </RouterLink>
    </p>
</template>
