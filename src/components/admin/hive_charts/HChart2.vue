<template>
    <div class="flex flex-row space-x-3 mb-5 ml-3 px-5">
        <div id="bars" :style="{ width: '80%', height: '1000px' }"></div>
        <div class="text-xl w-1/5">
            <div class="text-xl font-semibold mb-5">视频总数排名</div>
            <div
                v-for="up,index in state.totalData"
                :key="index"
                class="flex flex-row justify-start mb-4"
            >
                <div class="flex flex-row justify-start p-0.5 w-4/5">
                    <div
                        class="flex bg-gray-900 text-gray-100 w-6 h-6 rounded-full justify-center pt-0.5 text-sm"
                        v-if="index < 3"
                    >{{ index + 1 }}</div>
                    <div
                        class="flex bg-gray-100 text-gray-900 w-6 h-6 rounded-full justify-center pt-0.5 text-sm"
                        v-else
                    >{{ index + 1 }}</div>
                    <div class="text-base ml-16">{{ up.author }}</div>
                </div>
                <div class="w-1/5 text-right">{{ up.total }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent, ToolboxComponent, GridComponent, LegendComponent } from 'echarts/components'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { hResultItem2 } from '@/models/chart'
import { getHResult2 } from '@/services/chart'

echarts.use(
    [TitleComponent, TooltipComponent, ToolboxComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]
)

interface totalItem {
    author: string,
    total: number
}
interface stateItem {
    barsData: hResultItem2[],
    totalData: totalItem[]
}
interface dataset {
    name: string,
    type: 'bar',
    label: typeof labelOption,
    stack: 'total',
    emphasis: {
        focus: 'series'
    },
    barWidth: number,
    data: [number | string]
}

const state: stateItem = reactive({
    barsData: [],
    totalData: []
})

//* bar chart
const cate: string[] = []
const year: string[] = []
const labelOption = {
    show: true,
    fontSize: 16,
}
const keyMap: { [key: string]: number } = {}
const dataMap: { [key: string]: [number | string] } = {}
const barsData: dataset[] = []
const optionBars = {
    title: {
        text: '按年分类',
        textStyle: {
            fontWeight: 'bolder',
            fontSize: 20
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
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
    legend: {
        data: year
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                show: true,
                length: 15,
                lineStyle: {
                    width: 2
                }
            },
            data: cate,
            axisLabel: {
                fontSize: 17,
                fontWeight: 'bold',
                rotate: 22
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            axisLabel: {
                fontSize: 12
            }
        }
    ],
    series: barsData
}

//* total list
const totalMap: { [key: string]: number } = {}
const totalMapValues: [string, number][] = []

const initBars = (): void => {
    const chartBars = document.getElementById('bars')!
    const myChartBars = echarts.init(chartBars)
    myChartBars.showLoading()

    getBarsData().then(() => {
        myChartBars.setOption(optionBars)
        myChartBars.hideLoading()
    })
}

async function getBarsData(): Promise<void> {
    state.barsData = await getHResult2()
    // res按名字排序
    const res = state.barsData.sort(function (a, b) {
        return a.author.localeCompare(b.author)
    })
    res.map(item => {
        // up列表
        if (!cate.includes(item.author)) {
            cate.push(item.author)
        }
        // 年份
        const y = item.tm.slice(0, 4)
        if (!year.includes(y)) {
            year.push(y)
        }
        // 各up视频总数
        if (totalMap[item.author]) {
            totalMap[item.author] += item.count
        } else {
            totalMap[item.author] = item.count
        }
    })
    // 视频总数
    cate.map(item => {
        totalMapValues.push([item, totalMap[item]])
    })
    // 倒序排序
    totalMapValues.sort(function (a, b) {
        return b[1] - a[1]
    })
    // totalData赋值
    const { totalData } = state
    totalData.length = 0
    totalMapValues.map(item => {
        totalData.push({ author: item[0], total: item[1] })
    })
    year.sort()
    // 初始化keyMap
    for (let i in cate) {
        for (let j in year) {
            keyMap[cate[i] + year[j]] = 0
        }
    }
    // keyMap赋值
    res.map(item => {
        if (keyMap[item.author + item.tm.slice(0, 4)]) {
            keyMap[item.author + item.tm.slice(0, 4)] += item.count
        } else {
            keyMap[item.author + item.tm.slice(0, 4)] = item.count
        }
    })
    for (let i in year) {
        // dataMap赋值
        cate.map(c => {
            const key = c + year[i]
            if (dataMap[year[i]]) {
                dataMap[year[i]].push(keyMap[key] === 0 ? '' : keyMap[key])
            } else {
                dataMap[year[i]] = [keyMap[key] === 0 ? '' : keyMap[key]]
            }
        })
        // 图表数据
        barsData.push({
            name: year[i],
            type: 'bar',
            stack: 'total',
            label: labelOption,
            emphasis: {
                focus: 'series'
            },
            barWidth: 55,
            data: dataMap[year[i]]
        })
    }
}

onMounted(() => initBars())
</script>
