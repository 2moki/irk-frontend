<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Language, LanguageSelection } from '@/types/recruitment';
import { useApplicationLanguagesStore } from '@/stores/applicationLanguages';
import { useMajorStore } from '@/stores/major';
import { useLocalizedEnums } from '@/composables/useLocalizedEnums';

const props = defineProps<{
    entry: LanguageSelection;
    index: number;
}>();

const { getLocalizedMajorField } = useLocalizedEnums();
const languagesStore = useApplicationLanguagesStore();
const majorStore = useMajorStore();

const majorInfo = computed(() => {
    const found = majorStore.selectedMajors.find((major) => major.recruitment.id === props.entry.recruitmentId);
    return found?.recruitment.major;
});

const localLanguages = ref<Language[]>([...props.entry.orderedLanguages]);
let skipSync = false;

watch(
    () => props.entry.orderedLanguages,
    (newVal) => {
        if (skipSync) {
            skipSync = false;
            return;
        }
        localLanguages.value = [...newVal];
    },
);

watch(localLanguages, (newVal) => {
    skipSync = true;
    languagesStore.updateLanguageOrder(props.entry.recruitmentId, newVal);
});
</script>

<template>
    <Card class="overflow-hidden shadow-md">
        <template #title>
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-uk-600 dark:text-uk-300 text-xl font-bold">
                        {{ majorInfo?.name }}
                    </h3>
                    <p class="text-surface-500 mt-1 text-xs font-semibold tracking-wider uppercase">
                        {{ getLocalizedMajorField('studyLevel', majorInfo?.study_level) }},
                        {{ getLocalizedMajorField('studyMode', majorInfo?.study_mode) }}
                    </p>
                </div>
                <div
                    class="bg-uk-100 text-uk-700 dark:bg-uk-800 dark:text-uk-300 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                >
                    {{ index + 1 }}
                </div>
            </div>
        </template>

        <template #content>
            <div class="space-y-4">
                <p class="text-surface-500 text-xs italic">
                    {{ $t('language_selection.drag_instruction') }}
                </p>

                <OrderList v-if="localLanguages.length > 0" v-model="localLanguages" dataKey="id">
                    <template #option="{ option, index: langIndex }">
                        <div
                            v-if="option"
                            class="group border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800 flex w-full items-center gap-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
                        >
                            <div
                                class="group-hover:text-uk-600 dark:group-hover:text-uk-400 text-surface-300 dark:text-surface-600 flex flex-col items-center gap-1 transition-colors"
                            >
                                <span class="text-2xl font-black">
                                    {{ String(langIndex + 1).padStart(2, '0') }}
                                </span>
                            </div>
                            <div class="flex-1">
                                <h4 class="text-uk-600 dark:text-uk-300 text-base font-bold">
                                    {{ option.name }}
                                </h4>
                                <p class="text-surface-500 text-xs">
                                    {{ $t('language_selection.priority_label') }}: {{ langIndex + 1 }}
                                </p>
                            </div>
                            <Tag
                                v-if="langIndex === 0"
                                severity="info"
                                class="text-xs"
                                :value="$t('language_selection.highest_priority')"
                            />
                        </div>
                    </template>
                </OrderList>

                <p v-else class="text-surface-500">
                    {{ $t('language_selection.major_without_foreign_langs') }}
                </p>
            </div>
        </template>
    </Card>
</template>
