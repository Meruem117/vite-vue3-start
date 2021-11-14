<template>
    <div
        class="flex flex-col justify-start space-y-5 pl-16 pt-6 w-full h-full text-2xl tracking-wide"
    >
        <div class="-ml-6">个人资料</div>
        <div class="flex">
            <div class="column">用户名:</div>
            <div class="inline">{{ user.name }}</div>
        </div>
        <div class="flex">
            <div class="column">性别:</div>
            <div class="inline">{{ user.gender }}</div>
        </div>
        <div class="flex">
            <div class="column">地区:</div>
            <div class="inline">{{ user.location }}</div>
        </div>
        <div class="flex">
            <div class="column">生日:</div>
            <div class="inline">{{ user.birthday }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { key } from '@/store/store'

const store = useStore(key)
const { user } = store.state
</script>

<style scoped>
.column {
    font-size: 18px;
    color: rgba(156, 163, 175);
    width: 1/6;
}
</style>
