<template>
    <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-form-item label="Username" v-bind="validateInfos.name">
            <a-input v-model:value="modelRef.name" @blur="validate('name', { trigger: 'blur' })" />
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
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/store'
import { Form, notification } from 'ant-design-vue'
import { checkUser, getUserByName } from '@/services/user'

const store = useStore(key)
const useForm = Form.useForm
const modelRef = reactive({
    name: '',
    password: '',
    res: '',
    user: {
        name: '',
        role: '',
        location: '',
        birthday: '',
        gender: '',
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

function onSubmit(): void {
    validate()
        .then(async () => {
            const result: boolean = await checkUser({ name: modelRef.name, password: modelRef.password })
            if (result === true) {
                store.commit('isLogin', true)
                store.commit('showModel', false)
                getUserByName(modelRef.name).then(res => store.commit('getUserInfo', res))
                notification.open({
                    message: 'Notification',
                    placement: 'topLeft',
                    description: `Welcome ${modelRef.name}`,
                    duration: 5
                })
                resetFields()
            } else {
                notification.open({
                    message: 'Notification',
                    placement: 'topLeft',
                    description: 'Login failed, wrong password or username',
                    duration: 5
                })
            }
        })
        .catch(err => console.error(err))
}
</script>
