<template>
    <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 15 }"
    >
        <a-form-item ref="name" label="Username" name="name">
            <a-input v-model:value="formState.name" placeholder="Please input your username" />
        </a-form-item>
        <a-form-item required has-feedback label="Password" name="password">
            <a-input
                v-model:value="formState.password"
                type="password"
                autocomplete="off"
                placeholder="Please input your password"
            />
        </a-form-item>
        <a-form-item has-feedback label="Confirm" name="checkPassword">
            <a-input
                v-model:value="formState.checkPassword"
                type="password"
                autocomplete="off"
                placeholder="Please input your password again"
            />
        </a-form-item>
        <a-form-item label="Location">
            <a-cascader
                v-model:value="formState.location"
                :options="valueCity"
                placeholder="Please select your location"
            />
        </a-form-item>
        <a-form-item label="Birthday">
            <a-date-picker
                v-model:value="formState.birthday"
                placeholder="Please pick your birthday"
                class="w-full"
            />
        </a-form-item>
        <a-form-item label="Gender">
            <a-radio-group v-model:value="formState.gender">
                <a-radio value="male">Male</a-radio>
                <a-radio value="female">Female</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 15, offset: 5 }">
            <a-button type="primary" @click="onSubmit">Create</a-button>
            <a-button class="ml-2" @click="resetForm">Reset</a-button>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { reactive, ref, UnwrapRef } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/store'
import { notification } from 'ant-design-vue'
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import axios from 'axios'
import moment from 'moment'

const store = useStore(key)

interface FormState {
    name: string,
    password: string,
    checkPassword: string,
    location: string,
    birthday: string,
    gender: string
}
const formRef = ref()
const formState: UnwrapRef<FormState> = reactive({
    name: '',
    password: '',
    checkPassword: '',
    location: '',
    birthday: '',
    gender: ''
})

const validatePassword = async (rule: RuleObject, value: string) => {
    if (value === '') {
        return Promise.reject('Please input the password');
    } else {
        if (formState.checkPassword !== '') {
            formRef.value.validateField('checkPassword');
        }
        return Promise.resolve();
    }
}
const validateCheckPassword = async (rule: RuleObject, value: string) => {
    if (value === '') {
        return Promise.reject('Please input the password again');
    } else if (value !== formState.password) {
        return Promise.reject("Two inputs don't match!");
    } else {
        return Promise.resolve();
    }
}

interface cityOption {
    value: string,
    label: string,
    children?: cityOption[],
    [key: string]: any,
}
const valueCity: cityOption[] = [
    {
        value: '浙江',
        label: '浙江',
        children: [
            {
                value: '杭州',
                label: '杭州'
            },
        ]
    },
    {
        value: '江苏',
        label: '江苏',
        children: [
            {
                value: '南京',
                label: '南京'
            },
        ]
    }
]

const rules = {
    name: [
        { required: true, message: 'Please input username', trigger: 'blur' },
        { min: 2, max: 15, message: 'Length should be 2 to 15', trigger: 'blur' },
    ],
    password: [
        { validator: validatePassword, required: true, trigger: 'change' },
        { min: 6, max: 24, message: 'Length should be 6 to 24', trigger: 'change' }],
    checkPassword: [
        { validator: validateCheckPassword, required: true, trigger: 'change' },
        { min: 6, max: 24, message: 'Length should be 6 to 24', trigger: 'change' }],
}

const onSubmit = (): void => {
    formRef.value
        .validate()
        .then(() => {
            addUser(formState).then(() => {
                store.commit('isLogin', true)
                store.commit('showModel', false)
                const user = {
                    name: formState.name,
                    gender: formState.gender,
                    location: formState.location[0] + ' ' + formState.location[1],
                    birthday: moment(formState.birthday).format('YYYY-MM-DD'),
                    role: 'user'
                }
                store.commit('getUserInfo', user)
                notification.open({
                    message: 'Notification',
                    placement: 'topLeft',
                    description:
                        `Welcome ${formState.name} !`,
                    duration: 5
                })
            })
        })
        .catch((error: ValidateErrorEntity<FormState>) => {
            console.error('error', error);
        })
}

const resetForm = (): void => {
    formRef.value.resetFields();
}

async function addUser(user: typeof formState): Promise<void> {
    const birth = moment(user.birthday).format('YYYY-MM-DD')
    const loc = user.location[0] + ' ' + user.location[1]
    try {
        await axios.post(`/api/addUser?name=${user.name}&password=${user.password}&gender=${user.gender}&location=${loc}&birthday=${birth}`)
    } catch (error) {
        console.error(error)
    }
}
</script>
