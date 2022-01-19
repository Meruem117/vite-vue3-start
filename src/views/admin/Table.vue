<template>
  <div class="adminContent flex-col">
    <a-tabs type="card" v-model:activeKey="activeKey" size="large">
      <a-tab-pane key="1" tab="Up">
        <UpTable />
      </a-tab-pane>
      <a-tab-pane key="2" tab="User">
        <UserTable />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UpTable from '@/components/admin/table/UpTable.vue'
import UserTable from '@/components/admin/table/UserTable.vue'

const activeKey = ref('1')
</script>
