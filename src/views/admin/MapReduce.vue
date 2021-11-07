<template>
    <div class="adminContent">
        <div class="flex flex-col space-y-10 w-full">
            <h1>MapReduce</h1>
            <div class="w-full pr-20">
                <a-steps :current="state.current" direction="horizontal">
                    <a-step title="Step 1" description="生成日志" />
                    <a-step title="Step 2" description="Flume导出到HDFS" />
                    <a-step title="Step 3" description="MapReduce分析" />
                    <a-step title="Step 4" description="Sqoop导出到MySQL" />
                </a-steps>
            </div>
            <div class="flex">
                <!-- 生成日志 -->
                <div class="flex space-x-2" v-if="state.current === 0">
                    <a-input-number
                        id="inputNumberMapReduce"
                        v-model:value="state.number"
                        :min="100"
                        :max="10000"
                    />
                    <a-button
                        type="primary"
                        :loading="state.isLoading[0]"
                        @click="generateLogs(state.number)"
                        class="w-40"
                    >生成日志</a-button>
                </div>
                <!-- Flume导出到HDFS -->
                <div class="flex flex-col space-y-3" v-if="state.current === 1">
                    <div class="flex space-x-2">
                        <a-button
                            type="primary"
                            :loading="state.isLoading[0]"
                            @click="flumeToHdfs"
                            class="w-40"
                        >Flume导出到HDFS</a-button>
                        <!-- 查看日志目录下文件 -->
                        <a-button type="primary" @click="ls(state.path)" class="w-40">查看</a-button>
                    </div>
                    <div class="text-lg">{{ state.lsResult }}</div>
                </div>
                <!-- MapReduce分析 -->
                <div class="flex space-x-2" v-if="state.current === 2">
                    <a-input v-model:value="state.input" placeholder="input path" />
                    <a-button
                        type="primary"
                        :loading="state.isLoading[0]"
                        @click="mapreduce(state.input)"
                        class="w-40"
                    >MapReduce分析</a-button>
                </div>
                <!-- Sqoop导出到MySQL -->
                <div class="flex space-x-2" v-if="state.current === 3">
                    <a-input v-model:value="state.output" placeholder="hdfs path" />
                    <a-button
                        type="primary"
                        :loading="state.isLoading[0]"
                        @click="sqoopToMysql(state.output)"
                        class="w-40"
                    >Sqoop导出到MySQL</a-button>
                </div>
                <!-- 结束 -->
                <div class="text-xl tracking-wider" v-if="state.current === 4">Finished</div>
                <div class="flex space-x-2 absolute right-5">
                    <a-button type="primary" @click="state.current--" v-if="state.current > 0">上一步</a-button>
                    <a-button type="primary" @click="state.current++" v-if="state.current < 4">下一步</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import * as logService from '@/services/log'
import { GENERATE_LOG_NUMBER, BASE_HDFS_INPUT_PATH, BASE_HDFS_OUTPUT_PATH, BASE_LOCAL_LOG_PATH } from '@/constant'

const state = reactive({
    current: 0,
    number: GENERATE_LOG_NUMBER,
    input: BASE_HDFS_INPUT_PATH,
    output: BASE_HDFS_OUTPUT_PATH,
    path: BASE_LOCAL_LOG_PATH,
    isLoading: [false, false, false, false],
    isDone: [false, false, false, false],
    lsResult: ''
})

async function generateLogs(number: number): Promise<void> {
    state.isLoading[0] = true
    state.isDone[0] = await logService.generateLogs(number)
    state.isLoading[0] = false
    if (state.isDone[0]) {
        message.success('日志生成成功')
    } else {
        message.error('日志生成失败')
    }
}

async function flumeToHdfs(): Promise<void> {
    state.isLoading[1] = true
    state.isDone[1] = await logService.flumeToHdfs()
    state.isLoading[1] = false
    if (state.isDone[1]) {
        message.success('Flume导出到HDFS成功')
    } else {
        message.error('Flume导出到HDFS失败')
    }
}

async function mapreduce(input: string): Promise<void> {
    state.isLoading[2] = true
    state.isDone[2] = await logService.mapreduce(input)
    state.isLoading[2] = false
    if (state.isDone[2]) {
        message.success('MapReduce分析成功')
    } else {
        message.error('MapReduce分析失败')
    }
}

async function sqoopToMysql(path: string): Promise<void> {
    state.isLoading[3] = true
    state.isDone[3] = await logService.sqoopToMysql(path)
    state.isLoading[3] = false
    if (state.isDone[3]) {
        message.success('Sqoop导出到MySQL成功')
    } else {
        message.error('Sqoop导出到MySQL失败')
    }
}

async function ls(path: string): Promise<void> {
    state.lsResult = await logService.ls(path)
}
</script>
