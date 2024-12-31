import {fetchPricesByDay} from '@/components/Apps/StockTracker/utils/prices'
import {useStorage} from '@vueuse/core'
import {IStockTrackerPrices} from '@/components/Apps/StockTracker/types'
import {LS_SettingsKey} from '@/enum/settings'

export const useUpdatePrices = ({stockSymbolOptions}) => {
  const stockTrackerPrices = useStorage<IStockTrackerPrices>(
    LS_SettingsKey.STOCK_TRACKER_PRICES,
    {},
  )
  const isUpdating = ref(false)

  const updatePrices = async () => {
    try {
      isUpdating.value = true

      const symbolMap = stockTrackerPrices.value

      for (let i = 0; i < stockSymbolOptions.value.length; i++) {
        const symbol = stockSymbolOptions.value[i].value
        if (!symbol) {
          continue
        }
        const dataByDay = await fetchPricesByDay({
          symbol: symbol,
        })

        if (!symbolMap[symbol]) {
          symbolMap[symbol] = {}
        }

        if (symbolMap[symbol].byDay) {
          // 保留旧数据
          symbolMap[symbol] = {
            ...symbolMap[symbol].byDay,
            byDay: dataByDay,
          }
        } else {
          symbolMap[symbol] = {
            byDay: dataByDay,
          }
        }
      }

      window.$message.success('更新行情成功！')
      stockTrackerPrices.value = symbolMap
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

  return {
    stockTrackerPrices,
    isUpdating,
    updatePrices,
    confirmUpdatePrices,
  }
}
