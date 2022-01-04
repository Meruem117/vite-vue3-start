<template>
    <a-table
        :columns="columns"
        :data-source="state.data"
        class="ant-table-striped"
        :rowClassName="(record: upFormItem, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
        bordered
        rowKey="id"
    >
        <!-- mid -->
        <template #up-mid="{ text, record }">
            <div v-if="record.edit">
                <a-input v-model:value="record.mid" @pressEnter="formSave(record)" />
            </div>
            <div v-else>{{ text }}</div>
        </template>
        <!-- name -->
        <template #up-name="{ text, record }">
            <div v-if="record.edit">
                <a-input v-model:value="record.name" @pressEnter="formSave(record)" />
            </div>
            <div v-else>
                <a @click="router.push({ name: 'space', params: { mid: record.mid } })">{{ text }}</a>
            </div>
        </template>
        <!-- operation -->
        <template #up-operation="{ record }">
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
            <a-form-item label="Id" v-bind="validateInfos.id">
                <a-input v-model:value="modelRef.id" />
            </a-form-item>
            <a-form-item label="Mid" v-bind="validateInfos.mid">
                <a-input v-model:value="modelRef.mid" />
            </a-form-item>
            <a-form-item label="Name" v-bind="validateInfos.name">
                <a-input v-model:value="modelRef.name" />
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
import { upItem } from '@/models/up'
import { getAllUps, addUp, updateUp, deleteUp } from '@/services/up'

interface upFormItem extends upItem {
    edit: boolean
}
interface stateItem {
    data: upFormItem[],
    visible: boolean
}

const useForm = Form.useForm
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
        title: 'Mid',
        dataIndex: 'mid',
        key: 'mid',
        slots: { customRender: 'up-mid' },
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        slots: { customRender: 'up-name' },
        ellipsis: true,
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        slots: { customRender: 'up-operation' },
    }
])
const modelRef: upItem = reactive({
    id: 0,
    mid: '',
    name: ''
})
const rulesRef = reactive({
    id: [
        {
            required: true,
            type: 'number',
            message: 'Please input id',
        },
    ],
    mid: [
        {
            required: true,
            message: 'Please input mid',
        },
    ],
    name: [
        {
            required: true,
            message: 'Please input name',
        },
    ],
})
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)

async function init(): Promise<void> {
    getAllUps().then(ups => {
        ups.forEach(up => {
            const res = { ...up, edit: false }
            state.data = [...state.data, res]
        })
    })
}

function onSubmit(): void {
    validate()
        .then(() => {
            state.visible = false
            const up: upItem = toRaw(modelRef)
            addUp(up)
            return up
        })
        .then(up => {
            state.data = [...state.data, { ...up, edit: false }]
            resetFields()
        })
        .catch(err => console.error(err))
}

function formSave(record: upFormItem): void {
    record.edit = false
    updateUp(record)
}

function formDelete(record: upFormItem): void {
    deleteUp(record.id)
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
