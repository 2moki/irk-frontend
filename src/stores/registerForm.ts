import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import type { RegisterForm } from '@/types/auth.ts';

export const useRegisterFormStore = defineStore(
    'registerForm',
    () => {
        const initialFormData = () => ({
            first_name: '',
            middle_name: null,
            last_name: '',
            email: '',
            phone_prefix: '',
            phone_number: '',
            no_pesel: false,
            pesel: null,
            document_number: null,
            date_of_birth: null,
            gender: '',
            password: '',
            password_confirmation: '',
            country_id: null,
            voivodeship_id: null,
            state: null,
            post_code: '',
            city: '',
            street: '',
            house_number: '',
            apartment_number: '',
            post_office: '',
            different_mailing_address: false,
            m_country_id: null,
            m_voivodeship_id: null,
            m_state: null,
            m_post_code: null,
            m_city: null,
            m_street: null,
            m_house_number: null,
            m_apartment_number: null,
            m_post_office: null,
        });

        const formData = reactive<RegisterForm>(initialFormData());
        const serverErrors = ref<Record<string, string[]>>({});

        const resetForm = () => {
            Object.assign(formData, initialFormData());
            serverErrors.value = {};
        };

        const clearServerErrors = () => {
            if (Object.keys(serverErrors.value).length > 0) {
                serverErrors.value = {};
            }
        };

        return {
            formData,
            serverErrors,
            resetForm,
            clearServerErrors,
        };
    },
    {
        persist: {
            storage: sessionStorage,
        },
    },
);
