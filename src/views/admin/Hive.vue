<template>
    <div class="adminContent">
        <v-md-preview :text="text" class="w-full" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { HIVE_DOC_PATH } from '@/constant'

const text = ref('')

function getHiveMd(): void {
    axios.get(HIVE_DOC_PATH)
        .then(res => text.value = res.data)
        .catch(err => console.error(err))
}

onMounted(() => getHiveMd())
</script>
