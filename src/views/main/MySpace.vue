<template>
    <Nav :current="['']" />
    <div class="mainContent bg-gray-100">
        <div class="flex flex-col justify-start pt-14 w-full">
            <div
                class="flex justify-center mx-auto space-x-10 rounded border-2 border-solid border-gray-100 h-full w-2/3"
            >
                <a-menu
                    style="width: 256px; height: 100%;"
                    mode="inline"
                    theme="light"
                    :openKeys="state.openKeys"
                    v-model:selectedKeys="state.selectedKeys"
                    @openChange="onOpenChange"
                >
                    <div class="flex align-middle text-3xl pl-3 pt-4 font-semibold h-16">
                        {{ store.state.user.name }}
                        <a
                            v-if="store.state.isRoot"
                            class="text-sm font-normal ml-5 mt-3"
                            @click="router.push({ path: '/admin' })"
                        >管理员</a>
                    </div>
                    <a-menu-item key="mine" @click="state.isMine = true">
                        <span>个人资料</span>
                    </a-menu-item>
                    <a-menu-item key="myfollow" @click="state.isMine = false">
                        <span>我的关注</span>
                    </a-menu-item>
                </a-menu>
                <div class="w-2/3 h-full bg-white">
                    <Mine v-if="state.isMine" />
                    <MyFollow v-else />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store/store'
import Nav from '@/components/main/base/Nav.vue'
import Mine from '@/components/main/myspace/Mine.vue'
import MyFollow from '@/components/main/myspace/MyFollow.vue'

const router = useRouter()
const store = useStore(key)
const state = reactive({
    rootSubmenuKeys: ['mine', 'myfollow'],
    openKeys: [''],
    selectedKeys: ['mine'],
    isMine: true
})

function onOpenChange(openKeys: string[]): void {
    const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1)
    if (state.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
        state.openKeys = openKeys
    } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : []
    }
}
</script>
