import axios from 'axios';
import i18n from '@/plugins/i18n.ts';

export const axiosInstance = axios.create({
    baseURL: '/',
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

axiosInstance.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = i18n.global.locale.value;
    return config;
})
