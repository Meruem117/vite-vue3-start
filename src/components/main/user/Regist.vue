<template>
  <a-form
    name="regist-form"
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="{ span: 5 }"
    :wrapper-col="{ span: 15 }"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item has-feedback label="Username" name="name">
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
        v-model:value="formState.rawLocation"
        :options="CITY_LIST"
        placeholder="Please select your location"
      />
    </a-form-item>
    <a-form-item label="Birthday">
      <a-date-picker
        v-model:value="formState.rawBirthday"
        placeholder="Please pick your birthday"
        class="w-full"
      />
    </a-form-item>
    <a-form-item label="Gender">
      <a-radio-group v-model:value="formState.gender">
        <a-radio :value="GENDER.male">Male</a-radio>
        <a-radio :value="GENDER.female">Female</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 15, offset: 5 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
      <a-button class="ml-2" @click="resetForm">Reset</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store/store'
import { notification } from 'ant-design-vue'
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { Moment } from 'moment'
import type { userDetailItem } from '@/models/user'
import { addUser, userExistByName } from '@/services/user'
import { ROLES, GENDER, DEFAULT_LOCATION, DEFAULT_BIRTHDAY, DEFAULT_DATE_FORMAT, CITY_LIST } from '@/constant'

interface FormState extends userDetailItem {
  checkPassword: string,
  rawLocation: string,
  rawBirthday: Moment | null
}

const store = useStore(key)
const emit = defineEmits(['closeModal'])
const formRef = ref()
const formState: FormState = reactive({
  name: '',
  password: '',
  checkPassword: '',
  role: ROLES.user,
  location: DEFAULT_LOCATION,
  rawLocation: '',
  birthday: DEFAULT_BIRTHDAY,
  rawBirthday: null,
  gender: GENDER.default,
})
const rules = {
  name: [
    { validator: validateUsername, required: true, trigger: 'change' },
    { min: 2, max: 15, message: 'Length should be 2 to 15', trigger: 'change' }
  ],
  password: [
    { validator: validatePassword, required: true, trigger: 'change' },
    { min: 6, max: 24, message: 'Length should be 6 to 24', trigger: 'change' }
  ],
  checkPassword: [
    { validator: validateCheckPassword, required: true, trigger: 'change' },
    { min: 6, max: 24, message: 'Length should be 6 to 24', trigger: 'change' }
  ],
}

async function validateUsername(rule: RuleObject, value: string): Promise<void> {
  if (value === '') {
    return Promise.reject('Please input your username')
  } else {
    const res = await userExistByName(value)
    if (res) {
      return Promise.reject('Username already exists')
    } else {
      return Promise.resolve()
    }
  }
}

async function validatePassword(rule: RuleObject, value: string): Promise<void> {
  if (value === '') {
    return Promise.reject('Please input your password')
  } else {
    if (formState.checkPassword !== '') {
      formRef.value.validateFields('checkPassword')
    }
    return Promise.resolve()
  }
}

async function validateCheckPassword(rule: RuleObject, value: string): Promise<void> {
  if (value === '') {
    return Promise.reject('Please input your password again')
  } else if (value !== formState.password) {
    return Promise.reject("Two inputs don't match!")
  } else {
    return Promise.resolve()
  }
}

function resetForm(): void {
  formRef.value.resetFields()
  formState.rawLocation = ''
  formState.rawBirthday = null
  formState.gender = ''
}

async function handleFinish(values: FormState): Promise<void> {
  const user = Object.assign(formState, values)
  user.location = user.rawLocation[0] + ' ' + user.rawLocation[1]
  user.birthday = user.rawBirthday!.format(DEFAULT_DATE_FORMAT)
  const id = await addUser(user)
  store.commit('getUser', { ...user, id })
  store.commit('isLogin', true)
  emit('closeModal')
  notification.open({
    message: 'Notification',
    placement: 'topLeft',
    description: `Welcome ${formState.name} !`,
    duration: 5
  })
}

function handleFinishFailed(errors: ValidateErrorEntity<FormState>): void {
  console.error(errors)
}
</script>
