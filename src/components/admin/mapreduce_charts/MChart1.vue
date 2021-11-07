<template>
    <div class="flex flex-col w-4/5 ml-5">
        <div class="flex justify-start align-middle w-full h-8 space-x-6">
            <div class="text-xl font-semibold">按视频分 - Top</div>
            <a-input-number
                id="inputNumberBar"
                v-model:value="state.n"
                :min="1"
                :max="40"
                @change="changeN()"
            />
            <div class="text-lg font-medium align-middle p-0.5 text-gray-600">日期:</div>
            <a-select
                v-model:value="state.select"
                style="width: 120px"
                @focus="focus"
                ref="select"
                @change="changeSelect()"
            >
                <a-select-option v-for="tm in state.time" :value="tm">{{ tm }}</a-select-option>
            </a-select>
            <div class="flex text-lg ml-4 p-0.5 text-gray-600 space-x-1">
                <div>总访问量:</div>
                <div class="text-xl text-gray-900 align-middle">{{ state.sumTotal }}</div>
                <div class="align-bottom">
                    <span
                        :style="{ 'color': state.color }"
                        class="text-gray-800 text-sm align-baseline"
                    >{{ state.sign }}{{ state.sumRate }}</span>
                </div>
            </div>
        </div>
        <div id="bar" :style="{ width: '100%', height: '600px' }"></div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts/core'
import { AriaComponent, TooltipComponent, ToolboxComponent, GridComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use(
    [AriaComponent, TooltipComponent, ToolboxComponent, GridComponent, BarChart, CanvasRenderer]
)

const changeN = (): void => {
    updateData()
}
const changeSelect = (): void => {
    updateData()
}

type rateItem = string | number
interface dataItem {
    name: string,
    type: number,
    count: number,
    tm: string
}
interface cateset {
    [key: string]: string[]
}
interface dataSet {
    [key: string]: number[]
}
interface rateSet {
    [key: string]: rateItem[]
}
interface State {
    data: dataItem[],
    n: number,
    select: string,
    time: string[],
    cateset: cateset,
    dataset: dataSet,
    rateset: rateSet,
    sumTotal: number,
    sumRate: string,
    color: string,
    sign: string,
}
const state: State = reactive({
    data: [],
    n: 5,
    select: '',
    time: [],
    cateset: {},
    dataset: {},
    rateset: {},
    sumTotal: 0,
    sumRate: '- -',
    color: 'gray',
    sign: ''
})

const option = {
    // aria: {
    //     enabled: true,
    //     decal: {
    //         show: true
    //     }
    // },
    tooltip: {
        trigger: 'item',
        textStyle: {
            fontSize: 18
        },
        formatter: function (params: { data: number, dataIndex: number, name: string }): string {
            if (state.time.indexOf(state.select) === state.time.length - 1) {
                return params.name + colorDot('blue') + '播放量: ' + params.data
            } else {
                const rate: number | string = state.rateset[state.select][params.dataIndex]
                if (typeof rate === 'number') {
                    const color: string = rate < 0 ? 'red' : 'yellowgreen'
                    return params.name + colorDot('blue') + '播放量: ' + params.data + colorDot(color) + '增长率: ' + rate + '%'
                } else {
                    return params.name + colorDot('blue') + '播放量: ' + params.data + colorDot('gray') + '增长率: ' + rate
                }
            }
        }
    },
    toolbox: {
        show: true,
        orient: 'horizontal',
        itemSize: 14,
        itemGap: 12,
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true, title: "Save" }
        },
        emphasis: {
            iconStyle: {
                color: 'blue'
            }
        }
    },
    xAxis: {
        type: 'category',
        // data: state.cateset[state.select],
        axisTick: {
            length: 30
        },
        axisLabel: {
            padding: [9, 0, 0, 0],
            fontSize: 12,
            fontWeight: 'bold'
        }
    },
    yAxis: {
        show: false,
        type: 'value'
    },
    series: [{
        type: 'bar',
        barWidth: '60%',
        // data: state.dataset[state.select],
        label: {
            show: true,
            fontSize: 18,
            position: 'top',
            formatter: function (params: { data: number }) {
                return params.data
            }
        },
        itemStyle: {
            color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                ]
            )
        },
        emphasis: {
            itemStyle: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        { offset: 0, color: '#2378f7' },
                        { offset: 0.7, color: '#2378f7' },
                        { offset: 1, color: '#83bff6' }
                    ]
                )
            }
        },
        // showBackground: true,
        // backgroundStyle: {
        //     color: 'rgba(180, 180, 180, 0.2)'
        // }
    }]
}

const initBar = (): void => {
    const chartBar = document.getElementById('bar')!
    const myChartBar = echarts.init(chartBar)
    myChartBar.showLoading()

    getTm().then(() => {
        getCount(state.select).then(() => {
            getCountRate(state.select, state.sumTotal)
        })
        getData(state.select).then(() => {
            myChartBar.setOption(option)
            const dataOption = {
                xAxis: {
                    data: state.cateset[state.select].slice(0, state.n)
                },
                series: [{
                    data: state.dataset[state.select].slice(0, state.n),
                }]
            }
            myChartBar.setOption(dataOption)
            myChartBar.hideLoading()
        })
    })
}

async function getTm(): Promise<void> {
    try {
        const response = await axios.get(`/api/getDistinctTm`)
        state.time = response.data
        state.select = state.time[0]
    } catch (error) {
        console.error(error)
    }
}

async function getCount(tm: string): Promise<void> {
    try {
        const response = await axios.get(`/api/getMResultByNameAndTm?name=访问量&tm=${tm}`)
        state.sumTotal = response.data.count
    } catch (error) {
        console.error(error)
    }
}

async function getCountRate(time: string, count: number): Promise<void> {
    try {
        const index: number = state.time.indexOf(time)
        if (index < state.time.length - 1) {
            const tm: string = state.time[index + 1]
            const response = await axios.get(`/api/getMResultByNameAndTm?name=访问量&tm=${tm}`)
            const res = response.data
            const rate: number = (count - res.count) / res.count
            state.color = rate > 0 ? 'yellowgreen' : 'red'
            state.sign = rate > 0 ? '▲' : '▼'
            state.sumRate = roundFun(rate * 100, 2) + '%'
        } else {
            state.color = 'gray'
            state.sign = ''
            state.sumRate = '- -'
        }
    } catch (error) {
        console.error(error)
    }
}

async function getData(tm: string): Promise<void> {
    try {
        const response = await axios.get(`/api/getMResultByTypeAndTm?type=2&tm=${tm}`)
        state.data = response.data
        const res = state.data.sort(function (a, b) {
            return b.count - a.count
        }).slice(0, 40)
        if (!state.cateset[state.select]) {
            state.cateset[state.select] = []
            state.dataset[state.select] = []
            state.rateset[state.select] = []
            res.map(item => {
                state.cateset[item.tm].push(item.name)
                state.dataset[item.tm].push(item.count)
                getRate(item.name, state.select, item.count)
            })
        }
    } catch (error) {
        console.error(error)
    }
}

async function getRate(name: string, time: string, count: number): Promise<void> {
    try {
        const index: number = state.time.indexOf(time)
        if (index < state.time.length - 1) {
            const tm: string = state.time[index + 1]
            const response = await axios.get(`/api/getMResultByNameAndTm?name=${name}&tm=${tm}`)
            const res = response.data
            if (res) {
                const rate: number = (count - res.count) / res.count
                state.rateset[state.select].push(roundFun(rate * 100, 2))
            } else {
                state.rateset[state.select].push('--')
            }
        }
    } catch (error) {
        console.error(error)
    }
}

function updateData(): void {
    getCount(state.select).then(() => {
        getCountRate(state.select, state.sumTotal)
    })
    getData(state.select).then(() => {
        const chartBar = document.getElementById('bar')!
        const myChartBar = echarts.init(chartBar)
        myChartBar.showLoading()
        const dataOption = {
            xAxis: {
                data: state.cateset[state.select].slice(0, state.n)
            },
            series: [{
                data: state.dataset[state.select].slice(0, state.n),
            }]
        }
        myChartBar.setOption(dataOption)
        myChartBar.hideLoading()
    })
}

function roundFun(value: number, n: number): number {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
}

function colorDot(color: string): string {
    return `<br /><span style="font-size:22px;color:${color};"> ● </span>`
}

onMounted(() => initBar())
</script>
