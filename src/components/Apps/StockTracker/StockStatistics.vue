<script setup lang="ts">
import AutoTableElPlus from '@/components/CanUI/packages/AutoTableElPlus/index.vue'
import {AutoTableColumn} from '@/components/CanUI/packages/AutoTableElPlus/types'
import {EntrustSide, IStockPrices, IStockTrackerPrices, ITransactionHistory} from './types'
import {getPriceClassName, getPriceWithSymbol} from './utils'
import {useResizeObserver} from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    historyList: ITransactionHistory[]
    stockPrices: IStockTrackerPrices
  }>(),
  {},
)
const emit = defineEmits([])
const {historyList, stockPrices} = toRefs(props)

interface IStockLatestPriceBySymbol {
  [symbol: string]: IStockPrices
}

const stockLatestPriceBySymbol = computed((): IStockLatestPriceBySymbol => {
  if (!stockPrices.value) {
    return {}
  }
  const obj: IStockLatestPriceBySymbol = {}

  Object.keys(stockPrices.value).forEach((symbol: string) => {
    const dataByDay = stockPrices.value[symbol].byDay
    if (dataByDay) {
      const dates = Object.keys(dataByDay)
      const day = dates[0]
      obj[symbol] = {
        ...dataByDay[day],
        day,
      }
    }
  })
  console.table(obj)
  return obj
})

interface IStatisticsTableItem {
  symbol: string
  symbolName: string
  historyProfit: number
  curHold: number
  curQty: number
  holdAvgPrice: number
  currency: string
  latestPrice: number
  latestPrice_x_Qty: number
  holdProfit: number
  holdProfitPercent: number
}

const tableData = ref<IStatisticsTableItem[]>([])

const tableColumns: AutoTableColumn[] = [
  {
    key: 'symbol',
    label: '股票名称/代码',
    minWidth: 120,
    props: {
      sortable: true,
      showOverflowTooltip: true,
    },
    formatter({row}) {
      return `<div>
<div class="text-overflow">
<b>${row.symbolName}</b>
</div>
<div>${row.symbol}</div>
</div>`
    },
  },

  {
    key: 'historyProfit',
    label: '历史收益',
    props: {
      sortable: true,
    },
    formatter({row}) {
      return `<span class="${getPriceClassName(row.historyProfit)}">${getPriceWithSymbol({
        price: row.historyProfit,
        currency: row.currency,
        showCurrencyCode: false,
      })}</span>`
    },
  },
  {
    key: 'curHold',
    label: '市值(行情)/数量',
    minWidth: 80,
    props: {
      sortable: true,
    },
    formatter({row}) {
      return `<div>
<div>
<b>${getPriceWithSymbol({
        price: row.latestPrice_x_Qty,
        currency: row.currency,
        showCurrencyCode: false,
      })}</b>
</div>
<div>${row.curQty}</div>
</div>`
    },
  },
  {
    key: 'latestPrice',
    label: '现价(行情)/成本',
    props: {
      sortable: true,
    },
    formatter({row}) {
      return `<div>
<div>
<b>${getPriceWithSymbol({
        price: row.latestPrice,
        currency: row.currency,
        showCurrencyCode: false,
      })}</b>
</div>
<div>${getPriceWithSymbol({
        price: row.holdAvgPrice,
        currency: row.currency,
        showCurrencyCode: false,
      })}</div>
</div>`
    },
  },
  {
    key: 'holdProfit',
    label: '持仓盈亏',
    props: {
      sortable: true,
    },
    formatter({row}) {
      return `<div class="${getPriceClassName(row.holdProfit)}">
<div >
<b>${row.holdProfit > 0 ? '+' : ''}${getPriceWithSymbol({
        price: row.holdProfit,
        currency: row.currency,
        showCurrencyCode: false,
      })}</b>
</div>
<div>
${row.holdProfitPercent > 0 ? '+' : ''}${parseFloat((row.holdProfitPercent * 100).toFixed(2))}%
</div>
</div>`
    },
  },
]

const doCalculate = async () => {
  type IStockStatistics = {
    currency: string
    symbolName: string
    // 总收益
    historyProfit: number
    // 买入队列(FIFO)，每个item的 quantity 始终为1
    buyList: Array<{
      price: number
      createTimestamp: number
    }>
  }
  const symbolMap: {[key: string]: IStockStatistics} = {}

  historyList.value
    .sort((a, b) => {
      return a.createTimestamp - b.createTimestamp
    })
    .forEach((stock) => {
      const {
        symbol,
        symbolName,
        entrustSide,
        // entrustPrice: businessAvgPrice,
        businessAvgPrice,
        businessQty,
        createTimestamp,
        currency,
      } = stock

      if (!symbolMap[symbol]) {
        // 初始化数据
        symbolMap[symbol] = {
          currency,
          symbolName,
          historyProfit: 0,
          buyList: [],
        }
      }

      let {historyProfit, buyList} = symbolMap[symbol]

      // console.log(symbolName, symbol, businessQty, businessAvgPrice)
      if (EntrustSide.BUY === entrustSide) {
        // 买入
        for (let i = 0; i < businessQty; i++) {
          buyList.push({
            price: businessAvgPrice,
            createTimestamp,
          })
        }
      } else if (EntrustSide.SALE === entrustSide) {
        // 卖出: 按照先进先出（FIFO）的方法计算每次卖出操作的利润
        let currentEarn = 0
        for (let i = 0; i < businessQty; i++) {
          // 获取收益并累加
          const firstBuyPrice = buyList[0].price
          currentEarn = currentEarn + (businessAvgPrice - firstBuyPrice)
          // console.warn(`calc: ${symbol}`, {currentEarn, businessAvgPrice, firstBuyPrice})
          // 删除之前的买入（出）
          buyList.shift()
        }

        currentEarn = parseFloat(currentEarn.toFixed(2))
        historyProfit += currentEarn
      }
      historyProfit = parseFloat(historyProfit.toFixed(2))

      // 更新数据对象
      symbolMap[symbol].historyProfit = historyProfit

      // console.log(symbol, symbolMap[symbol])
    })

  const resultTable = Object.keys(symbolMap).map((key) => {
    const item = symbolMap[key]
    const curHold = item.buyList.reduce((acc, cur) => {
      return acc + cur.price
    }, 0)
    const curQty = item.buyList.length

    const holdAvgPrice = curQty === 0 ? 0 : parseFloat((curHold / curQty).toFixed(2))
    const latestPrice = parseFloat(stockLatestPriceBySymbol.value[key]?.close)
    const latestPrice_x_Qty = latestPrice * curQty
    const holdProfit = holdAvgPrice === 0 ? 0 : latestPrice_x_Qty - curHold
    const holdProfitPercent = holdAvgPrice === 0 || holdProfit === 0 ? 0 : holdProfit / curHold

    return {
      symbol: key,
      symbolName: item.symbolName,
      historyProfit: item.historyProfit,
      curHold,
      curQty,
      holdAvgPrice,
      currency: item.currency,
      latestPrice_x_Qty,
      latestPrice,
      holdProfit,
      holdProfitPercent,
    }
  })
  console.table(resultTable)
  tableData.value = resultTable.reverse()
}
watch(historyList, () => {
  doCalculate()
})
watch(stockPrices, () => {
  doCalculate()
})
onMounted(() => {
  doCalculate()
})

const rootRef = ref()
const maxHeight = ref(300)
useResizeObserver(rootRef, (entries) => {
  const entry = entries[0]
  const {width, height} = entry.contentRect
  maxHeight.value = height
})

const historyProfit = computed(() => {
  return tableData.value.reduce((acc, cur) => {
    return acc + cur.historyProfit
  }, 0)
})

const totalHold = computed(() => {
  return tableData.value.reduce((acc, cur) => {
    return acc + cur.curHold
  }, 0)
})

const totalHoldProfit = computed(() => {
  return tableData.value.reduce((acc, cur) => {
    return acc + cur.holdProfit
  }, 0)
})

const totalProfit = computed(() => {
  return totalHoldProfit.value + historyProfit.value
})
</script>

<template>
  <div class="stock-statistics-wrapper">
    <div ref="rootRef" class="stock-statistics">
      <AutoTableElPlus :data="tableData" :columns="tableColumns" :height="maxHeight" />
    </div>
    <div class="st-row flex-row-center-gap">
      <span>
        历史收益:
        <span :class="[getPriceClassName(historyProfit)]">
          {{
            getPriceWithSymbol({
              price: historyProfit,
              currency: tableData[0]?.currency,
              showCurrencyCode: false,
            })
          }}
        </span>
      </span>

      <span>
        总持有:
        <span>
          {{
            getPriceWithSymbol({
              price: totalHold,
              currency: tableData[0]?.currency,
              showCurrencyCode: false,
            })
          }}
        </span>
      </span>

      <span>
        持有收益:
        <span :class="[getPriceClassName(totalHoldProfit)]">
          {{ totalHoldProfit > 0 ? '+' : ''
          }}{{
            getPriceWithSymbol({
              price: totalHoldProfit,
              currency: tableData[0]?.currency,
              showCurrencyCode: false,
            })
          }}
        </span>
      </span>

      <span>
        累计收益:
        <span :class="[getPriceClassName(totalProfit)]">
          {{ totalHoldProfit > 0 ? '+' : ''
          }}{{
            getPriceWithSymbol({
              price: totalProfit,
              currency: tableData[0]?.currency,
              showCurrencyCode: false,
            })
          }}
        </span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stock-statistics-wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;

  .st-row {
    padding: 4px 8px;
    gap: 16px;
  }

  .stock-statistics {
    flex: 1;
    overflow: hidden;
  }
}
</style>
