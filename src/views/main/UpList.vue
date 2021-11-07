<template>
    <Nav :current="['space']" />
    <div class="w-full flex flex-col px-5 pt-24 pb-4 justify-center">
        <a-list item-layout="horizontal" :data-source="state.upList" class="w-5/6">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-list-item-meta :description="item.Official.title">
                        <template #title>
                            <a
                                class="text-2xl tracking-wider"
                                @click="toUp(item.mid)"
                            >{{ item.name }}</a>
                            <a
                                class="inline ml-2 cursor-pointer"
                                :href="`https://space.bilibili.com/${item.mid}`"
                                target="_blank"
                            >
                                <LinkOutlined />
                            </a>
                        </template>
                        <template #avatar>
                            <a-avatar
                                class="cursor-pointer"
                                :src="item.face"
                                :size="64"
                                @click="toUp(item.mid)"
                            />
                        </template>
                    </a-list-item-meta>
                </a-list-item>
            </template>
        </a-list>
        <div class="flex justify-center">
            <a-button v-if="state.hasMore" type="primary" @click="load">加载更多</a-button>
            <p v-else class="text-gray-400 text-sm -mb-2">已经到底了</p>
        </div>
        <a-back-top />
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LinkOutlined } from '@ant-design/icons-vue'
import Nav from '@/components/main/base/Nav.vue'
import { upInfoItem } from '@/models/up'
import { getUps, getUpInfo } from '@/services/up'
import { UP_LIST_SIZE } from '@/constant'

interface stateItem {
    upList: upInfoItem[],
    current: number,
    hasMore: boolean
}

const router = useRouter()
const state: stateItem = reactive({
    upList: [],
    current: 1,
    hasMore: true
})

async function getUpList(page: number): Promise<void> {
    if (state.hasMore) {
        const ups = await getUps(page)
        ups.forEach(up => {
            getUpInfo(up.mid)
                .then(res => state.upList = [...state.upList, res])
        })
        if (ups.length < UP_LIST_SIZE) {
            state.hasMore = false
        }
    }
    return
}

function load(): void {
    state.current++
    getUpList(state.current - 1)
}

function toUp(mid: string): void {
    router.push({
        name: 'space',
        params: { mid }
    })
}

onMounted(() => getUpList(state.current - 1))
</script>
