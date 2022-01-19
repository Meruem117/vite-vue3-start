<template>
    <div class="flex flex-col w-4/5 ml-5">
        <div class="flex justify-start align-middle w-full h-8 space-x-6">
            <div class="text-xl font-semibold">按作者分 - Top</div>
            <a-input-number
                id="inputNumberRose"
                v-model:value="state.n"
                :min="1"
                :max="state.dataSet.length"
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
import * as echarts from 'echarts/core'
import { TitleComponent, ToolboxComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { getDistinctTm, getMResultByNameAndTm, getMResultByTypeAndTm } from '@/services/chart'
import { roundFun, colorDot } from '@/utils'
import { TYPE } from '@/constant'

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
interface stateItem {
    data: {
        name: string,
        type: number,
        count: number,
        tm: string
    }[],
    n: number,
    select: string,
    time: string[],
    dataSet: {
        value: number,
        name: string
    }[],
    rateSet: rateItem[]
}
const state: stateItem = reactive({
    data: [],
    n: 5,
    select: '',
    time: [],
    dataSet: [],
    rateSet: []
})

const option = {
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
                const rate: number | string = state.rateSet[params.dataIndex]
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
                    data: state.dataSet.slice(0, state.n),
                }]
            }
            myChartRose.setOption(dataOption)
            myChartRose.hideLoading()
        })
    })
}

async function getTm(): Promise<void> {
    state.time = await getDistinctTm()
    state.select = state.time[0]
}

async function getData(tm: string): Promise<void> {
    state.data = await getMResultByTypeAndTm(TYPE.UP, tm)
    const res = state.data.sort(function (a, b) {
        return b.count - a.count
    })
    state.dataSet.length = 0
    state.rateSet.length = 0
    res.map(item => {
        state.dataSet.push({ value: item.count, name: item.name })
        getRate(item.name, state.select, item.count)
    })
}

async function getRate(name: string, time: string, count: number): Promise<void> {
    const index: number = state.time.indexOf(time)
    if (index < state.time.length - 1) {
        const tm: string = state.time[index + 1]
        const res = await getMResultByNameAndTm(name, tm)
        if (res) {
            const rate: number = (count - res.count) / res.count
            state.rateSet.push(roundFun(rate * 100, 2))
        } else {
            state.rateSet.push('--')
        }
    }
}

function updateData(): void {
    getData(state.select).then(() => {
        const chartRose = document.getElementById('rose')!
        const myChartRose = echarts.init(chartRose)
        myChartRose.showLoading()
        const dataOption = {
            series: [{
                data: state.dataSet.slice(0, state.n),
            }]
        }
        myChartRose.setOption(dataOption)
        myChartRose.hideLoading()
    })
}

onMounted(() => initRose())
</script>
