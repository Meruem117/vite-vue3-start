<template>
    <div class="h-16 w-full flex fixed top-0 justify-start pt-2 px-2 shadow-xl bg-white z-10">
        <a-menu v-model:selectedKeys="current" mode="horizontal">
            <a-menu-item key="home">
                <router-link to="/home">
                    <AntDesignOutlined />
                    <p class="inline ml-2 text-base tracking-wider align-middle">Home</p>
                </router-link>
            </a-menu-item>
            <a-menu-item key="about">
                <router-link to="/about">
                    <ReadOutlined />
                    <p class="inline ml-2 text-base tracking-wider align-middle">About</p>
                </router-link>
            </a-menu-item>
            <a-menu-item key="space">
                <router-link to="/list">
                    <ContainerOutlined />
                    <p class="inline ml-2 text-base tracking-wider align-middle">Space</p>
                </router-link>
            </a-menu-item>
            <a-menu-item key="bilibili">
                <a href="https://www.bilibili.com/" target="_blank" rel="noopener noreferrer">
                    <ApiOutlined />
                    <p class="inline ml-2 text-base tracking-wider align-middle">Bilibili</p>
                </a>
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script setup lang="ts">
import { AntDesignOutlined, ReadOutlined, ContainerOutlined, ApiOutlined } from '@ant-design/icons-vue'

defineProps({
    current: {
        type: Array as () => Array<string>,
        required: true,
        default: () => []
    }
})
</script>
