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
          :style="{ backgroundImage: `url('${convertImageUrl(video.pic)}')` }"
          class="rounded cursor-pointer bg-no-repeat bg-contain h-40 w-1/3"
        ></div>
        <div class="flex flex-col w-1/3 pl-5">
          <div class="h-12 w-full font-semibold text-base cursor-pointer">{{ video.title }}</div>
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
            <div class="text-center text-xl text-indigo-400 font-semibold">{{ video.score }}</div>
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
import { useStore } from 'vuex'
import { key } from '@/store/store'
import { SignalFilled, UserOutlined, PlaySquareFilled, ProfileOutlined } from '@ant-design/icons-vue'
import { hResultItem3 } from '@/models/chart'
import { logItem } from '@/models/log'
import { getHResult3 } from '@/services/chart'
import { addLog } from '@/services/log'
import { convertPlay } from '@/utils'
import { IMAGE_URL_PREFIX } from '@/constant'

interface stateItem {
  videos: hResultItem3[]
}

const router = useRouter()
const store = useStore(key)
const state: stateItem = reactive({
  videos: []
})

async function getData(): Promise<void> {
  state.videos = await getHResult3()
}

function toUp(mid: string): void {
  router.push({
    name: "space",
    params: { mid: mid }
  })
}

function toVideo(author: string, bvid: string): void {
  const location = store.state.user.location!
  const log: logItem = {
    author,
    bvid,
    location: location ? location : '暂无'
  }
  addLog(log)
  let url = router.resolve({
    name: 'video',
    params: { bvid: bvid }
  })
  window.open(url.href, '_blank')
}

function convertImageUrl(url: string): string {
  return IMAGE_URL_PREFIX + url
}

onMounted(() => getData())
</script>
