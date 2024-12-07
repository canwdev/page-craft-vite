<script setup lang="ts">
import AutoTableElPlus from '@/components/CanUI/packages/AutoTableElPlus/index.vue'
import {AutoTableColumn} from '@/components/CanUI/packages/AutoTableElPlus/types'
import {EntrustSide, ITransactionHistory} from './types'
import {useResizeObserver} from '@vueuse/core'
import {formatDate} from '@/utils'
import {getPriceWithSymbol} from '@/components/AppUtils/StockTracker/utils'
import {renderDropdownMenu} from '@/components/CanUI/packages/OptionUI/Tools/renders'

const props = withDefaults(
  defineProps<{
    historyList: ITransactionHistory[]
  }>(),
  {},
)
const emit = defineEmits(['editItem', 'duplicateItem', 'deleteItem'])
const {historyList} = toRefs(props)

const filterData = ref({
  filterSymbol: '',
})

const filteredList = ref<ITransactionHistory[]>([])
const updateFilteredList = () => {
  const {filterSymbol} = filterData.value
  if (!filterSymbol) {
    filteredList.value = historyList.value
    return
  }
  filteredList.value = historyList.value.filter((item) => {
    return (item.symbol || '').toLowerCase().includes((filterSymbol || '').toLowerCase())
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
    label: '股票代码',
    fixed: 'left',
    props: {
      sortable: true,
    },
  },
  {
    key: 'symbolName',
    label: '股票名称',
    minWidth: 120,
    props: {
      sortable: true,
      showOverflowTooltip: true,
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
                emit('editItem', row)
              },
            },
          },
          {
            label: '创建副本',
            props: {
              onClick: () => {
                emit('duplicateItem', row)
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
                    emit('deleteItem', row)
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
</script>

<template>
  <div class="transaction-history-wrapper">
    <div class="filter-row flex-row-center-gap">
      <el-input
        clearable
        placeholder="过滤股票代码"
        v-model="filterData.filterSymbol"
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
