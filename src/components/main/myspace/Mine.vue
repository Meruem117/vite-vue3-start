<template>
  <div
    v-if="store.state.isLogin"
    class="flex flex-col justify-start space-y-5 pl-16 pt-6 w-full h-full tracking-wide"
  >
    <div class="-ml-6 text-xl">个人资料</div>
    <div class="flex">
      <div class="column-name">用户名:</div>
      <div class="column-value">{{ user.name }}</div>
    </div>
    <div class="flex">
      <div class="column-name">性别:</div>
      <div class="column-value">{{ user.gender }}</div>
    </div>
    <div class="flex">
      <div class="column-name">地区:</div>
      <div class="column-value">{{ user.location }}</div>
    </div>
    <div class="flex">
      <div class="column-name">生日:</div>
      <div class="column-value">{{ user.birthday }}</div>
    </div>
  </div>
  <div v-else class="flex justify-center pt-4">
    <div class="column-name">暂未登录</div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { key } from '@/store/store'

const store = useStore(key)
const { user } = store.state
</script>

<style scoped>
.column-name {
  font-size: 17px;
  color: gray;
  width: 1/6;
}
.column-value {
  display: inline;
  font-size: 18px;
}
</style>
