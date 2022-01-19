<template>
    <a-table
        :columns="columns"
        :data-source="state.data"
        class="ant-table-striped"
        :rowClassName="(record: upItem, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
        bordered
        rowKey="id"
    >
        <!-- mid -->
        <template #up-mid="{ text, record }">
            <a-input
                v-if="editableData[record.id]"
                v-model:value="editableData[record.id]['mid']"
                @pressEnter="formSave(record.id)"
            />
            <div v-else>{{ text }}</div>
        </template>
        <!-- name -->
        <template #up-name="{ text, record }">
            <a-input
                v-if="editableData[record.id]"
                v-model:value="editableData[record.id]['name']"
                @pressEnter="formSave(record.id)"
            />
            <di v-else>{{ text }}</di>
        </template>
        <!-- operation -->
        <template #up-operation="{ record }">
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
import { reactive, onMounted, toRaw, ref, Ref, UnwrapRef } from 'vue'
import { cloneDeep } from 'lodash'
import { Form } from 'ant-design-vue'
// import { upItem } from '@/models/up'
import { getAllUps, addUp, updateUp, deleteUp } from '@/services/up'

interface upItem {
    id: number,
    mid: string,
    name: string
}
interface stateItem {
    data: upItem[],
    visible: boolean
}

const state: stateItem = reactive({
    data: [],
    visible: false
})
const dataSource: Ref<upItem[]> = ref([])
const editableData: UnwrapRef<Record<number, upItem>> = reactive({})
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
const useForm = Form.useForm
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)

async function init(): Promise<void> {
    state.data = await getAllUps()
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
    updateUp(editableData[id])
    delete editableData[id]
}

function formDelete(id: number): void {
    deleteUp(id)
}

function openModal(): void {
    state.visible = true
    modelRef.id = state.data.length + 1
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
            state.data = [...state.data, up]
            resetFields()
        })
        .catch(err => console.error(err))
}

onMounted(() => init())
</script>

<style scoped>
.ant-table-striped :deep(.table-striped) {
    background-color: #fafafa;
}
</style>
