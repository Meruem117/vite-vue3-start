<template>
  <div class="flex flex-col w-full ml-3 px-5">
    <div class="flex flex-row w-full" style="height: 600px;">
      <div id="tree" :style="{ width: '75%', height: '600px' }"></div>
      <div class="w-1/4 h-full">
        <div class="w-full text-xl font-semibold mb-5 ml-3">视频列表</div>
        <div
          class="w-full h-5/6 overflow-auto rounded bg-gray-100 border border-solid border-gray-200 shadow-inner"
        >
          <div
            v-for="video,index in state.list"
            :key="index"
            :title="video.author + ' - ' + video.title + ' - ' + video.bvid"
            @click="toVideo(video.author, video.bvid)"
            class="flex flex-row w-full h-12 pt-3 text-base justify-start cursor-pointer hover:bg-white hover:text-blue-400"
          >
            <div class="w-2/3 h-full truncate pl-2">{{ video.title }}</div>
            <div class="w-1/3 h-full text-right truncate pr-2">{{ convertPlay(video.play) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row w-full">
      <div id="funnel" :style="{ width: '50%', height: '800px' }"></div>
      <div id="scatter" :style="{ width: '50%', height: '800px' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '@/store/store'
import * as echarts from 'echarts/core'
import { TitleComponent, TooltipComponent, ToolboxComponent, LegendComponent } from 'echarts/components'
import { TreemapChart, FunnelChart, ScatterChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { hResultItem4 } from '@/models/chart'
import { logItem } from '@/models/log'
import { getHResult4 } from '@/services/chart'
import { addLog } from '@/services/log'
import { roundFun, convertPlay } from '@/utils'

echarts.use(
  [TitleComponent, TooltipComponent, ToolboxComponent, LegendComponent, TreemapChart, FunnelChart, ScatterChart, CanvasRenderer]
)

interface listItem {
  author: string,
  bvid: string,
  title: string,
  play: number
}
interface stateItem {
  data: hResultItem4[],
  list: listItem[]
}
interface treeDataChildren {
  name: string,
  value: number
}
interface treeData {
  name: string,
  children: treeDataChildren[]
}
interface scatterSeries {
  name: string,
  data: typeof list,
  type: 'scatter',
  symbolSize: (data: number[]) => number,
  emphasis: {
    focus: 'series',
    label: {
      show: true,
      formatter: (param: { data: any[] }) => string,
      position: 'top',
      fontSize: number
    }
  },
  itemStyle: {
    shadowBlur: 10,
    shadowColor: string,
    shadowOffsetY: 5
  }
}

const store = useStore(key)
const router = useRouter()
const state: stateItem = reactive({
  data: [],
  list: []
})

//* tree chart
const cate: string[] = []
const data: treeData[] = []
const optionTree = {
  title: {
    text: '总览',
    textStyle: {
      fontWeight: 'bolder',
      fontSize: 20
    }
  },
  tooltip: {
    trigger: 'item',
    textStyle: {
      fontSize: 18
    },
    formatter: '{b}<br /> 播放量: {c}'
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
  series: [{
    type: 'treemap',
    data: data,
    label: {
      show: true,
      formatter: '{b}'
    },
    upperLabel: {
      show: true,
      height: 30,
      textStyle: {
        fontSize: 17,
        fontWeight: 'bolder'
      },
    },
    itemStyle: {
      borderColor: '#fff'
    },
    levels: [
      {
        itemStyle: {
          borderColor: '#777',
          borderWidth: 0,
          gapWidth: 1
        },
        upperLabel: {
          show: false
        }
      },
      {
        itemStyle: {
          borderColor: '#555',
          borderWidth: 5,
          gapWidth: 1
        },
        emphasis: {
          itemStyle: {
            borderColor: '#ddd'
          }
        }
      },
      {
        colorSaturation: [0.35, 0.5],
        itemStyle: {
          borderWidth: 5,
          gapWidth: 1,
          borderColorSaturation: 0.6
        }
      }
    ]
  }]
}

//* funnel chart
const map: { [key: string]: number } = {}
const funnel: { value: number, name: string }[] = []
const optionFunnel = {
  title: {
    text: '占比',
    textStyle: {
      fontWeight: 'bolder',
      fontSize: 20
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c}"
  },
  toolbox: {
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },
  legend: {
    data: cate,
    orient: 'vertical',
    bottom: '10%',
    left: '5%'
  },
  series: [
    {
      name: 'up主',
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      min: 10000000,
      max: 30000000,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 2,
      label: {
        show: true,
        position: 'inside',
        fontSize: 20,
        fontWeight: 'bold'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      },
      data: funnel
    }
  ]
}

//* scatter chart
const list: [number, number, string, string, string][] = []
const scatterMap: { [ket: string]: typeof list } = {}
const scatter: scatterSeries[] = []
const optionScatter = {
  title: {
    text: '分布',
    textStyle: {
      fontWeight: 'bolder',
      fontSize: 20
    }
  },
  legend: {
    right: '10%',
    top: '3%',
    data: cate
  },
  toolbox: {
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {}
    }
  },
  grid: {
    left: '8%',
    top: '10%'
  },
  xAxis: {
    name: '时间',
    nameTextStyle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black'
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    min: 10000000,
    max: 11000000,
    splitNumber: 6,
    axisLabel: {
      formatter: (value: number, index: number) => {
        const d = new Date(value * 150000)
        const date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate()
        return date
      },
      fontSize: 16
    }
  },
  yAxis: {
    name: '播放量(万)',
    nameTextStyle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'black'
    },
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    scale: true,
    min: 1000,
    max: 2000,
    splitNumber: 5,
    axisLabel: {
      fontSize: 18
    }
  },
  series: scatter
}

const initChart = (): void => {
  const chartTree = document.getElementById('tree')!
  const myChartTree = echarts.init(chartTree)
  myChartTree.showLoading()

  const chartFunnel = document.getElementById('funnel')!
  const myChartFunnel = echarts.init(chartFunnel)
  myChartFunnel.showLoading()

  const chartScatter = document.getElementById('scatter')!
  const myChartScatter = echarts.init(chartScatter)
  myChartScatter.showLoading()

  getData().then(() => {
    myChartTree.setOption(optionTree)
    myChartTree.hideLoading()

    myChartFunnel.setOption(optionFunnel)
    myChartFunnel.hideLoading()

    myChartScatter.setOption(optionScatter)
    myChartScatter.hideLoading()
  })
}

async function getData(): Promise<void> {
  state.data = await getHResult4()
  const res = state.data
  res.map(item => {
    // cate
    if (!cate.includes(item.author)) {
      cate.push(item.author)
    }
    // 各Up破千万播放总量
    if (map[item.author]) {
      map[item.author] += item.play
    } else {
      map[item.author] = item.play
    }
    // list
    list.push([Math.round(Date.parse(item.tm) / 150000), item.play / 10000, item.bvid, item.title, item.author])
  })
  // 排序
  list.sort(function (a, b) {
    return b[0] - a[0]
  })
  state.list.length = 0
  // 赋值
  list.map(item => {
    state.list.push({
      author: item[4],
      bvid: item[2],
      title: item[3],
      play: item[1] * 10000
    })
    if (scatterMap[item[4]]) {
      scatterMap[item[4]].push(item)
    } else {
      scatterMap[item[4]] = [item]
    }
  })
  cate.map(cate => {
    data.push({
      name: cate,
      children: [
        {
          name: '',
          value: 0
        }
      ]
    })
    funnel.push({ value: map[cate], name: cate })
    scatter.push({
      name: cate,
      data: scatterMap[cate],
      type: 'scatter',
      symbolSize: function (data: number[]) {
        return data[0] / 600000;
      },
      emphasis: {
        focus: 'series',
        label: {
          show: true,
          formatter: function (param: { data: any }) {
            const d = new Date(param.data[0] * 150000)
            const date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate()
            return param.data[3] + ' (' + param.data[2] + ')' + '\n\n' + date + '  ' + roundFun(param.data[1], 1) + '万'
          },
          position: 'top',
          fontSize: 16
        }
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(25, 100, 150, 0.5)',
        shadowOffsetY: 5
      }
    })
  })
  for (let i in res) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].name === res[i].author) {
        data[j].children.push({
          name: res[i].bvid,
          value: res[i].play
        })
      }
    }
  }
}

function toVideo(author: string, bvid: string): void {
  const location = store.state.user.location!
  const log: logItem = {
    author,
    bvid,
    location: location ? location : '暂无'
  }
  addLog(log)
  let url = router.resolve({
    name: 'video',
    params: { bvid: bvid }
  })
  window.open(url.href, '_blank')
}

onMounted(() => initChart())
</script>
