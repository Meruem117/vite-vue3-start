<template>
  <div class="h-16 w-full flex fixed top-0 justify-start shadow-xl bg-white">
    <a-page-header title="返回" @back="() => { router.go(-1) }" />
  </div>
  <div class="flex w-full h-auto mt-24 pl-56 overflow-auto bg-white">
    <div class="flex flex-col w-2/3">
      <div class="text-left text-2xl w-full">{{ state.video.title }}</div>
      <div class="text-left text-gray-400 tracking-wide mt-1 mb-4 w-2/3">
        <p class="inline">{{ convertNumber(state.video.stat.view) }}播放</p>
        <p class="inline ml-1">·</p>
        <p class="inline ml-1">{{ convertNumber(state.video.stat.danmaku) }}弹幕</p>
        <p class="inline ml-1">·</p>
        <p class="inline ml-1">{{ convertNumber(state.video.stat.reply) }}评论</p>
        <p class="inline ml-4">{{ convertTime(state.video.pubdate) }}</p>
        <p
          class="inline ml-4"
          v-if="state.video.stat.his_rank"
        >全站排行榜最高第{{ state.video.stat.his_rank }}名</p>
      </div>
      <iframe
        class="flex w-full text-left flex-nowrap"
        height="720px"
        border="0"
        scrolling="no"
        frameborder="no"
        framespacing="0"
        :src="`https://player.bilibili.com/player.html?bvid=${state.bvid}`"
      ></iframe>
      <div
        class="flex justify-start p-1 mt-3 h-auto w-full border-b border-solid border-t-0 border-l-0 border-r-0 border-gray-200"
      >
        <img src="@/assets/icons/like.png" class="icon" title="like" />
        <p class="icon-text">{{ convertNumber(state.video.stat.like) }}</p>
        <img src="@/assets/icons/coin.png" class="icon" title="coin" />
        <p class="icon-text">{{ convertNumber(state.video.stat.coin) }}</p>
        <img src="@/assets/icons/favorite.png" class="icon" title="favorite" />
        <p class="icon-text">{{ convertNumber(state.video.stat.favorite) }}</p>
        <img src="@/assets/icons/share.png" class="icon" title="share" />
        <p class="icon-text">{{ convertNumber(state.video.stat.share) }}</p>
      </div>
      <div class="mt-3 text-left ml-2 w-full">
        <StopOutlined />
        <p class="inline ml-2 mr-1 text-gray-400">未经作者授权禁止转载</p>
      </div>
      <div class="mt-2 ml-2 text-sm overflow-auto w-full video-desc">{{ state.video.desc }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { StopOutlined } from '@ant-design/icons-vue'
import type { videoDetailItem } from '@/models/video'
import { getVideoDetail } from '@/services/video'
import { convertNumber, convertTime } from '@/utils'

interface stateItem {
  bvid: string,
  video: videoDetailItem
}

const router = useRouter()
const route = useRoute()
const state: stateItem = reactive({
  bvid: '',
  video: {
    title: '',
    pubdate: 0,
    desc: '',
    owner: {
      mid: '',
      name: '',
      face: ''
    },
    stat: {
      view: 0,
      danmaku: 0,
      reply: 0,
      favorite: 0,
      coin: 0,
      share: 0,
      like: 0,
      his_rank: 0
    }
  }
})

async function init(): Promise<void> {
  state.bvid = route.params.bvid.toString()
  state.video = await getVideoDetail(state.bvid)
}

onMounted(() => init())
</script>

<style scoped>
.icon {
  width: 28px;
  height: 28px;
}
.icon-text {
  padding: 4px;
  margin-left: 4px;
  margin-right: 32px;
  color: gray;
}
.video-desc {
  -webkit-line-clamp: 2;
}
</style>
