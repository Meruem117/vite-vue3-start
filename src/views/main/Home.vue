<template>
  <Nav :current="['home']" />
  <div class="mainContent">
    <a-button
      type="primary"
      @click="router.push({
        path: '/list'
      })"
      class="mx-auto my-auto text-lg tracking-wider"
    >Get Started</a-button>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Nav from '@/components/main/base/Nav.vue'
import Footer from '@/components/main/base/Footer.vue'

const router = useRouter()
</script>
