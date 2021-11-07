<template>
    <Nav :current="['about']" />
    <div class="mainContent">
        <h1>About</h1>
    </div>
    <Footer />
</template>

<script setup lang="ts">
import Nav from '@/components/main/base/Nav.vue'
import Footer from '@/components/main/base/Footer.vue'
</script>
