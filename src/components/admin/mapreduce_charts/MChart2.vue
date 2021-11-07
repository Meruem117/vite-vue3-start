<template>
    <div class="flex flex-col w-4/5 ml-5">
        <div class="flex justify-start align-middle w-full h-8 space-x-6">
            <div class="text-xl font-semibold">按作者分 - Top</div>
            <a-input-number
                id="inputNumberRose"
                v-model:value="state.n"
                :min="1"
                :max="state.dataset.length"
                @change="changeN()"
            />
            <div class="text-lg font-medium align-middle p-0.5">日期 :</div>
            <a-select
                v-model:value="state.select"
                style="width: 120px"
                @focus="focus"
                ref="select"
                @change="changeSelect()"
            >
                <a-select-option v-for="tm in state.time" :value="tm">{{ tm }}</a-select-option>
            </a-select>
        </div>
        <div id="rose" :style="{ width: '100%', height: '900px' }"></div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts/core'
import { TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use(
    [TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]
)

const changeN = (): void => {
    updateData()
}
const changeSelect = (): void => {
    updateData()
}

type rateItem = string | number
interface State {
    data: {
        name: string,
        type: number,
        count: number,
        tm: string
    }[],
    n: number,
    select: string,
    time: string[],
    dataset: {
        value: number,
        name: string
    }[],
    rateset: rateItem[]
}
const state: State = reactive({
    data: [],
    n: 5,
    select: '',
    time: [],
    dataset: [],
    rateset: []
})

const option = {
    // title: {
    //     text: '各up视频播放量 Top ' + n.value,
    //     textStyle: {
    //         fontWeight: 'bolder',
    //         fontSize: 22
    //     }
    // },
    legend: {
        bottom: '5%',
        textStyle: {
            fontSize: 16
        }
    },
    tooltip: {
        trigger: 'item',
        textStyle: {
            fontSize: 16
        },
        formatter: function (params: { data: { value: number, name: string }, dataIndex: number }): string {
            if (state.time.indexOf(state.select) === state.time.length - 1) {
                return params.data.name + colorDot('blue') + '播放量: ' + params.data.value
            } else {
                const rate: number | string = state.rateset[params.dataIndex]
                if (typeof rate === 'number') {
                    const color: string = rate < 0 ? 'red' : 'yellowgreen'
                    return params.data.name + colorDot('blue') + '播放量: ' + params.data.value + colorDot(color) + '增长率: ' + rate + '%'
                } else {
                    return params.data.name + colorDot('blue') + '播放量: ' + params.data.value + colorDot('gray') + '增长率: ' + rate
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
    series: [
        {
            name: 'up主',
            type: 'pie',
            radius: [50, 300],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8
            },
            // data: state.dataset.slice(0, state.n),
            label: {
                show: true,
                fontSize: 20
            }
        }
    ]
}

const initRose = (): void => {
    const chartRose = document.getElementById('rose')!
    const myChartRose = echarts.init(chartRose)
    myChartRose.showLoading()

    getTm().then(() => {
        getData(state.select).then(() => {
            myChartRose.setOption(option)
            const dataOption = {
                series: [{
                    data: state.dataset.slice(0, state.n),
                }]
            }
            myChartRose.setOption(dataOption)
            myChartRose.hideLoading()
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

async function getData(tm: string): Promise<void> {
    try {
        const response = await axios.get(`/api/getMResultByTypeAndTm?type=1&tm=${tm}`)
        state.data = response.data
        const res = state.data.sort(function (a, b) {
            return b.count - a.count
        })
        state.dataset.length = 0
        state.rateset.length = 0
        res.map(item => {
            state.dataset.push({ value: item.count, name: item.name })
            getRate(item.name, state.select, item.count)
        })
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
                state.rateset.push(roundFun(rate * 100, 2))
            } else {
                state.rateset.push('--')
            }
        }
    } catch (error) {
        console.error(error)
    }
}

function updateData(): void {
    getData(state.select).then(() => {
        const chartRose = document.getElementById('rose')!
        const myChartRose = echarts.init(chartRose)
        myChartRose.showLoading()
        const dataOption = {
            series: [{
                data: state.dataset.slice(0, state.n),
            }]
        }
        myChartRose.setOption(dataOption)
        myChartRose.hideLoading()
    })
}

function roundFun(value: number, n: number): number {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n)
}

function colorDot(color: string): string {
    return `<br /><span style="font-size:22px;color:${color};"> ● </span>`
}

onMounted(() => initRose())
</script>
