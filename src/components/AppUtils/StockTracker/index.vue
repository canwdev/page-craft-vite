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
  StockTrackerSettings,
} from './types'
import RectSwitch from '@/components/CanUI/packages/OptionUI/Tools/RectSwitch.vue'
import {useStorage} from '@vueuse/core'
import {LS_SettingsKey} from '@/enum/settings'
import {AutoFormItemType, MixedFormItems} from '@/components/CanUI/packages/AutoFormElPlus/enum'
import AutoFormElPlus from '@/components/CanUI/packages/AutoFormElPlus/index.vue'
import {guid} from '@/utils'

const stockTrackerSettings = useStorage<StockTrackerSettings>(
  LS_SettingsKey.STOCK_TRACKER_SETTINGS,
  {
    transactionHistory: [],
  },
)
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
onMounted(() => {
  // importData()
})

enum StockTrackerTab {
  HISTORY = 'history',
  STATISTICS = 'statistics',
}

const tabOptions = ref([
  {label: '交易记录', value: StockTrackerTab.HISTORY},
  {label: '统计', value: StockTrackerTab.STATISTICS},
])
const curTab = ref(StockTrackerTab.HISTORY)

const handleImport = async () => {
  await window.$dialog.confirm('将覆盖当前记录，继续导入？', '确认', {
    type: 'warning',
  })
  stockTrackerSettings.value = await window.$mcUtils.handleImportJson()
  window.$message.success('导入成功！')
}
const handleExport = async () => {
  window.$mcUtils.handleExportFile(
    await window.$mcUtils.promptGetFileName(null, 'StockTracker'),
    JSON.stringify(stockTrackerSettings.value, null, 2),
    '.json',
  )
}

const isShowEditDialog = ref(false)
const isCreate = ref(false)

const stockSymbolOptions = computed(() => {
  const nameMap = new Map<string, string>()
  stockTrackerSettings.value.transactionHistory.forEach((item) => {
    nameMap.set(item.symbol, item.symbolName)
  })

  return Array.from(nameMap.keys()).map((key) => {
    return {value: key, label: nameMap.get(key) || ''}
  })
})

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

const isUpdating = ref(false)
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
  <div class="stock-tracker vp-bg">
    <div class="action-row">
      <div class="flex-row-center-gap">
        <button class="vp-button primary" @click="createItem">添加交易记录</button>
      </div>
      <RectSwitch v-model="curTab" :options="tabOptions" />
      <div class="flex-row-center-gap">
        <button class="vp-button" @click="handleImport">导入数据</button>
        <button class="vp-button" @click="handleExport">导出数据</button>
      </div>
    </div>

    <div class="content-wrapper">
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
}
</style>
