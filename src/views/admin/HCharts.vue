<template>
  <div class="adminContent flex-col space-y-10">
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="1" tab="视频数">
        <h1>视频总数</h1>
        <HChart2 />
        <HChart1 />
      </a-tab-pane>
      <a-tab-pane key="2" tab="播放量">
        <h1>播放量 >= 1000万</h1>
        <HChart3 />
      </a-tab-pane>
      <a-tab-pane key="3" tab="热度">
        <Rank />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HChart1 from '@/components/admin/hive_charts/HChart1.vue'
import HChart2 from '@/components/admin/hive_charts/HChart2.vue'
import HChart3 from '@/components/admin/hive_charts/HChart3.vue'
import Rank from '@/components/admin/hive_charts/Rank.vue'

const activeKey = ref('1')
</script>
