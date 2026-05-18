<script setup lang="ts">
import ApplicationHeader from '@/components/application/ApplicationHeader.vue';
import MajorSelectionTable from '@/components/application/MajorSelectionTable.vue';
import MajorPrioritySidebar from '@/components/application/MajorPrioritySidebar.vue';
</script>

<template>
    <div class="mx-auto space-y-12">
        <ApplicationHeader
            :current-step="1"
            :steps="10"
            :title="$t('study_programs.title')"
            :subtitle="$t('study_programs.subtitle')"
        />

        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <MajorSelectionTable class="lg:col-span-7" />
            <MajorPrioritySidebar class="lg:col-span-5" />
        </div>
    </div>
</template>
