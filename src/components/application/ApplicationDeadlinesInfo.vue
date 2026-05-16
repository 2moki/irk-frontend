<template>
    <Card class="bg-uk-700 text-white">
        <template #content>
            <div class="flex gap-4">
                <i class="pi pi-info-circle mt-1 shrink-0"></i>
                <div class="space-y-1">
                    <p class="text-sm font-semibold">
                        {{ $t('study_programs.remember_deadlines') }}
                    </p>
                    <p class="text-xs">
                        {{ $t('study_programs.fee_deadline_info') }}
                    </p>
                </div>
            </div>
        </template>
    </Card>
</template>
