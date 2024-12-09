<script lang="ts" setup>
import {useStorage} from '@vueuse/core'
import {LS_SettingsKey} from '@/enum/settings'
import {
  convertMonthsToYearsAndMonths,
  numberToChineseMoney,
  numberWithCommas,
  formatLabel,
} from '@/components/AppUtils/StockTracker/utils'
import * as echarts from 'echarts'
import moment from 'moment/moment'

interface IFireCalcFormData {
  // 当前资产
  currentValue: number
  // 每月存入款
  monthlySave: number
  // 是否为目标存款模式
  isTargetMode: boolean
  // 迭代月数
  iterationMonths: number
  // 目标存款
  targetValue: number
  // 年化利率
  annualInterestRate: number
  // 年终奖
  yearEndAwards: number
  // 年龄
  age: number
}

const formData = useStorage<IFireCalcFormData>(LS_SettingsKey.FIRE_CALC_FORM_DATA, {
  currentValue: 0,
  monthlySave: 3000,
  isTargetMode: false,
  iterationMonths: 12,
  targetValue: 1000000,
  annualInterestRate: 0.025,
  yearEndAwards: 0,
  age: 0,
})

const formItems = computed(() => {
  return [
    {label: '当前资产', key: 'currentValue', type: 'number'},
    {label: '月存入', key: 'monthlySave', type: 'number'},
    {label: '是否为目标存款模式', key: 'isTargetMode', type: 'checkbox'},
    formData.value.isTargetMode
      ? {label: '目标资产', key: 'targetValue', type: 'number'}
      : {label: '迭代月数', key: 'iterationMonths', type: 'number'},
    {label: '年利率', key: 'annualInterestRate', type: 'number'},
    {label: '年终奖', key: 'yearEndAwards', type: 'number'},
    {label: '年龄(选填)', key: 'age', type: 'number'},
  ].filter(Boolean)
})

interface IStepData {
  label: string
  value: number
  monthCount: string
  age: number
}
const stepData = ref<IStepData[]>([])

const resultValue = computed(() => {
  let result = formData.value.currentValue
  let age = formData.value.age
  stepData.value = []
  stepData.value.push({
    label: moment().format('YYYY-MM-DD'),
    value: result,
    monthCount: 0,
    age: formData.value.age,
  })

  let iterationMonths = formData.value.iterationMonths
  if (formData.value.isTargetMode) {
    // iterationMonths = (formData.value.targetValue - formData.value.currentValue) / formData.value.monthlySave
    iterationMonths = +Infinity // 使用真实计算模式
  }
  for (let i = 0; i < iterationMonths; i++) {
    const count = i + 1

    // 防止死循环
    if (count > 1200) {
      break
    }

    const dateMoment = moment().add(count, 'months')
    // 年底更新一次利息
    const isDecember = dateMoment.month() === 11 // 判断月份是否为12月，月份从0开始计数
    if (isDecember) {
      age += 1

      // 计算年利率
      result += Math.abs(result) * formData.value.annualInterestRate || 0
      if (formData.value.yearEndAwards) {
        result += formData.value.yearEndAwards
      }
    }
    result += formData.value.monthlySave || 0
    stepData.value.push({
      label: `${dateMoment.format('YYYY-MM-DD')}`,
      value: result,
      dateMoment,
      isDecember,
      monthCount: count,
      age,
    })

    if (formData.value.isTargetMode && result >= formData.value.targetValue) {
      break
    }
  }
  return result
})
watch(resultValue, () => {
  updateChart()
})

const getPassiveIncome = (value) => {
  const piYearly = value * formData.value.annualInterestRate
  const piMonthly = piYearly / 12
  const piDaily = piMonthly / 30

  return {
    piYearly,
    piMonthly,
    piDaily,
  }
}

const resultItems = computed(() => {
  const result = resultValue.value
  const resultMonths = stepData.value.length - 1
  const increasedValue = result - formData.value.currentValue
  const increasedPercent = ((increasedValue / result) * 100).toFixed(2) + '%'
  const resultAge = stepData.value[stepData.value.length - 1]?.age

  const {piYearly, piMonthly, piDaily} = getPassiveIncome(result)

  return [
    {
      label: '结果资产',
      key: 'resultValue',
      value: `${numberWithCommas(result?.toFixed(2))} | ${numberToChineseMoney(result)}`,
      type: 'text',
    },
    {
      label: '结果时间',
      key: 'resultTimes',
      value: `${resultMonths}个月 = ${convertMonthsToYearsAndMonths(resultMonths)} | ${stepData.value[stepData.value.length - 1]?.label}`,
      type: 'text',
    },
    {
      label: '被动收入',
      key: 'yearPassiveIncome',
      value: `年收 ${piYearly.toFixed(2)} | 月收 ${piMonthly.toFixed(2)} | 日收 ${piDaily.toFixed(2)}`,
      type: 'text',
    },
    {label: '增长值', key: 'increasedValue', value: increasedValue.toFixed(2), type: 'number'},
    {label: '增长百分比', key: 'increasedPercent', value: increasedPercent, type: 'text'},
    {label: '年龄', key: 'resultAge', value: resultAge, type: 'text'},
  ].filter(Boolean)
})

function handleResize() {
  if (echartsInstance.value) {
    echartsInstance.value.resize()
  }
}

onMounted(() => {
  initCharts()
  updateChart()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  echartsInstance.value && echartsInstance.value.dispose()
  window.removeEventListener('resize', handleResize)
})

const echartsInstance = shallowRef()
const initCharts = () => {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('mainChart'))
  // 绘制图表
  myChart.setOption({
    title: {
      text: '预测图表',
    },
    legend: {},
    tooltip: {
      trigger: 'axis',
      // valueFormatter: (value) => {
      //   return value.toFixed(2)
      // },
      formatter(params) {
        const [p1] = params
        const d1 = p1 && stepData.value[p1.dataIndex]

        const {piYearly, piMonthly, piDaily} = getPassiveIncome(d1.value)

        return `<div style="font-family: monospace">
${p1.marker}
<div>日期：${d1.label} (${convertMonthsToYearsAndMonths(d1.monthCount)}) | ${d1.monthCount || 0}个月</div>
<div>资产：${numberWithCommas(d1.value.toFixed(2))}</div>
<div>资产：${numberToChineseMoney(d1.value)}</div>
<div>被动收入：年收 ${piYearly.toFixed(2)} | 月收 ${piMonthly.toFixed(2)} | 日收 ${piDaily.toFixed(2)}</div>
<div>年龄：${d1.age}</div>
</div>`
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: 'rgba(133,133,133,0.8)',
        },
      },
    },
    grid: {
      top: '10%',
      left: '1%',
      right: '2.5%',
      bottom: 0,
      containLabel: true,
    },
    xAxis: {
      // name: 'Months',
      type: 'category',
      boundaryGap: false,
      data: [], // x轴数据
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    yAxis: {
      // name: 'Value',
      type: 'value',
      minInterval: 1,
      axisPointer: {
        snap: true,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
        },
      },
    },
    series: [
      {
        type: 'line',
        symbol: 'circle',
        symbolSize: 5,
        name: 'Value',
        itemStyle: {
          color: '#FF9800',
        },
        smooth: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(255,152,0,0.4)',
            },
            {
              offset: 1,
              color: 'rgba(255,255,255,0)',
            },
          ]),
        },
        data: [],
      },
    ],
  })

  echartsInstance.value = myChart
}

const updateChart = () => {
  // 刷新 Echarts 数据
  const list = stepData.value || []
  echartsInstance.value.setOption({
    xAxis: {
      data: list.map((i) => i.label),
    },
    series: [
      {
        data: list.map((i) => i.value),
        markPoint: {
          data: [
            {
              type: 'max',
            },
            {
              type: 'min',
            },
          ],
        },
      },
    ],
  })
}
</script>

<template>
  <div class="fire-calc-wrapper vp-bg">
    <div class="vp-panel">
      <div class="group-grid">
        <label :for="item.key" :key="item.key" v-for="item in formItems">
          {{ item.label || formatLabel(item.key) }}: <br v-if="item.type === 'checkbox'" />
          <input class="vp-input" :id="item.key" :type="item.type" v-model="formData[item.key]" />
        </label>
      </div>
      <div class="group-grid group-grid--v2">
        <div :key="item.key" v-for="item in resultItems">
          {{ item.label || formatLabel(item.key) }}:
          <b>
            {{ item.value }}
          </b>
        </div>
      </div>
    </div>

    <div class="vp-panel">
      <div class="chart-area" id="mainChart"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fire-calc-wrapper {
  height: 100%;
  overflow: auto;
  padding: 10px;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }

  .vp-panel {
    padding: 10px;
    & + .vp-panel {
      margin-top: 10px;
    }
  }

  .group-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    grid-gap: 10px;
  }

  @media screen and (max-width: 400px) {
    .group-grid {
      grid-template-columns: 1fr !important;
    }
  }
  .group-grid--v2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    grid-gap: 10px;
  }

  .group-grid + .group-grid {
    margin-top: 10px;
    border-top: 1px dashed gray;
    padding-top: 10px;
  }

  label {
    display: block;
    width: 100%;
    color: gray;
    font-size: 14px;
  }

  .chart-area {
    width: 100%;
    height: 500px;
  }
}
</style>
