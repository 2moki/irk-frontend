import { defineStore } from 'pinia';
import { ref } from 'vue';
import { axiosInstance } from '@/services/api/axiosInstance';

export const useRecruitmentStore = defineStore('recruitment', () => {
    const recruitments = ref<any[]>([]);

    const fetchRecruitments = async () => {
        const res = await axiosInstance.get('/api/v1/recruitments');

        recruitments.value = res.data.data;
    };

    return {
        recruitments,
        fetchRecruitments,
    };
});