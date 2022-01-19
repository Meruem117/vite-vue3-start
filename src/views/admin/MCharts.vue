<template>
  <div class="adminContent flex-col space-y-10">
    <a-tabs v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="1" tab="视频" class="flex flex-col space-y-5">
        <h1>视频播放量</h1>
        <MChart1 />
        <MChart2 />
      </a-tab-pane>
      <a-tab-pane key="2" tab="用户">
        <MChart3 />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MChart1 from '@/components/admin/mapreduce_charts/MChart1.vue'
import MChart2 from '@/components/admin/mapreduce_charts/MChart2.vue'
import MChart3 from '@/components/admin/mapreduce_charts/MChart3.vue'

const activeKey = ref('1')
</script>
