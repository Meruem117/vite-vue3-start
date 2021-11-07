<template>
    <div class="flex flex-row">
        <div id="radar" :style="{ width: '60%', height: '600px' }"></div>
        <div id="line" :style="{ width: '40%', height: '600px' }"></div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent, ToolboxComponent, GridComponent, MarkLineComponent, LegendComponent } from 'echarts/components'
import { LineChart, RadarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use(
    [TitleComponent, TooltipComponent, ToolboxComponent, GridComponent, MarkLineComponent, LegendComponent, LineChart, RadarChart, CanvasRenderer]
)

const state = reactive({
    data: [{
        author: '',
        tm: '',
        count: 0
    }]
})

const year: string[] = []
const line: number[] = []
const optionLine = {
    title: {
        text: '趋势',
        textStyle: {
            fontWeight: 'bolder',
            fontSize: 20
        }
    },
    tooltip: {
        trigger: 'axis',
        formatter: '{b}年<br />视频数: {c} (个)',
        axisPointer: {
            type: 'line',
            snap: true
        },
        textStyle: {
            fontSize: 18
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
        name: '年份',
        nameGap: 20,
        data: year,
        nameTextStyle: {
            fontSize: 22
        },
        axisTick: {
            alignWithLabel: true,
            inside: true,
            length: 15,
            lineStyle: {
                width: 2,
                cap: "square"
            }
        },
        axisLine: {
            symbol: ['none', 'arrow']
        },
        axisLabel: {
            padding: [7, 0, 0, 0],
            fontSize: 20
        }
    },
    yAxis: {
        show: false,
        type: 'value',
        // name: '视频数',
        // nameGap: 20,
        // nameTextStyle: {
        //     fontSize: 24
        // }
    },
    series: [{
        type: 'line',
        data: line,
        label: {
            show: true,
            fontSize: 22,
            position: 'top'
        },
        symbolSize: 15,
        markLine: {
            data: [
                { type: 'average', name: '平均值' }
            ]
        }
    }]
}

const author: string[] = []
const month: string[] = []
const cate: { name: string, max: number }[] = []
const radarMap: { [key: string]: number[] } = {}
const radar: { value: number[], name: string }[] = []
const optionRadar = {
    title: {
        text: '按月分类',
        textStyle: {
            fontWeight: 'bolder',
            fontSize: 20
        }
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        data: author,
        orient: 'vertical',
        bottom: '5%',
        left: 'left'
    },
    radar: {
        indicator: cate
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
            name: '月份',
            type: 'radar',
            data: radar
        }
    ]
}

const dataMap: { [key: string]: number } = {}

const initChart = (): void => {
    const chartLine = document.getElementById('line')!
    const myChartLine = echarts.init(chartLine)
    myChartLine.showLoading()

    const chartRadar = document.getElementById('radar')!
    const myChartRadar = echarts.init(chartRadar)
    myChartRadar.showLoading()

    getData().then(() => {
        myChartLine.setOption(optionLine)
        myChartLine.hideLoading()

        myChartRadar.setOption(optionRadar)
        myChartRadar.hideLoading()
    })

}

async function getData(): Promise<void> {
    try {
        const response = await axios.get('/api/getHResult2') //'/end/api/getHResult1'
        state.data = response.data
        const res = state.data
        res.map(item => {
            // 作者
            if (!author.includes(item.author)) {
                author.push(item.author)
            }
            // 年份
            const y = item.tm.slice(0, 4)
            if (!year.includes(y)) {
                year.push(y)
            }
            if (dataMap[y]) {
                dataMap[y] += item.count
            } else {
                dataMap[y] = item.count
            }
            // 月份
            const m = item.tm.slice(-2)
            if (!month.includes(m)) {
                month.push(m)
            }
            const k = item.author + m
            if (dataMap[k]) {
                dataMap[k] += item.count
            } else {
                dataMap[k] = item.count
            }

        })
        year.sort()
        month.sort()
        year.map(y => {
            line.push(dataMap[y])
        })
        month.map(m => {
            cate.push({ name: m, max: 80 })
        })
        for (let i = 0; i < author.length; i++) {
            month.map(m => {
                const key = author[i] + m
                if (radarMap[author[i]]) {
                    radarMap[author[i]].push(dataMap[key] ? dataMap[key] : 0)
                } else {
                    radarMap[author[i]] = dataMap[key] ? [dataMap[key]] : [0]
                }
            })
            radar.push({
                value: radarMap[author[i]],
                name: author[i]
            })
        }
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => initChart())
</script>
