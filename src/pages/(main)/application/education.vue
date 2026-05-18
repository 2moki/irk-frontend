<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

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
        // await api.put('/v1/application', form.value);

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
    <div class="mx-auto max-w-xl space-y-4">
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
