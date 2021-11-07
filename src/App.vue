<template>
  <User />
  <router-view />
</template>

<script setup lang="ts">
import User from '@/views/main/User.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
