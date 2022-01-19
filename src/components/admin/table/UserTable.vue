<template>
  <a-table
    :columns="columns"
    :data-source="state.data"
    class="ant-table-striped"
    :rowClassName="(record: userFormItem, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
    bordered
    rowKey="id"
  >
    <!-- name -->
    <template #user-name="{ text, record }">
      <a-input v-if="record.edit" v-model:value="record.name" @pressEnter="formSave(record)" />
      <div v-else>{{ text }}</div>
    </template>
    <!-- password -->
    <template #user-password="{ text, record }">
      <a-input v-if="record.edit" v-model:value="record.password" @pressEnter="formSave(record)" />
      <div v-else>{{ text }}</div>
    </template>
    <!-- role -->
    <template #user-role="{ text, record }">
      <a-radio-group v-if="record.edit" v-model:value="record.role" @pressEnter="formSave(record)">
        <a-radio :value="ROLES.admin">Admin</a-radio>
        <a-radio :value="ROLES.user">User</a-radio>
      </a-radio-group>
      <div v-else>{{ text }}</div>
    </template>
    <!-- location -->
    <template #user-location="{ text, record }">
      <a-input v-if="record.edit" v-model:value="record.location" @pressEnter="formSave(record)" />
      <div v-else>{{ text }}</div>
    </template>
    <!-- birthday -->
    <template #user-birthday="{ text, record }">
      <a-input v-if="record.edit" v-model:value="record.birthday" @pressEnter="formSave(record)" />
      <div v-else>{{ text }}</div>
    </template>
    <!-- gender -->
    <template #user-gender="{ text, record }">
      <a-radio-group
        v-if="record.edit"
        v-model:value="record.gender"
        @pressEnter="formSave(record)"
      >
        <a-radio :value="GENDER.male">Male</a-radio>
        <a-radio :value="GENDER.female">Female</a-radio>
      </a-radio-group>
      <div v-else>{{ text }}</div>
    </template>
    <!-- operation -->
    <template #user-operation="{ record }">
      <a class="mr-5" v-if="record.edit === false" @click="record.edit = true">Edit</a>
      <a-popconfirm v-else title="Sure to change?" @confirm="formSave(record)">
        <a class="mr-5 text-green-500">Save</a>
      </a-popconfirm>
      <a-popconfirm title="Sure to delete?" @confirm="formDelete(record)">
        <a class="text-red-600">Delete</a>
      </a-popconfirm>
      <a v-if="record.edit" @click="record.edit = false" class="ml-5 text-gray-500">Cancel</a>
    </template>
  </a-table>
  <a-button class="float-left w-24 -mt-10 mb-2" @click="openModal">Add</a-button>
  <!-- modal -->
  <a-modal v-model:visible="state.visible" title="Add" okType="link" okText="...">
    <Regist />
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import Regist from '@/components/main/user/Regist.vue'
import { userDetailItem } from '@/models/user'
import { getAllUsers, updateUser, deleteUser } from '@/services/user'
import { ROLES, GENDER } from '@/constant'

interface userFormItem extends userDetailItem {
  edit: boolean
}
interface stateItem {
  data: userFormItem[],
  visible: boolean
}

const state: stateItem = reactive({
  data: [],
  visible: false
})
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
  getAllUsers().then(users => {
    users.forEach(user => {
      const res = { ...user, edit: false }
      state.data = [...state.data, res]
    })
  })
}

function formSave(record: userFormItem): void {
  record.edit = false
  updateUser(record)
}

function formDelete(record: userFormItem): void {
  deleteUser(record.id!)
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
