import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/plugins/axios';
import type { Recruitment } from '@/types/recruitment';

export const useRecruitmentStore = defineStore('recruitment', () => {
    const recruitments = ref<Recruitment[]>([]);

    const fetchRecruitments = async () => {
        try {
            const res = await api.get('/v1/recruitments');
            recruitments.value = res.data;
        } catch (e: unknown) {
            console.error(e);
        }
    };

    return {
        recruitments,
        fetchRecruitments,
    };
});
