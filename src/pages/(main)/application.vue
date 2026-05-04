<script setup lang="ts">
import { ref } from 'vue';
import api from '@/plugins/axios';
import { useToast } from 'primevue/usetoast';
import { onMounted } from 'vue';
import { useRecruitmentStore } from '@/stores/recruitment';

const toast = useToast();
const recruitmentStore = useRecruitmentStore();
const { recruitments } = recruitmentStore;

onMounted(async () => {
    await recruitmentStore.fetchRecruitments();
});

const form = ref({
    exam_type: '',
});

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
    } catch (e: any) {
        console.error(e.response?.data);
    }
};
</script>

<template>
<pre>{{ r }}</pre>
<TabPanel header="Kierunki i koszty">
    <div class="space-y-3 mt-4">

        <div
            v-for="r in recruitments"
            :key="r.id"
            class="p-4 border rounded flex justify-between items-center"
        >
            <div class="font-bold">
    {{ r.major?.name }}
</div>

<div class="text-sm text-gray-500">
    Rekrutacja aktywna
</div>

<div class="text-right font-bold">
    {{ r.cost?.amount }} PLN
</div>
        </div>

    </div>
</TabPanel>
    <div class="max-w-xl mx-auto p-6 space-y-4">

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

        <Button label="Zapisz" class="w-full mt-4" @click="save" />
    </div>
</template>