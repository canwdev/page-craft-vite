<script setup lang="ts">
import StockStatistics from './StockStatistics.vue'
import TransactionHistory from './TransactionHistory.vue'
import {IStockTrackerSettings} from './types'
import RectSwitch from '@/components/CanUI/packages/OptionUI/Tools/RectSwitch.vue'
import {useStorage} from '@vueuse/core'
import {LS_SettingsKey} from '@/enum/settings'
import StockPrices from '@/components/Apps/StockTracker/StockPrices.vue'
import DropdownMenu from '@/components/CanUI/packages/OptionUI/Tools/DropdownMenu.vue'
import {useUpdatePrices} from '@/components/Apps/StockTracker/hooks/update-prices'
import {IOptionItem} from '@/components/CanUI/packages/AutoFormElPlus/enum'

const stockTrackerSettings = useStorage<IStockTrackerSettings>(
  LS_SettingsKey.STOCK_TRACKER_SETTINGS,
  {
    transactionHistory: [],
  },
)

// 交易记录中的股票代码和名称
const stockSymbolOptions = computed((): IOptionItem[] => {
  const nameMap = new Map<string, string>()
  stockTrackerSettings.value.transactionHistory.forEach((item) => {
    nameMap.set(item.symbol, item.symbolName)
  })

  return Array.from(nameMap.keys()).map((key) => {
    return {value: key, label: nameMap.get(key) || ''}
  })
})

const {stockTrackerPrices, isUpdating, updatePrices, confirmUpdatePrices} = useUpdatePrices({
  stockSymbolOptions,
})

// const {importData} = useImportStockData()
onMounted(async () => {
  // stockTrackerSettings.value.transactionHistory = await importData()
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

const transactionHistoryRef = ref()
</script>

<template>
  <div class="stock-tracker vgo-bg scrollbar-mini" v-loading="isUpdating">
    <div class="action-row">
      <div class="flex-row-center-gap">
        <button
          class="vgo-button primary"
          v-if="curTab === StockTrackerTab.HISTORY"
          @click="transactionHistoryRef.createItem"
        >
          添加交易记录
        </button>
        <button class="vgo-button" @click="confirmUpdatePrices">更新日行情</button>
      </div>
      <RectSwitch v-model="curTab" :options="tabOptions" />
      <div class="flex-row-center-gap">
        <DropdownMenu :options="exportImportOptions">
          <button class="vgo-button" title="Export">
            <span class="mdi mdi-briefcase-arrow-up-down"></span>
          </button>
        </DropdownMenu>
      </div>
    </div>

    <div class="content-wrapper">
      <StockPrices v-if="curTab === StockTrackerTab.PRICES" :stock-prices="stockTrackerPrices" />
      <TransactionHistory
        ref="transactionHistoryRef"
        v-if="curTab === StockTrackerTab.HISTORY"
        :history-list="stockTrackerSettings.transactionHistory"
        :stock-symbol-options="stockSymbolOptions"
        v-model:is-updating="isUpdating"
      />
      <StockStatistics
        v-if="curTab === StockTrackerTab.STATISTICS"
        :history-list="stockTrackerSettings.transactionHistory"
        :stock-prices="stockTrackerPrices"
      />
    </div>
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
    border-bottom: 1px solid var(--vgo-color-border);
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
