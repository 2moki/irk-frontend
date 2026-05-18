<script setup lang="ts">
import { computed } from 'vue';
import { useMajorStore } from '@/stores/major';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { z } from 'zod';
import ApplicationDeadlinesInfo from '@/components/application/ApplicationDeadlinesInfo.vue';
import { useLocalizedEnums } from '@/composables/useLocalizedEnums';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const { getLocalizedMajorField } = useLocalizedEnums();
const majorStore = useMajorStore();
const toast = useToast();
const router = useRouter();

const orderedMajors = computed({
    get: () => majorStore.selectedMajors,
    set: (val) => majorStore.updateMajorsList(val),
});

const calculateHighestFee = (majors: typeof majorStore.selectedMajors) => {
    if (majors.length === 0) return 0;
    return Math.max(...majors.map((major) => parseFloat(major.recruitment.price || '0')));
};

const calculateSumFee = (majors: typeof majorStore.selectedMajors) => {
    return majors.reduce((sum, major) => sum + parseFloat(major.recruitment.price || '0'), 0);
};

const totalPrice = computed(() => {
    const selected = majorStore.selectedMajors;

    if (selected.length === 0) {
        return '0.00';
    }

    const billingType = selected[0]?.recruitment.academic_year?.billing_type;

    if (billingType === 'highest_fee_only') {
        return calculateHighestFee(selected).toFixed(2);
    }

    // TODO: each_group_separately has to be implemented properly in backend, it is sum of all major fees for now
    if (billingType === 'each_group_separately') {
        return calculateSumFee(selected).toFixed(2);
    }

    return calculateSumFee(selected).toFixed(2);
});

const validationSchema = z.object({
    majors: z.array(z.any()).min(1),
});

const validateAndProceed = () => {
    const result = validationSchema.safeParse({ majors: majorStore.selectedMajors });

    if (!result.success) {
        majorStore.errors = [t('study_programs.validation.select_at_least_one')];
        return;
    }

    majorStore.errors = [];
    toast.add({
        severity: 'success',
        summary: t('study_programs.success'),
        detail: t('study_programs.proceeding'),
        life: 3000,
    });

    // Przekierowanie na nową stronę po udanej walidacji
    router.push('/application/education');
};
</script>

<template>
    <aside class="space-y-6">
        <Card>
            <template #title>
                <h3 class="text-xl font-semibold">
                    {{ $t('study_programs.priority_list') }}
                </h3>
            </template>
            <template #content>
                <div class="space-y-4">
                    <p class="text-xs text-slate-500 italic dark:text-slate-400">
                        {{ $t('study_programs.drag_instruction') }}
                    </p>

                    <OrderList
                        v-if="majorStore.selectedMajors.length > 0"
                        v-model="orderedMajors"
                        dataKey="recruitment.id"
                    >
                        <template #option="{ option, index }">
                            <div
                                class="group flex w-full items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50"
                            >
                                <div
                                    class="group-hover:text-uk-600 dark:group-hover:text-uk-400 flex flex-col items-center gap-1 text-slate-300 transition-colors dark:text-slate-600"
                                >
                                    <span class="text-lg font-black">{{ index + 1 }}</span>
                                </div>
                                <div class="flex-1">
                                    <p class="text-uk-600 dark:text-uk-300 text-sm font-bold">
                                        {{ option.recruitment.major?.name }}
                                    </p>
                                    <p class="text-xs font-semibold text-slate-500 uppercase">
                                        {{
                                            getLocalizedMajorField('studyLevel', option.recruitment.major?.study_level)
                                        }},
                                        {{ getLocalizedMajorField('studyMode', option.recruitment.major?.study_mode) }}
                                    </p>
                                </div>
                                <div class="text-right">
                                    <p class="text-uk-600 dark:text-uk-300 text-xs font-bold">
                                        {{ option.recruitment.price }} PLN
                                    </p>
                                    <button
                                        @click.stop="majorStore.removeMajor(option.recruitment.id)"
                                        class="mt-1 cursor-pointer text-red-600 transition-opacity hover:opacity-70 dark:text-red-400"
                                    >
                                        <i class="pi pi-trash text-lg"></i>
                                    </button>
                                </div>
                            </div>
                        </template>
                    </OrderList>

                    <div
                        v-else
                        class="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center dark:border-slate-700"
                    >
                        <p class="text-sm text-slate-400 dark:text-slate-500">
                            {{ $t('study_programs.empty_selection') }}
                        </p>
                    </div>

                    <Message v-if="majorStore.errors.length" severity="warn">
                        {{ majorStore.errors[0] }}
                    </Message>

                    <div class="mt-8 space-y-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 dark:text-slate-400">
                                {{ $t('study_programs.recruitment_fee') }}
                            </span>
                            <span class="text-uk-600 dark:text-uk-300 font-medium">{{ totalPrice }} PLN</span>
                        </div>
                        <div class="bg-uk-50 dark:bg-uk-900/30 mt-4 flex items-center justify-between rounded-lg p-4">
                            <span class="text-uk-600 dark:text-uk-300 font-semibold">{{
                                $t('study_programs.total_to_pay')
                            }}</span>
                            <span class="text-uk-600 dark:text-uk-300 text-2xl font-bold">{{ totalPrice }} PLN</span>
                        </div>
                    </div>

                    <Button
                        :label="$t('study_programs.next_step')"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        class="w-full rounded-lg py-4 text-lg font-bold shadow-lg"
                        @click="validateAndProceed"
                    />
                </div>
            </template>
        </Card>

        <ApplicationDeadlinesInfo />
    </aside>
</template>
