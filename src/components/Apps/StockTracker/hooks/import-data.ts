import {ITransactionHistory} from '@/components/Apps/StockTracker/types'
import {guid} from '@/utils'

export const useImportStockData = () => {
  const importData = async (): Promise<ITransactionHistory[]> => {
    const {
      data: {list},
    } = await fetch('http://127.0.0.1:8080/stock.json').then((res) => res.json())
    console.log(list)
    // stockTrackerSettings.value.transactionHistory =
    const ret = list.reverse().map((item) => {
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

    return ret
  }

  return {
    importData,
  }
}
