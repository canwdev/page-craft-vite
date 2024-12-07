import {IPriceByDay} from '@/components/AppUtils/StockTracker/types'
import {guid_S4} from '@/utils'

// https://www.alphavantage.co/documentation/
export const fetchPrices = async ({symbol}): Promise<IPriceByDay> => {
  console.log(`正在获取 ${symbol} 行情...`)
  const data = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${guid_S4()}`,
  ).then((res) => res.json())

  if (data.Information) {
    throw new Error(data.Information)
  }
  const {'Time Series (Daily)': dayMap} = data
  console.log(`获取 ${symbol} 行情成功！`, data)

  const priceByDay: IPriceByDay = {}
  Object.keys(dayMap).forEach((day) => {
    const item = dayMap[day]
    priceByDay[day] = {
      open: item['1. open'],
      high: item['2. high'],
      low: item['3. low'],
      close: item['4. close'],
      volume: item['5. volume'],
    }
  })

  console.log(`${symbol} priceByDay`, priceByDay)
  return priceByDay
}
