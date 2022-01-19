<template>
  <div class="h-16 w-full flex fixed top-0 pt-2 pl-2 shadow-xl bg-white z-10"></div>
  <div class="h-full fixed left-0 bg-gray-100 tracking-widest text-lg z-20">
    <a-menu
      class="adminMenu"
      mode="inline"
      theme="dark"
      :openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      @openChange="onOpenChange"
    >
      <div class="flex align-middle text-3xl pl-3 pt-4 font-semibold text-white h-16">Admin</div>
      <a-menu-item key="home">
        <router-link to="/admin/home">
          <AntDesignOutlined />
          <span>首页</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="table">
        <router-link to="/admin/table">
          <TableOutlined />
          <span>表格</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu key="analysis">
        <template #title>
          <span>
            <ProjectOutlined />
            <span>分析</span>
          </span>
        </template>
        <router-link to="/admin/mapreduce">
          <a-menu-item key="1" class="text-black">MapReduce</a-menu-item>
        </router-link>
        <router-link to="/admin/hive">
          <a-menu-item key="2" class="text-black">Hive</a-menu-item>
        </router-link>
      </a-sub-menu>
      <a-sub-menu key="charts">
        <template #title>
          <span>
            <SketchOutlined />
            <span>可视化</span>
          </span>
        </template>
        <router-link to="/admin/mcharts">
          <a-menu-item key="3" class="text-black">MapReduce</a-menu-item>
        </router-link>
        <router-link to="/admin/hcharts">
          <a-menu-item key="4" class="text-black">Hive</a-menu-item>
        </router-link>
      </a-sub-menu>
    </a-menu>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { AntDesignOutlined, TableOutlined, ProjectOutlined, SketchOutlined } from '@ant-design/icons-vue'

const state = reactive({
  rootSubmenuKeys: ['home', 'table', 'analysis', 'charts'],
  openKeys: [''],
  selectedKeys: ['']
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

<style scoped>
.adminMenu {
  width: 256px;
  height: 100%;
}
</style>
