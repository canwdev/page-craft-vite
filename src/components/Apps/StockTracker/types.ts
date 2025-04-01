import {FormRules} from 'element-plus'
import {CurrencyType} from './utils/currency-symbol'
import {IOptionItem} from '@/components/VgoUI/packages/AutoFormElPlus/enum'
import {guid} from '@/utils'

export const currencyOptions = Object.values(CurrencyType).map((item) => {
  return {
    label: item,
    value: item,
  } as IOptionItem
})

export enum EntrustSide {
  BUY = 'B',
  SALE = 'S',
}

export const entrustSideOptions: IOptionItem[] = [
  {label: '买入', value: EntrustSide.BUY},
  {label: '卖出', value: EntrustSide.SALE},
]

export interface ITransactionHistory {
  id: string
  // 股票代码
  symbol: string
  // 股票名称
  symbolName: string
  // 成交平均价格
  businessAvgPrice: number
  // 成交数量
  businessQty: number
  // 货币类型
  currency: string
  // 委托方向
  entrustSide: EntrustSide
  // 佣金/手续费
  tip: number
  // 备注
  remark: string
  // 创建时间
  createTimestamp: number
}

export const formatTransactionHistory = (item: any = {}): ITransactionHistory => {
  return {
    id: item.id,
    symbol: item.symbol,
    symbolName: item.symbolName,
    businessAvgPrice: item.businessAvgPrice || 0,
    businessQty: item.businessQty || 0,
    currency: item.currency || 'USD',
    entrustSide: item.entrustSide,
    tip: item.tip || 0,
    remark: item.remark,
    createTimestamp: item.createTimestamp || new Date().getTime(),
  }
}

export const getTransactionHistoryFormRules = (): FormRules => {
  const getRequired = () => {
    return [
      {
        required: true,
        trigger: ['change'],
      },
    ]
  }
  return {
    symbol: getRequired(),
    symbolName: getRequired(),
    businessAvgPrice: getRequired(),
    businessQty: getRequired(),
    currency: getRequired(),
    entrustSide: getRequired(),
    tip: getRequired(),
    createTimestamp: getRequired(),
  }
}

// 用户数据保存
export interface IStockTrackerSettings {
  transactionHistory: ITransactionHistory[]
}

export interface IStockPrices {
  open: string
  high: string
  low: string
  close: string
  volume: string
  day?: string
}

export interface IPriceByDay {
  [day: string]: IStockPrices
}

// 行情
export interface IStockTrackerPrices {
  [symbol: string]: {
    byDay?: IPriceByDay
  }
}
