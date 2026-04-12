import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ForgotPasswordForm, LoginForm, RegisterForm, ResetPasswordPayload, User } from '@/types/auth.ts';
import { axiosInstance } from '@/services/api/axiosInstance.ts';
import { useRouter } from 'vue-router';
import { useLoadingStore } from '@/stores/loading.ts';

export const useAuthStore = defineStore(
    'auth',
    () => {
        const user = ref<User | null>(null);
        const isAuthenticated = ref<boolean>(false);
        const redirectPath = ref<string | null>(null);

        const router = useRouter();
        const { withLoading } = useLoadingStore();

        const getCsrf = async () => {
            await axiosInstance.get('/sanctum/csrf-cookie');
        };

        const register = withLoading(async (payload: RegisterForm) => {
            await getCsrf();

            await axiosInstance.post('/api/auth/register', payload);
            await fetchUser();

            await router.push('/');
        });

        const login = withLoading(async (payload: LoginForm) => {
            await getCsrf();

            await axiosInstance.post('/api/auth/login', payload);
            await fetchUser();

            await router.push(redirectPath.value || '/');
        });

        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get('/api/v1/user');
                user.value = res.data.data;
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

        const forgotPassword = withLoading(async (payload: ForgotPasswordForm) => {
            await getCsrf();

            await axiosInstance.post('/api/auth/forgot-password', payload);
        });

        const resetPassword = withLoading(async (payload: ResetPasswordPayload) => {
            await getCsrf();

            await axiosInstance.post('/api/auth/reset-password', payload);
            await router.push('/login');
        });

        return {
            user,
            isAuthenticated,
            redirectPath,
            register,
            login,
            logout,
            forgotPassword,
            resetPassword,
        };
    },
    {
        persist: {
            pick: ['user', 'isAuthenticated'],
        },
    },
);
