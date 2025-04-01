<script setup lang="ts">
import AutoTableElPlus from '@canwdev/vgo-ui/src/components/AutoTableElPlus/index.vue'
import {AutoTableColumn} from '@canwdev/vgo-ui/src/components/AutoTableElPlus/types'
import {
  currencyOptions,
  EntrustSide,
  entrustSideOptions,
  formatTransactionHistory,
  getTransactionHistoryFormRules,
  ITransactionHistory,
} from './types'
import {useResizeObserver} from '@vueuse/core'
import {formatDate, guid} from '@/utils'
import {getPriceWithSymbol} from '@/components/Apps/StockTracker/utils'
import {renderDropdownMenu} from '@canwdev/vgo-ui/src/components/OptionUI/Tools/renders'
import AutoFormElPlus from '@canwdev/vgo-ui/src/components/AutoFormElPlus/index.vue'
import {
  AutoFormItemType,
  IOptionItem,
  MixedFormItems,
} from '@canwdev/vgo-ui/src/components/AutoFormElPlus/enum'

const props = withDefaults(
  defineProps<{
    historyList: ITransactionHistory[]
    stockSymbolOptions: IOptionItem[]
    isUpdating: boolean
  }>(),
  {},
)
const emit = defineEmits(['editItem', 'duplicateItem', 'deleteItem'])
const {historyList, stockSymbolOptions, isUpdating} = toRefs(props)

const filterData = ref({
  filterName: '',
})

const filteredList = ref<ITransactionHistory[]>([])
const updateFilteredList = () => {
  const {filterName} = filterData.value
  if (!filterName) {
    filteredList.value = historyList.value
    return
  }
  filteredList.value = historyList.value.filter((item) => {
    const name = (filterName || '').toLowerCase()
    return (
      (item.symbol || '').toLowerCase().includes(name) ||
      (item.symbolName || '').toLowerCase().includes(name)
    )
  })
}

watch(
  historyList,
  (val) => {
    updateFilteredList()
  },
  {immediate: true},
)

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
    key: 'entrustSide',
    label: '委托方向',
    props: {
      sortable: true,
    },
    formatter({row}) {
      return `<span class="${row.entrustSide === EntrustSide.BUY ? 'price-up' : 'price-down'}">${row.entrustSide === EntrustSide.BUY ? '买入' : '卖出'}</span>`
    },
  },
  {
    key: 'businessAvgPrice',
    label: '成交均价',
    props: {
      sortable: true,
    },
    formatter({row}) {
      return getPriceWithSymbol({
        price: row.businessAvgPrice,
        currency: row.currency,
        showCurrencyCode: false,
      })
    },
  },
  {
    key: 'businessQty',
    label: '成交数量',
    props: {
      sortable: true,
    },
  },
  {
    key: 'currency',
    label: '货币类型',
    props: {
      sortable: true,
    },
  },
  {
    key: 'tip',
    label: '佣金',
    props: {
      sortable: true,
    },
    formatter({row}) {
      return getPriceWithSymbol({
        price: row.tip,
        currency: row.currency,
        showCurrencyCode: false,
      })
    },
  },
  {
    key: 'createTimestamp',
    label: '创建时间',
    width: 180,
    fixed: 'right',
    props: {
      sortable: true,
    },
    formatter({row}) {
      return formatDate(row.createTimestamp)
    },
  },
  {
    label: '操作',
    key: 'actions',
    width: 70,
    fixed: 'right',
    render({row}) {
      return renderDropdownMenu(
        [
          {
            label: '编辑',
            props: {
              onClick: () => {
                editItem(row)
              },
            },
          },
          {
            label: '创建副本',
            props: {
              onClick: () => {
                duplicateItem(row)
              },
            },
          },
          {
            label: '删除',
            props: {
              onClick: () => {
                window.$dialog
                  .confirm(`确认删除？`, '确认删除', {
                    type: 'warning',
                  })
                  .then(() => {
                    deleteItem(row)
                  })
                  .catch()
              },
            },
          },
        ],
        {},
      )
    },
  },
]

const rootRef = ref()
const maxHeight = ref(300)
useResizeObserver(rootRef, (entries) => {
  const entry = entries[0]
  const {width, height} = entry.contentRect
  maxHeight.value = height
})

const allTips = computed(() => {
  return filteredList.value.reduce((acc, cur) => {
    return acc + cur.tip
  }, 0)
})

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
      historyList.value.push(item)

      window.$message.success('创建成功！')
    } else {
      const idx = historyList.value.findIndex((i) => item.id === i.id)
      historyList.value.splice(idx, 1, item)
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
  const idx = historyList.value.findIndex((i) => item.id === i.id)
  historyList.value.splice(idx, 1)
}

defineExpose({
  createItem,
  duplicateItem,
  editItem,
  deleteItem,
})
</script>

<template>
  <div class="transaction-history-wrapper">
    <div class="filter-row flex-row-center-gap">
      <el-input
        clearable
        placeholder="过滤股票代码"
        v-model="filterData.filterName"
        @change="updateFilteredList"
      />
    </div>
    <div ref="rootRef" class="transaction-history">
      <AutoTableElPlus
        class="table-ui"
        :data="filteredList"
        :columns="tableColumns"
        :height="maxHeight"
        :default-sort="{prop: 'createTimestamp', order: 'descending'}"
      />
    </div>

    <div class="st-row flex-row-center-gap">
      <span>{{ filteredList.length }} 个记录</span>
      <span>
        总计佣金:
        {{
          getPriceWithSymbol({
            price: allTips,
            currency: filteredList[0]?.currency,
            showCurrencyCode: false,
          })
        }}
      </span>
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
.transaction-history-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  .filter-row {
    padding: 4px;
  }
  .st-row {
    padding: 4px 8px;
    gap: 16px;
  }
  .transaction-history {
    flex: 1;
    overflow: hidden;
  }
}
</style>
