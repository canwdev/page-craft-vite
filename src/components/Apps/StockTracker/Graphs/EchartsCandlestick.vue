<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import * as echarts from 'echarts'

import {IPriceByDay} from '@/components/Apps/StockTracker/types'

// 定义 props
const props = defineProps<{
  byDay: IPriceByDay
  title: string
}>()
const {title} = toRefs(props)
// 创建 ref
const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: echarts.ECharts | null = null

// 处理数据转换
const processChartData = () => {
  // 按日期排序并处理数据
  const sortedDays = Object.keys(props.byDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  )

  const candleData = sortedDays.map((day) => {
    const item = props.byDay[day]
    return [
      parseFloat(item.open),
      parseFloat(item.close),
      parseFloat(item.low),
      parseFloat(item.high),
    ]
  })

  const volumeData = sortedDays.map((day) => {
    const item = props.byDay[day]
    return parseFloat(item.volume)
  })

  return {
    dates: sortedDays,
    candleData,
    volumeData,
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  // 销毁已存在的实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value)

  const {dates, candleData, volumeData} = processChartData()

  const option = {
    title: [
      {
        text: props.title,
        left: 'center',
        top: 10,
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: [
      {
        left: '10%',
        right: '8%',
        height: '60%',
      },
      {
        left: '10%',
        right: '8%',
        bottom: '10%',
        height: '20%',
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: dates,
        scale: true,
        boundaryGap: false,
        axisLine: {onZero: false},
        splitLine: {show: false},
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax',
      },
      {
        type: 'category',
        gridIndex: 1,
        data: dates,
        scale: true,
        boundaryGap: false,
        axisLine: {onZero: false},
        axisTick: {show: false},
        splitLine: {show: false},
        axisLabel: {show: false},
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
        },
      },
      {
        gridIndex: 1,
        splitNumber: 2,
        scale: true,
        axisLabel: {show: true},
        axisLine: {show: false},
        axisTick: {show: false},
        splitLine: {show: false},
      },
    ],
    series: [
      {
        name: 'K线',
        type: 'candlestick',
        data: candleData,
        itemStyle: {
          color: '#4caf50',
          color0: '#f44336',
          borderColor: '#4caf50',
          borderColor0: '#f44336',
        },
      },
      {
        name: '成交量',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: volumeData,
        itemStyle: {
          // color: '#7fbe9e',
        },
      },
    ],
  }

  chartInstance.setOption(option)
}

// 组件挂载时初始化
onMounted(() => {
  initChart()
})

watch(title, () => {
  initChart()
})

// 组件卸载时销毁
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
})

// // 可选：添加响应式处理
// const handleResize = () => {
//   if (chartInstance) {
//     chartInstance.resize()
//   }
// }
//
// // 监听窗口变化
// onMounted(() => {
//   window.addEventListener('resize', handleResize)
// })
//
// onUnmounted(() => {
//   window.removeEventListener('resize', handleResize)
// })
</script>

<template>
  <div ref="chartRef" class="chart-container" style="width: 100%; height: 500px"></div>
</template>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  height: 500px;
}
</style>
