<template>
  <Nav />
  <a-result
    status="404"
    title="404"
    sub-title="Sorry, the page you visited does not exist."
    class="mt-16"
  >
    <template #extra>
      <router-link to="/home">
        <a-button type="primary">Back Home</a-button>
      </router-link>
    </template>
  </a-result>
  <Footer />
</template>

<script setup lang="ts">
import Nav from '@/components/main/base/Nav.vue'
import Footer from '@/components/main/base/Footer.vue'
</script>
