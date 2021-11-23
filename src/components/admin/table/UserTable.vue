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
    <template #name="{ text, record }">
      <div v-if="record.edit">
        <a-input v-model:value="record.name" @pressEnter="formSave(record)" />
      </div>
      <div v-else>{{ text }}</div>
    </template>
    <!-- operation -->
    <template #operation="{ record }">
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
    <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="Name" v-bind="validateInfos.name">
        <a-input v-model:value="modelRef.name" />
      </a-form-item>
      <a-form-item label="Password" v-bind="validateInfos.password">
        <a-input v-model:value="modelRef.password" />
      </a-form-item>
      <a-form-item label="Role" v-bind="validateInfos.role">
        <a-input v-model:value="modelRef.role" />
      </a-form-item>
      <a-form-item label="Location" v-bind="validateInfos.location">
        <a-input v-model:value="modelRef.location" />
      </a-form-item>
      <a-form-item label="Birthday" v-bind="validateInfos.birthday">
        <a-input v-model:value="modelRef.birthday" />
      </a-form-item>
      <a-form-item label="Gender" v-bind="validateInfos.gender">
        <a-input v-model:value="modelRef.gender" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 15, offset: 5 }">
        <a-button type="primary" @click.prevent="onSubmit">Add</a-button>
        <a-button class="ml-3" @click="resetFields">Reset</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, onMounted, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { Form } from 'ant-design-vue'
import { userDetailItem } from '@/models/user'
import { getAllUsers, addUser, updateUser, deleteUser, getUserById } from '@/services/user'
import { ROLES, DEFAULT_LOCATION, DEFAULT_BIRTHDAY, GENDER } from '@/constant'

interface userFormItem extends userDetailItem {
  edit: boolean
}
interface stateItem {
  data: userFormItem[],
  visible: boolean
}

const router = useRouter()
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
    slots: { customRender: 'name' },
    ellipsis: true,
  },
  {
    title: 'Password',
    dataIndex: 'password',
    key: 'password',
    slots: { customRender: 'password' },
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    slots: { customRender: 'role' },
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    slots: { customRender: 'location' },
  },
  {
    title: 'Birthday',
    dataIndex: 'birthday',
    key: 'birthday',
    slots: { customRender: 'birthday' },
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    slots: { customRender: 'gender' },
  },
  {
    title: 'Operation',
    dataIndex: 'operation',
    slots: { customRender: 'operation' },
  }
])
const modelRef: userDetailItem = reactive({
  name: '',
  password: '',
  role: ROLES.user,
  location: DEFAULT_LOCATION,
  birthday: DEFAULT_BIRTHDAY,
  gender: GENDER.default
})
const rulesRef = reactive({
  name: [
    {
      required: true,
      type: 'number',
      message: 'Please input name',
    },
  ],
  password: [
    {
      required: true,
      message: 'Please input password',
    },
  ],
  role: [
    {
      required: true,
      message: 'Please input role',
    },
  ],
  location: [
    {
      required: false,
    },
  ],
  birthday: [
    {
      required: false,
    },
  ],
  gender: [
    {
      required: false,
    },
  ],
})
const useForm = Form.useForm
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)

async function init(): Promise<void> {
  getAllUsers().then(users => {
    users.forEach(user => {
      const res = { ...user, edit: false }
      state.data = [...state.data, res]
    })
  })
}

function onSubmit(): void {
  validate()
    .then(async () => {
      state.visible = false
      const user: userDetailItem = toRaw(modelRef)
      const id = await addUser(user)
      return id
    })
    .then(async id => {
      const user = await getUserById(id)
      state.data = [...state.data, { ...user, edit: false }]
      resetFields()
    })
    .catch(err => console.error(err))
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
  modelRef.id = state.data.length + 1
}

onMounted(() => init())
</script>

<style scoped>
.ant-table-striped :deep(.table-striped) {
  background-color: #fafafa;
}
</style>
