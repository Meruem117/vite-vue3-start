<template>
    <div class="fixed top-3 right-5 z-20">
        <a-popover :title="store.state.user.name" placement="bottomRight">
            <!-- 信息 -->
            <template #content v-if="store.state.isLogin" class="w-28">
                <div>
                    <p
                        class="text-base"
                        v-if="store.state.user.gender"
                    >性别: {{ store.state.user.gender }}</p>
                    <p class="text-base" v-else>性别: 保密</p>
                    <p
                        class="text-base"
                        v-if="store.state.user.location"
                    >地区: {{ store.state.user.location }}</p>
                    <p class="text-base" v-else>地区: 保密</p>
                </div>
                <a-popconfirm
                    title="Are you sure to logout?"
                    placement="left"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="confirmLogout"
                    @cancel="cancelLogout"
                >
                    <a-button type="danger" class="w-full">Logout</a-button>
                </a-popconfirm>
            </template>
            <template #content v-else>
                <p class="text-base h-2">Nothing here</p>
            </template>
            <!-- 头像 -->
            <a-avatar
                size="large"
                class="cursor-pointer"
                @click="showModal"
                v-if="store.state.isLogin === false"
            >
                <template #icon>
                    <UserOutlined />
                </template>
            </a-avatar>
            <div
                class="cursor-pointer text-xl p-0.5 tracking-wide font-semibold"
                @click="toMySpace"
                v-else
            >{{ store.state.user.name }}</div>
        </a-popover>
        <!-- 注册 -->
        <a-modal
            title="Regist"
            v-model:visible="state.showModal"
            v-if="state.showRegist"
            keyboard="true"
            okType="link"
            okText="Login"
            :onOk="handleShowRegist"
            class="registModal"
        >
            <Regist />
        </a-modal>
        <!-- 登录 -->
        <a-modal
            title="Login"
            v-model:visible="state.showModal"
            v-else
            keyboard="true"
            okType="link"
            okText="Regist"
            :onOk="handleShowRegist"
            class="loginModal"
        >
            <Login />
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store/store'
import { message } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'
import Login from '@/components/main/user/Login.vue'
import Regist from '@/components/main/user/Regist.vue'

const router = useRouter()
const store = useStore(key)
const state = reactive({
    showModal: false,
    showRegist: false,
})

function showModal(): void {
    state.showModal = true
}

function closeModal(): void {
    state.showModal = false
    state.showRegist = false
}

function handleShowRegist(): void {
    state.showRegist = !state.showRegist
}

function logout(): void {
    store.commit('isLogin', false)
    store.commit('clearUserInfo')
}

function confirmLogout(): void {
    logout()
    message.success('Logout')
}

function cancelLogout(): void {
    message.warn('Cancel')
}

function toMySpace(): void {
    router.push({
        name: 'myspace',
        params: { id: store.state.user.id }
    })
}
</script>

<style scoped>
.loginModal {
    top: 20%;
}
.registModal {
    top: 15%;
}
.registModal {
    top: 15%;
}
</style>
