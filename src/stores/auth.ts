import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { LoginForm, User } from '@/types/auth.ts';
import { axiosInstance } from '@/services/api/axiosInstance.ts';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore(
    'auth',
    () => {
        const user = ref<User | null>(null);
        const isAuthenticated = ref<boolean>(false);
        const redirectPath = ref<string | null>(null);

        const router = useRouter();

        const getCsrf = async () => {
            await axiosInstance.get('/sanctum/csrf-cookie');
        };

        const login = async (payload: LoginForm) => {
            await getCsrf();

            await axiosInstance.post('/api/auth/login', payload);
            await fetchUser();

            await router.push(redirectPath.value || '/');
        };

        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get('/api/v1/user');
                user.value = res.data;
                isAuthenticated.value = true;
            } catch (error) {
                console.error(error);
            }
        };

        const logout = async () => {
            await getCsrf();

            try {
                await axiosInstance.post('/api/auth/logout');
                user.value = null;
                isAuthenticated.value = false;

                await router.push('/login');
            } catch (error) {
                console.error(error);
            }
        };

        return {
            user,
            isAuthenticated,
            redirectPath,
            login,
            logout,
        };
    },
    {
        persist: {
            pick: ['user', 'isAuthenticated'],
        },
    },
);
