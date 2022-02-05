<template>
  <a-table
    :columns="columns"
    :data-source="state.data"
    class="ant-table-striped"
    :rowClassName="(record: userDetailItem, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
    bordered
    rowKey="id"
  >
    <!-- name -->
    <template #user-name="{ text, record }">
      <a-input
        v-if="editableData[record.id]"
        v-model:value="editableData[record.id]['name']"
        @pressEnter="formSave(record.id)"
      />
      <div v-else>{{ text }}</div>
    </template>
    <!-- password -->
    <template #user-password="{ text, record }">
      <a-input
        v-if="editableData[record.id]"
        v-model:value="editableData[record.id]['password']"
        @pressEnter="formSave(record.id)"
      />
      <div v-else>{{ text }}</div>
    </template>
    <!-- role -->
    <template #user-role="{ text, record }">
      <a-radio-group
        v-if="editableData[record.id]"
        v-model:value="editableData[record.id]['role']"
        @pressEnter="formSave(record.id)"
      >
        <a-radio :value="ROLES.admin">Admin</a-radio>
        <a-radio :value="ROLES.user">User</a-radio>
      </a-radio-group>
      <div v-else>{{ text }}</div>
    </template>
    <!-- location -->
    <template #user-location="{ text, record }">
      <a-input
        v-if="editableData[record.id]"
        v-model:value="editableData[record.id]['location']"
        @pressEnter="formSave(record.id)"
      />
      <div v-else>{{ text }}</div>
    </template>
    <!-- birthday -->
    <template #user-birthday="{ text, record }">
      <a-input
        v-if="editableData[record.id]"
        v-model:value="editableData[record.id]['birthday']"
        @pressEnter="formSave(record.id)"
      />
      <div v-else>{{ text }}</div>
    </template>
    <!-- gender -->
    <template #user-gender="{ text, record }">
      <a-radio-group
        v-if="editableData[record.id]"
        v-model:value="editableData[record.id]['gender']"
        @pressEnter="formSave(record.id)"
      >
        <a-radio :value="GENDER.male">Male</a-radio>
        <a-radio :value="GENDER.female">Female</a-radio>
      </a-radio-group>
      <div v-else>{{ text }}</div>
    </template>
    <!-- operation -->
    <template #user-operation="{ record }">
      <span v-if="editableData[record.id]">
        <a-popconfirm title="Sure to change?" @confirm="formSave(record.id)">
          <a class="text-green-500 mr-4">Save</a>
        </a-popconfirm>
        <a @click="cancelRecord(record.id)" class="text-gray-500 mr-4">Cancel</a>
      </span>
      <a v-else @click="editRecord(record.id)" class="mr-4">Edit</a>
      <a-popconfirm title="Sure to delete?" @confirm="formDelete(record.id)">
        <a class="text-red-600">Delete</a>
      </a-popconfirm>
    </template>
  </a-table>
  <a-button class="float-left w-24 -mt-10 mb-2" @click="openModal">Add</a-button>
  <!-- modal -->
  <a-modal v-model:visible="state.visible" title="Add" okType="link" okText="...">
    <Regist />
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, Ref, UnwrapRef } from 'vue'
import { cloneDeep } from 'lodash'
import Regist from '@/components/main/user/Regist.vue'
import type { userDetailItem } from '@/models/user'
import { getAllUsers, updateUser, deleteUser } from '@/services/user'
import { ROLES, GENDER } from '@/constant'

interface stateItem {
  data: userDetailItem[],
  visible: boolean
}

const state: stateItem = reactive({
  data: [],
  visible: false
})
const dataSource: Ref<userDetailItem[]> = ref([])
const editableData: UnwrapRef<Record<number, userDetailItem>> = reactive({})
const columns = reactive([
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    slots: { customRender: 'user-name' },
    ellipsis: true,
  },
  {
    title: 'Password',
    dataIndex: 'password',
    key: 'password',
    slots: { customRender: 'user-password' },
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    slots: { customRender: 'user-role' },
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    slots: { customRender: 'user-location' },
  },
  {
    title: 'Birthday',
    dataIndex: 'birthday',
    key: 'birthday',
    slots: { customRender: 'user-birthday' },
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    slots: { customRender: 'user-gender' },
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
    slots: { customRender: 'user-operation' },
  }
])

async function init(): Promise<void> {
  state.data = await getAllUsers()
  dataSource.value = state.data
}

function editRecord(id: number): void {
  editableData[id] = cloneDeep(dataSource.value.filter(item => id === item.id)[0])
}

function cancelRecord(id: number): void {
  delete editableData[id]
}

function formSave(id: number): void {
  Object.assign(dataSource.value.filter(item => id === item.id)[0], editableData[id])
  updateUser(editableData[id])
  delete editableData[id]
}

function formDelete(id: number): void {
  deleteUser(id)
}

function openModal(): void {
  state.visible = true
}

onMounted(() => init())
</script>

<style scoped>
.ant-table-striped :deep(.table-striped) {
  background-color: #fafafa;
}
</style>
