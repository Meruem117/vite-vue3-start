<template>
    <Bread :breadcrumb="state.mid" />
    <div class="flex flex-col flex-auto flex-nowrap w-full h-full pt-24 p-8 bg-gray-100">
        <!-- up -->
        <div
            class="flex h-1/4 w-4/5 mx-auto mb-5 rounded bg-no-repeat bg-cover"
            :style="{ backgroundImage: `url('${convertImageUrl(state.background)}')` }"
        >
            <div class="flex justify-start px-5 pt-32 pb-5 w-full">
                <a :href="`https://space.bilibili.com/${state.mid}`" target="_blank">
                    <a-avatar :src="state.up.card.face" :size="72" />
                </a>
                <div class="flex flex-col ml-5 mt-2 h-12 justify-start tracking-wider">
                    <a
                        class="text-white hover:text-white"
                        :href="`https://space.bilibili.com/${state.mid}`"
                        target="_blank"
                    >
                        <p class="font-bold text-2xl">{{ state.up.card.name }}</p>
                    </a>
                    <p
                        class="-mt-5 font-light text-sm font-mono text-white"
                        :title="state.up.card.sign"
                    >{{ state.up.card.sign }}</p>
                </div>
            </div>
            <div
                class="flex text-right w-1/6 p-1 text-base justify-center font-mono"
                :title="state.up.card.fans + '个粉丝'"
            >粉丝数: {{ convertNumber(state.up.card.fans) }}</div>
        </div>
        <!-- video -->
        <div class="w-4/5 h-3/4 bg-white p-5 rounded mx-auto">
            <div class="grid grid-cols-5 gap-5">
                <div
                    v-for="video in state.videos[state.current - 1]"
                    class="flex flex-col flex-nowrap flex-auto h-64"
                >
                    <!-- 封面 -->
                    <div
                        :style="{ backgroundImage: `url('${convertImageUrl(video.pic)}')` }"
                        class="flex rounded cursor-pointer bg-no-repeat bg-cover h-full w-full"
                        @click="toVideo(video.bvid)"
                    >
                        <div class="flex justify-end w-full">
                            <div class="flex flex-col justify-end">
                                <div
                                    class="bg-gray-800 bg-opacity-60 text-gray-300 rounded-tl-lg rounded-br px-1 py-0.5 text-xs tracking-wider"
                                >{{ video.length }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 信息 -->
                    <p
                        class="h-20 text-base overflow-hidden mt-2 hover:text-blue-400 cursor-pointer video-title"
                        :title="video.title"
                        @click="toVideo(video.bvid)"
                    >{{ video.title }}</p>
                    <div class="flex -mt-3 p-0.5 w-full icon-color">
                        <div class="inline w-1/2">
                            <PlaySquareFilled />
                            {{ convertNumber(video.play) }}
                        </div>
                        <div class="inline w-1/2">
                            <ClockCircleFilled />
                            {{ convertTime(video.created) }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- 分页 -->
            <div class="flex justify-center mt-6" @click="getVideos(state.mid, state.current)">
                <a-pagination
                    v-model:current="state.current"
                    :total="Math.ceil(state.up.archive_count / VIDEO_LIST_SIZE) * 10"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store/store'
import { PlaySquareFilled, ClockCircleFilled } from '@ant-design/icons-vue'
import Bread from '@/components/main/base/Bread.vue'
import { upDetailItem } from '@/models/up'
import { videoItem } from '@/models/video'
import { logItem } from '@/models/log'
import { getUpDetail } from '@/services/up'
import { getVideos } from '@/services/video'
import { addLog } from '@/services/log'
import { convertNumber, convertTime } from '@/utils'
import { UP_BACKGROUND_IMAGE, VIDEO_LIST_SIZE, IMAGE_URL_PREFIX } from '@/constant'

interface stateItem {
    mid: string,
    up: upDetailItem,
    videos: videoItem[][],
    current: number,
    background: string
}

const router = useRouter()
const route = useRoute()
const store = useStore(key)
const state: stateItem = reactive({
    mid: '',
    up: {
        card: {
            mid: '',
            name: '',
            sex: '',
            face: '',
            sign: '',
            fans: 0,
            attention: 0
        },
        archive_count: 0
    },
    videos: [],
    current: 1,
    background: UP_BACKGROUND_IMAGE
})

async function init(): Promise<void> {
    state.mid = route.params.mid.toString()
    state.up = await getUpDetail(state.mid)
    state.videos[state.current - 1] = await getVideos(state.mid, state.current)
}

function toVideo(bvid: string): void {
    const log: logItem = {
        author: state.up.card.name,
        bvid,
        location: store.state.user.location ? store.state.user.location : '暂无'
    }
    addLog(log)
    router.push({
        name: 'video',
        params: { bvid }
    })
}

function convertImageUrl(url: string): string {
    return IMAGE_URL_PREFIX + url
}

onMounted(() => init())
</script>

<style scoped>
.video-title {
    -webkit-line-clamp: 2;
}
.icon-color {
    color: rgb(154, 154, 167);
}
</style>
