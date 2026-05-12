<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue';
</script>
<template>
    <div class="flex min-h-screen">
        <AppSidebar />
        <main class="container mx-auto my-6 px-3 sm:px-6">
            <RouterView />
        </main>
    </div>
</template>
