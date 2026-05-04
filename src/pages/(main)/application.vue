<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { useToast } from 'primevue/usetoast';
import { useRecruitmentStore } from '@/stores/recruitment';
import { storeToRefs } from 'pinia';

const toast = useToast();

const recruitmentStore = useRecruitmentStore();
const { recruitments } = storeToRefs(recruitmentStore); // ✅ FIX

onMounted(async () => {
    await recruitmentStore.fetchRecruitments();
});

const form = ref({
    exam_type: '',
});

const formatDate = (date: string) => {
    if (!date) return '';

    return new Date(date).toLocaleDateString('pl-PL');
};

const examTypes = [
    { label: 'Nowa matura', value: 'new_matura' },
    { label: 'Stara matura (przed 1991)', value: 'old_matura_pre_1991' },
    { label: 'Stara matura (po 1991)', value: 'old_matura_post_1991' },
    { label: 'International Baccalaureate', value: 'international_baccalaureate' },
    { label: 'European Baccalaureate', value: 'european_baccalaureate' },
    { label: 'Zagraniczna', value: 'foreign' },
];

const save = async () => {
    try {
        await api.put('/v1/application', form.value);

        toast.add({
            severity: 'success',
            summary: 'Zapisano',
            life: 3000,
        });
    } catch (e: unknown) {
        console.error(e.response?.data);
    }
};
</script>

<template>
    <TabPanel header="Kierunki i koszty">
        <div class="mt-4 space-y-3">
            <div v-for="r in recruitments" :key="r.id" class="flex items-center justify-between rounded border p-4">
                <div>
                    <div class="font-bold">
                        {{ r.major?.name }}
                        <!-- ✅ FIX -->
                    </div>

                    <div class="text-sm text-gray-500">
                        {{ formatDate(r.start_date) }} - {{ formatDate(r.end_date) }}
                    </div>
                </div>

                <div class="text-right font-bold">
                    {{ r.cost?.price ? r.cost.price + ' PLN' : 'Brak ceny' }}
                </div>
            </div>
        </div>
    </TabPanel>

    <div class="mx-auto max-w-xl space-y-4 p-6">
        <h1 class="text-xl font-bold">Typ egzaminu</h1>

        <div class="flex flex-col gap-2">
            <label>Wybierz typ egzaminu</label>

            <Select
                v-model="form.exam_type"
                :options="examTypes"
                optionLabel="label"
                optionValue="value"
                placeholder="Wybierz..."
                class="w-full"
            />
        </div>

        <Button label="Zapisz" class="mt-4 w-full" @click="save" />
    </div>
</template>
