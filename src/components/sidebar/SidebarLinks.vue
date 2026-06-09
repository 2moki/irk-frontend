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
        </ul>
    </div>
</template>
