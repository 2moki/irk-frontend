<script setup lang="ts">
import { ref } from 'vue';
import UniversityLogo from '@/components/ui/UniversityLogo.vue';
import SidebarLinks from '@/components/sidebar/SidebarLinks.vue';
import SidebarFooter from '@/components/sidebar/SidebarFooter.vue';

const mobileVisible = ref(false);
</script>

<template>
    <aside
        class="desktop-sidebar border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 sticky top-0 hidden h-screen w-80 shrink-0 flex-col overflow-y-auto border-r lg:flex"
    >
        <div class="flex shrink-0 items-center px-6 pt-6">
            <UniversityLogo :color-variant="true" />
        </div>

        <SidebarLinks />

        <SidebarFooter />
    </aside>

    <Button icon="pi pi-bars" class="fixed top-4 right-4 z-50 lg:hidden!" rounded @click="mobileVisible = true" />
    <Drawer
        v-model:visible="mobileVisible"
        class="lg:hidden!"
        position="left"
        :pt="{ root: { style: 'width: 100vw' } }"
    >
        <template #container="{ closeCallback }">
            <div class="flex h-full flex-col">
                <div class="flex shrink-0 items-center justify-between px-6 pt-6">
                    <UniversityLogo :color-variant="true" />
                    <Button type="button" @click="closeCallback" icon="pi pi-times" rounded variant="outlined" />
                </div>

                <SidebarLinks />

                <SidebarFooter />
            </div>
        </template>
    </Drawer>
</template>
