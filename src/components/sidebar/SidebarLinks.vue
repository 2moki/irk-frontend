<script setup lang="ts">
import SidebarLink from '@/components/sidebar/SidebarLink.vue';
</script>

<template>
    <div class="overflow-y-auto">
        <ul class="m-0 list-none overflow-hidden p-4">
            <li>
                <SidebarLink icon="home" link="/">Dashboard</SidebarLink>
            </li>
            <li>
                <SidebarLink icon="book" link="/major">Kierunki</SidebarLink>
            </li>
            <li>
                <SidebarLink icon="camera" link="/recruitment/Step5">Zdjęcie do legitymacji</SidebarLink>
            </li>
            <li>
                <SidebarLink icon="file" link="/recruitment/Step6">Skany dokumentów</SidebarLink>
            </li>
        </ul>
    </div>
</template>
