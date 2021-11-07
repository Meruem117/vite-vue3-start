<template>
    <div class="flex flex-col p-3">
        <h1 class="pl-2 tracking-wide font-medium">
            <SignalFilled class="mr-3" style="color: #66CDAA;" />排行榜
        </h1>
        <div class="grid grid-cols-2 gap-5 w-full">
            <div
                v-for="video,id in state.videos"
                class="flex w-full h-auto p-3 justify-start cursor-pointer hover:shadow-2xl hover:text-blue-400"
                @click="toVideo(video.author, video.bvid)"
            >
                <div
                    :style="{ backgroundImage: 'url(' + video.pic + ')' }"
                    class="rounded cursor-pointer bg-no-repeat bg-contain h-40 w-1/3"
                ></div>
                <div class="flex flex-col w-1/3 pl-5">
                    <div
                        class="h-12 w-full font-semibold text-base cursor-pointer"
                    >{{ video.title }}</div>
                    <div
                        class="text-gray-500 mt-1 text-base hover:text-blue-500"
                        onclick="event.cancelBubble = true"
                        @click="toUp(video.mid)"
                    >
                        <UserOutlined />
                        {{ video.author }}
                    </div>
                    <div class="text-gray-400 mt-6">
                        <PlaySquareFilled />
                        {{ convertPlay(video.play) }}
                    </div>
                    <div class="text-gray-400 mt-1">
                        <ProfileOutlined />
                        {{ convertPlay(video.review) }}
                    </div>
                </div>
                <div class="flex flex-col justify-start w-1/3">
                    <div class="text-right text-4xl text-gray-300 font-black pr-3">{{ id + 1 }}</div>
                    <div class="flex flex-col justify-center h-2/3">
                        <div
                            class="text-center text-xl text-indigo-400 font-semibold"
                        >{{ video.score }}</div>
                        <div class="text-center text-sm text-gray-400">综合得分</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useStore } from 'vuex'
import { key } from '@/store/store'
import { SignalFilled, UserOutlined, PlaySquareFilled, ProfileOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const store = useStore(key)

const state = reactive({
    videos: [{
        bvid: '',
        mid: '',
        title: '',
        author: '',
        pic: '',
        play: 0,
        review: 0,
        score: 0
    }]
})

async function getData(): Promise<void> {
    try {
        const response = await axios.post(`/api/getHResult3`)
        state.videos = response.data
    } catch (error) {
        console.error(error)
    }
}

function convertPlay(play: number): string {
    let res = 0
    if (play / 10000 > 0) {
        play /= 10000
        res = roundFun(play, 1)
    }
    return res + '万'
}

function roundFun(value: number, n: number): number {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
}

function toUp(mid: string): void {
    router.push({
        name: "space",
        params: { mid: mid }
    })
}

function toVideo(author: string, bvid: string): void {
    addLog(author, bvid, store.state.user.location)
    let url = router.resolve({
        name: 'video',
        params: { bvid: bvid }
    })
    window.open(url.href, '_blank')
}

async function addLog(author: string, bvid: string, location: string): Promise<void> {
    const loc: string = location ? location : '暂无'
    try {
        await axios.post(`/api/addLog?author=${author}&bvid=${bvid}&location=${loc}`)
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => getData())
</script>
