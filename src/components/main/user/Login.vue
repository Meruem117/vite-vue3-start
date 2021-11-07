<template>
    <div>
        <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
            <a-form-item label="Username" v-bind="validateInfos.name">
                <a-input
                    v-model:value="modelRef.name"
                    @blur="validate('name', { trigger: 'blur' })"
                />
            </a-form-item>
            <a-form-item label="Password" v-bind="validateInfos.password">
                <a-input
                    v-model:value="modelRef.password"
                    type="password"
                    autocomplete="off"
                    @blur="validate('password', { trigger: 'blur' })"
                />
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 15, offset: 5 }">
                <a-button type="primary" @click.prevent="onSubmit">Login</a-button>
                <a-button style="margin-left: 10px" @click="resetFields">Reset</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/store'
import axios from 'axios'
import { notification } from 'ant-design-vue'
import { Form } from 'ant-design-vue'

const store = useStore(key)
const useForm = Form.useForm
const modelRef = reactive({
    name: '',
    password: '',
    res: '',
    user: {
        name: '',
        gender: '',
        location: '',
        birthday: '',
        role: ''
    }
})
const rulesRef = reactive({
    name: [
        {
            required: true,
            message: 'Please input username',
        }
    ],
    password: [
        {
            required: true,
            message: 'Please input password',
        }
    ]
})
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef)
const onSubmit = (): void => {
    validate()
        .then(() => {
            checkUser(modelRef.name).then(() => {
                if (modelRef.res === modelRef.password) {
                    store.commit('isLogin', true)
                    store.commit('showModel', false)
                    getUserInfo(modelRef.name).then(() => {
                        store.commit('getUserInfo', modelRef.user)
                    })
                    notification.open({
                        message: 'Notification',
                        placement: 'topLeft',
                        description:
                            `Welcome ${modelRef.name}`,
                        duration: 5
                    })
                    resetFields()
                } else {
                    notification.open({
                        message: 'Notification',
                        placement: 'topLeft',
                        description:
                            'Login failed, wrong password or username',
                        duration: 5
                    })
                }
            })
        })
        .catch(err => {
            console.error('error', err)
        })
}

async function checkUser(name: string): Promise<void> {
    try {
        const response = await axios.get(`/api/checkUser?name=${name}`)
        modelRef.res = response.data
    } catch (error) {
        console.error(error)
    }
}

async function getUserInfo(name: string): Promise<void> {
    try {
        const response = await axios.get(`/api/getUserByName?name=${name}`)
        modelRef.user = response.data
    } catch (error) {
        console.error(error)
    }
}
</script>
