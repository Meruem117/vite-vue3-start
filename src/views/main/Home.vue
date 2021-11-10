<template>
  <Nav :current="['home']" />
  <div class="mainContent">
    <router-link to="/list" class="mx-auto my-auto">
      <a-button type="primary" class="text-lg tracking-wider">Get Started</a-button>
    </router-link>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Nav from '@/components/main/base/Nav.vue'
import Footer from '@/components/main/base/Footer.vue'
</script>
