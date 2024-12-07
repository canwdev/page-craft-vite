<script setup lang="ts">
import TabLayout from '@/components/CanUI/packages/Layouts/TabLayout.vue'
import StockStatistics from './StockStatistics.vue'
import TransactionHistory from './TransactionHistory.vue'
import {
  currencyOptions,
  entrustSideOptions,
  formatTransactionHistory,
  getTransactionHistoryFormRules,
  ITransactionHistory,
  IStockTrackerPrices,
  IStockTrackerSettings,
} from './types'
import RectSwitch from '@/components/CanUI/packages/OptionUI/Tools/RectSwitch.vue'
import {useStorage} from '@vueuse/core'
import {LS_SettingsKey} from '@/enum/settings'
import {AutoFormItemType, MixedFormItems} from '@/components/CanUI/packages/AutoFormElPlus/enum'
import AutoFormElPlus from '@/components/CanUI/packages/AutoFormElPlus/index.vue'
import {guid} from '@/utils'
import {fetchPrices} from '@/components/AppUtils/StockTracker/utils/prices'
import StockPrices from '@/components/AppUtils/StockTracker/StockPrices.vue'
import DropdownMenu from '@/components/CanUI/packages/OptionUI/Tools/DropdownMenu.vue'

const stockTrackerPrices = useStorage<IStockTrackerPrices>(LS_SettingsKey.STOCK_TRACKER_PRICES, {
  bySymbol: {},
})
const stockTrackerSettings = useStorage<IStockTrackerSettings>(
  LS_SettingsKey.STOCK_TRACKER_SETTINGS,
  {
    transactionHistory: [],
  },
)

// 交易记录中的股票代码和名称
const stockSymbolOptions = computed(() => {
  const nameMap = new Map<string, string>()
  stockTrackerSettings.value.transactionHistory.forEach((item) => {
    nameMap.set(item.symbol, item.symbolName)
  })

  return Array.from(nameMap.keys()).map((key) => {
    return {value: key, label: nameMap.get(key) || ''}
  })
})

const importData = async () => {
  let {
    data: {list},
  } = await fetch('http://127.0.0.1:8080/stock.json').then((res) => res.json())
  console.log(list)
  stockTrackerSettings.value.transactionHistory = list.reverse().map((item) => {
    const arr = `${item.createDate}`.split('')
    arr.splice(4, 0, '-')
    arr.splice(7, 0, '-')
    const dateStr = `${arr.join('')} ${item.createTime}`

    return {
      id: guid(),
      symbol: item.symbol,
      symbolName: item.symbolName,
      businessAvgPrice: item.businessAvgPrice,
      businessQty: item.businessQty,
      currency: item.currency,
      entrustSide: item.entrustSide,
      tip: item.tip || 0,
      remark: item.remark,
      createTimestamp: new Date(dateStr).getTime(),
    } as ITransactionHistory
  })
}

const isUpdating = ref(false)
const updatePrices = async () => {
  try {
    isUpdating.value = true

    const {bySymbol} = stockTrackerPrices.value

    for (let i = 0; i < stockSymbolOptions.value.length; i++) {
      const symbol = stockSymbolOptions.value[i].value
      if (!symbol) {
        continue
      }
      const data = await fetchPrices({
        symbol: symbol,
      })

      if (bySymbol[symbol]) {
        bySymbol[symbol] = {
          ...bySymbol[symbol],
          ...data,
        }
      } else {
        bySymbol[symbol] = data
      }
    }

    window.$message.success('更新行情成功！')
    stockTrackerPrices.value.bySymbol = bySymbol
    console.log(stockTrackerPrices.value)
  } catch (error: any) {
    console.error(error)

    window.$dialog.alert(error.message, '更新行情失败', {
      type: 'error',
    })
  } finally {
    isUpdating.value = false
  }
}

const confirmUpdatePrices = async () => {
  await window.$dialog.confirm('免费接口每日调用次数有限，请勿频繁更新，是否继续？', '确认', {
    type: 'warning',
  })
  updatePrices()
}

onMounted(() => {
  // importData()
  // updatePrices()
})

enum StockTrackerTab {
  PRICES = 'prices',
  HISTORY = 'history',
  STATISTICS = 'statistics',
}

const tabOptions = ref([
  {label: '行情', value: StockTrackerTab.PRICES},
  {label: '交易记录', value: StockTrackerTab.HISTORY},
  {label: '统计', value: StockTrackerTab.STATISTICS},
])
const curTab = useStorage('stock_tracker_tab', StockTrackerTab.HISTORY)

const exportImportOptions = ref([
  {
    label: '导入交易数据',
    iconClass: 'mdi mdi-import',
    props: {
      async onClick() {
        await window.$dialog.confirm('将覆盖当前记录，继续导入？', '导入交易数据', {
          type: 'warning',
        })
        stockTrackerSettings.value = await window.$mcUtils.handleImportJson()
        window.$message.success('导入成功！')
      },
    },
  },
  {
    label: '导出交易数据',
    iconClass: 'mdi mdi-export',
    props: {
      async onClick() {
        window.$mcUtils.handleExportFile(
          await window.$mcUtils.promptGetFileName(null, 'StockTradeHistory'),
          JSON.stringify(stockTrackerSettings.value, null, 2),
          '.json',
        )
      },
    },
  },
  {split: true},
  {
    label: '导入行情数据',
    iconClass: 'mdi mdi-import',
    props: {
      async onClick() {
        await window.$dialog.confirm('将覆盖当前记录，继续导入？', '导入行情数据', {
          type: 'warning',
        })
        stockTrackerPrices.value = await window.$mcUtils.handleImportJson()
        window.$message.success('导入成功！')
      },
    },
  },
  {
    label: '导出行情数据',
    iconClass: 'mdi mdi-export',
    props: {
      async onClick() {
        window.$mcUtils.handleExportFile(
          await window.$mcUtils.promptGetFileName(null, 'StockPrices'),
          JSON.stringify(stockTrackerPrices.value, null, 2),
          '.json',
        )
      },
    },
  },
])

const isShowEditDialog = ref(false)
const isCreate = ref(false)

const dataForm = ref<ITransactionHistory>(formatTransactionHistory())
const formRules = getTransactionHistoryFormRules()
const formItems = computed((): MixedFormItems[] => {
  return [
    [
      {
        type: AutoFormItemType.INPUT_AUTOCOMPLETE,
        key: 'symbol',
        label: `股票代码`,
        props: {
          clearable: true,
          fetchSuggestions: (queryString: string, cb: any) => {
            const results = queryString
              ? stockSymbolOptions.value.filter((item) => {
                  return item.value.toLowerCase().includes(queryString.toLowerCase())
                })
              : stockSymbolOptions.value
            cb(results)
          },
          onSelect() {
            // console.log(dataForm.value.symbol)
            const find = stockSymbolOptions.value.find((i) => i.value === dataForm.value.symbol)
            if (find) {
              dataForm.value.symbolName = find.label
            }
          },
        },
      },
      {
        type: AutoFormItemType.INPUT_AUTOCOMPLETE,
        key: 'symbolName',
        label: `股票名称`,
        props: {
          clearable: true,
          fetchSuggestions: (queryString: string, cb: any) => {
            const results = queryString
              ? stockSymbolOptions.value.filter((item) => {
                  return (
                    item.value.toLowerCase().includes(queryString.toLowerCase()) ||
                    item.label.toLowerCase().includes(queryString.toLowerCase())
                  )
                })
              : stockSymbolOptions.value
            cb(results.map((i) => ({value: i.label})))
          },
          onSelect() {
            // console.log(dataForm.value.symbol)
            const find = stockSymbolOptions.value.find((i) => i.label === dataForm.value.symbolName)
            if (find) {
              dataForm.value.symbol = find.value
            }
          },
        },
      },
    ],
    [
      {
        type: AutoFormItemType.INPUT_NUMBER,
        key: 'businessAvgPrice',
        label: `成交平均价格`,
        props: {
          controls: true,
          controlsPosition: 'right',
          min: 0,
        },
      },
      {
        type: AutoFormItemType.INPUT_NUMBER,
        key: 'businessQty',
        label: `成交数量`,
        props: {
          controls: true,
          controlsPosition: 'right',
          min: 0,
        },
      },
    ],
    [
      {
        type: AutoFormItemType.SELECT,
        key: 'entrustSide',
        label: `委托方向`,
        options: entrustSideOptions,
      },
      {
        type: AutoFormItemType.SELECT,
        key: 'currency',
        label: `货币类型`,
        options: currencyOptions,
        disabled: true,
        props: {
          filterable: true,
        },
      },
    ],
    [
      {
        type: AutoFormItemType.INPUT_NUMBER,
        key: 'tip',
        label: `佣金`,
        props: {
          controls: true,
          controlsPosition: 'right',
          min: 0,
        },
      },
      {
        type: AutoFormItemType.DATE_PICKER,
        key: 'createTimestamp',
        label: `创建时间`,
        props: {
          type: 'datetime',
          placeholder: '抢名额开始时间',
          // 毫秒级时间戳
          valueFormat: 'x',
        },
      },
    ],
    {
      type: AutoFormItemType.INPUT,
      key: 'remark',
      label: `备注`,
      props: {
        type: 'textarea',
      },
    },
  ]
})

const handleCreateEdit = async (item: ITransactionHistory) => {
  try {
    isUpdating.value = true

    item = JSON.parse(JSON.stringify(item))

    if (isCreate.value) {
      item.id = guid()
      stockTrackerSettings.value.transactionHistory.push(item)

      window.$message.success('创建成功！')
    } else {
      const idx = stockTrackerSettings.value.transactionHistory.findIndex((i) => item.id === i.id)
      stockTrackerSettings.value.transactionHistory.splice(idx, 1, item)
      window.$message.success('更新成功！')
    }
    isShowEditDialog.value = false
  } catch (e) {
    console.error(e)
  } finally {
    isUpdating.value = false
  }
}

const createItem = () => {
  isCreate.value = true
  dataForm.value = formatTransactionHistory()
  isShowEditDialog.value = true
}

const duplicateItem = (item: ITransactionHistory) => {
  isCreate.value = true
  dataForm.value = formatTransactionHistory(item)
  isShowEditDialog.value = true
}

const editItem = (item: ITransactionHistory) => {
  isCreate.value = false
  dataForm.value = formatTransactionHistory(item)
  isShowEditDialog.value = true
}

const deleteItem = (item: ITransactionHistory) => {
  const idx = stockTrackerSettings.value.transactionHistory.findIndex((i) => item.id === i.id)
  stockTrackerSettings.value.transactionHistory.splice(idx, 1)
}
</script>

<template>
  <div class="stock-tracker vp-bg scrollbar-mini" v-loading="isUpdating">
    <div class="action-row">
      <div class="flex-row-center-gap">
        <button class="vp-button primary" @click="createItem">添加交易记录</button>
        <button class="vp-button" @click="confirmUpdatePrices">更新日行情</button>
      </div>
      <RectSwitch v-model="curTab" :options="tabOptions" />
      <div class="flex-row-center-gap">
        <DropdownMenu :options="exportImportOptions">
          <button class="vp-button" title="Export">
            <span class="mdi mdi-briefcase-arrow-up-down"></span>
          </button>
        </DropdownMenu>
      </div>
    </div>

    <div class="content-wrapper">
      <StockPrices v-if="curTab === StockTrackerTab.PRICES" :stock-prices="stockTrackerPrices" />
      <TransactionHistory
        v-if="curTab === StockTrackerTab.HISTORY"
        :history-list="stockTrackerSettings.transactionHistory"
        @editItem="editItem"
        @duplicateItem="duplicateItem"
        @deleteItem="deleteItem"
      />
      <StockStatistics
        v-if="curTab === StockTrackerTab.STATISTICS"
        :history-list="stockTrackerSettings.transactionHistory"
        :stock-prices="stockTrackerPrices"
      />
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :title="isCreate ? '添加交易记录' : '编辑交易记录'"
      v-model="isShowEditDialog"
      width="480"
      draggable
    >
      <AutoFormElPlus
        v-if="isShowEditDialog"
        :form-schema="{
          model: dataForm,
          rules: formRules,
          props: {
            labelPosition: 'top',
          },
          formItems,
        }"
        @onSubmit="handleCreateEdit"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.stock-tracker {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .action-row {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 4px;
    border-bottom: 1px solid $color_border;
  }

  .content-wrapper {
    flex: 1;
    overflow: hidden;
  }

  :deep(.price-up) {
    color: #4caf50;
  }
  :deep(.price-down) {
    color: #f44336;
  }
  :deep(.text-overflow) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
