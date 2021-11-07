<template>
    <div class="h-16 w-full flex fixed top-0 justify-start py-4 pl-6 shadow-xl bg-white z-10">
        <a-breadcrumb>
            <a-breadcrumb-item>
                <router-link to="/list">
                    <p class="text-lg inline">Space</p>
                </router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
                <p class="text-lg inline">{{ breadcrumb }}</p>
            </a-breadcrumb-item>
        </a-breadcrumb>
    </div>
</template>

<script setup lang="ts">
defineProps({
    breadcrumb: {
        type: String,
        required: true
    }
})
</script>
