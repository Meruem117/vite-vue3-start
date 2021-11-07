<template>
    <div
        class="flex flex-col justify-start space-y-5 pl-16 pt-6 w-full h-full text-2xl tracking-wide"
    >
        <div class="-ml-6">个人资料</div>
        <div class="flex">
            <div class="text-lg text-gray-400 w-1/6">用户名:</div>
            <div>{{ store.state.user.name }}</div>
        </div>
        <div class="flex">
            <div class="text-lg text-gray-400 w-1/6">性别:</div>
            <div
                v-if="store.state.user.gender"
                class="inline"
            >{{ convertGender(store.state.user.gender) }}</div>
            <div v-else>保密</div>
        </div>
        <div class="flex">
            <div class="text-lg text-gray-400 w-1/6">地区:</div>
            <div v-if="store.state.user.location" class="inline">{{ store.state.user.location }}</div>
            <div v-else>保密</div>
        </div>
        <div class="flex">
            <div class="text-lg text-gray-400 w-1/6">生日:</div>
            <div v-if="store.state.user.birthday" class="inline">{{ store.state.user.birthday }}</div>
            <div v-else>保密</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { key } from '@/store/store'
import { convertGender } from '@/utils'

const store = useStore(key)
</script>
