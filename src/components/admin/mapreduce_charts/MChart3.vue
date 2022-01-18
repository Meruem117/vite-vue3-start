<template>
    <div class="flex justify-start align-middle w-full h-8 space-x-6 mb-5">
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
        <div class="flex text-gray-600 text-lg ml-4 p-0.5 space-x-3">
            <div class="flex space-x-1">
                <div>登录用户数:</div>
                <div class="text-xl text-gray-900 align-middle">{{ state.login.sum }}</div>
                <div class="align-bottom">
                    <span
                        :style="{ 'color': state.login.color }"
                        class="text-gray-800 text-sm align-baseline"
                    >{{ state.login.sign }}{{ state.login.rate }}</span>
                </div>
            </div>
            <div class="flex space-x-1">
                <div class="ml-2">未登录用户数:</div>
                <div class="text-xl text-gray-900 align-middle">{{ state.notLogin.sum }}</div>
                <div class="align-bottom">
                    <span
                        :style="{ 'color': state.notLogin.color }"
                        class="text-gray-800 text-sm align-baseline"
                    >{{ state.notLogin.sign }}{{ state.notLogin.rate }}</span>
                </div>
            </div>
        </div>
    </div>
    <div id="map" :style="{ width: '90%', height: '1200px' }"></div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent, ToolboxComponent, VisualMapComponent, GeoComponent } from 'echarts/components'
import { MapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import * as geoJson from '@/static/json/china.json'
import { roundFun } from '@/utils'

echarts.use(
    [TitleComponent, TooltipComponent, ToolboxComponent, VisualMapComponent, GeoComponent, MapChart, CanvasRenderer]
)

const changeSelect = (): void => {
    updateData()
}

type rateItem = string | number
interface rate {
    sum: number,
    rate: string,
    color: string,
    sign: string
}
interface stateItem {
    data: {
        name: string,
        type: number,
        count: number,
        tm: string
    }[],
    select: string,
    time: string[],
    dataSet: {
        name: string,
        value: number
    }[],
    rateSet: rateItem[],
    login: rate,
    notLogin: rate
}
const state: stateItem = reactive({
    data: [],
    select: '',
    time: [],
    dataSet: [],
    rateSet: [],
    login: {
        sum: 0,
        rate: '',
        color: 'gray',
        sign: '--'
    },
    notLogin: {
        sum: 0,
        rate: '',
        color: 'gray',
        sign: '--'
    }
})

const nameMap: { [key: string]: string } = {
    '江苏省': '江苏',
    '浙江省': '浙江',
    '上海市': '上海',
    '广东省': '广东',
    '北京市': '北京'
}
const option = {
    title: {
        text: '用户活跃度',
        textStyle: {
            fontWeight: 'bolder',
            fontSize: 28
        }
    },
    tooltip: {
        trigger: 'item',
        textStyle: {
            fontSize: 16
        },
        formatter: function (params: { data: { name: string, value: number }, dataIndex: number }): string {
            if (state.time.indexOf(state.select) === state.time.length - 1) {
                return params.data.name + colorDot('blue') + '访问量: ' + params.data.value
            } else {
                const rate: number | string = state.rateSet[params.dataIndex]
                if (typeof rate === 'number') {
                    const color: string = rate < 0 ? 'red' : 'yellowgreen'
                    return params.data.name + colorDot('blue') + '访问量: ' + params.data.value + colorDot(color) + '增长率: ' + rate + '%'
                } else {
                    return params.data.name + colorDot('blue') + '访问量: ' + params.data.value + colorDot('gray') + '增长率: ' + rate
                }
            }
        }
    },
    toolbox: {
        show: true,
        orient: 'horizontal',
        itemSize: 18,
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
    visualMap: {
        min: 500,
        max: 50000,
        text: ['High', 'Low'],
        realtime: false,
        calculable: true,
        inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
        }
    },
    geo: {
        map: 'china',
        roam: false,
        zoom: 1,
        label: {
            normal: {
                show: false,
                fontSize: 15,
                color: 'rgba(0,0,0,0.7)'
            }
        },
        itemStyle: {
            normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: {
                areaColor: 'yellow',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    },
    series: [
        {
            name: '省份',
            type: 'map',
            mapType: "china",
            // data: state.dataset,
            label: {
                show: false,
                fontSize: 18
            },
            nameMap: nameMap
        }
    ]
}

const initMap = (): void => {
    const chartMap = document.getElementById('map')!
    const myChartMap = echarts.init(chartMap)
    echarts.registerMap('china', geoJson)
    myChartMap.showLoading()

    getTm().then(() => {
        getSum(state.select).then(() => {
            getSumRate(state.select)
        })
        getData(state.select).then(() => {
            myChartMap.setOption(option)
            const dataOption = {
                series: [{
                    data: state.dataSet,
                }]
            }
            myChartMap.setOption(dataOption)
            myChartMap.hideLoading()
        })
    })
}

async function getSum(tm: string): Promise<void> {
    try {
        const response1 = await axios.get(`/api/chart/getMResultByNameAndTm?name=登录&tm=${tm}`)
        const response2 = await axios.get(`/api/chart/getMResultByNameAndTm?name=未登录&tm=${tm}`)
        state.login.sum = response1.data.count
        state.notLogin.sum = response2.data.count
    } catch (error) {
        console.error(error)
    }
}

async function getSumRate(time: string): Promise<void> {
    try {
        const index: number = state.time.indexOf(time)
        if (index < state.time.length - 1) {
            const tm: string = state.time[index + 1]
            const response1 = await axios.get(`/api/chart/getMResultByNameAndTm?name=登录&tm=${tm}`)
            const response2 = await axios.get(`/api/chart/getMResultByNameAndTm?name=未登录&tm=${tm}`)
            const res1 = response1.data
            const res2 = response2.data
            const rate1: number = (state.login.sum - res1.count) / res1.count
            const rate2: number = (state.notLogin.sum - res2.count) / res2.count
            state.login.color = rate1 > 0 ? 'yellowgreen' : 'red'
            state.notLogin.color = rate2 > 0 ? 'yellowgreen' : 'red'
            state.login.sign = rate1 > 0 ? '▲' : '▼'
            state.notLogin.sign = rate2 > 0 ? '▲' : '▼'
            state.login.rate = roundFun(rate1 * 100, 2) + '%'
            state.notLogin.rate = roundFun(rate2 * 100, 2) + '%'
        } else {
            state.login.color = state.notLogin.color = 'gray'
            state.login.sign = state.notLogin.sign = ''
            state.login.rate = state.notLogin.rate = '- -'
        }
    } catch (error) {
        console.error(error)
    }
}

async function getTm(): Promise<void> {
    try {
        const response = await axios.get(`/api/chart/getDistinctTm`)
        state.time = response.data
        state.select = state.time[0]
    } catch (error) {
        console.error(error)
    }
}

async function getData(tm: string): Promise<void> {
    try {
        const response = await axios.get(`/api/chart/getMResultByTypeAndTm?type=3&tm=${tm}`)
        state.data = response.data
        const res = state.data
        state.dataSet.length = 0
        state.rateSet.length = 0
        res.map(item => {
            state.dataSet.push({ name: item.name, value: item.count })
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
            const response = await axios.get(`/api/chart/getMResultByNameAndTm?name=${name}&tm=${tm}`)
            const res = response.data
            if (res) {
                const rate: number = (count - res.count) / res.count
                state.rateSet.push(roundFun(rate * 100, 2))
            } else {
                state.rateSet.push('--')
            }
        }
    } catch (error) {
        console.error(error)
    }
}

function updateData(): void {
    getSum(state.select).then(() => {
        getSumRate(state.select)
    })
    getData(state.select).then(() => {
        const chartMap = document.getElementById('map')!
        const myChartMap = echarts.init(chartMap)
        myChartMap.showLoading()
        const dataOption = {
            series: [{
                data: state.dataSet,
            }]
        }
        myChartMap.setOption(dataOption)
        myChartMap.hideLoading()
    })
}

function colorDot(color: string): string {
    return `<br /><span style="font-size:22px;color:${color};"> ● </span>`
}

onMounted(() => initMap())
</script>
