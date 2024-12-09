import currencyJs from './currency-js'
import {getSymbolFromCurrency} from './currency-symbol.js'
import moment from 'moment/moment'

/**
 * 格式化字符串，示例：USD $98.99
 * 另见：PriceDisplayV2
 * @param config
 */
export const getPriceWithSymbol = (config) => {
  const {price = 0, currency, showCurrencyCode = true, precision = 2} = config || {}

  if (Number.isNaN(price)) {
    return NaN
  }

  // 货币前缀
  const codePrefix = showCurrencyCode && currency ? `${currency} ` : ``

  if (!currency) {
    return codePrefix + currencyJs(price, {precision})
  }

  let _precision = precision
  if (currency === 'JPY' || currency === 'KRW') {
    _precision = 0
  }

  const currencySymbol = getSymbolFromCurrency(currency)
  return (
    codePrefix +
    currencyJs(price, {
      symbol: currencySymbol,
      precision: _precision,
    }).format()
  )
}

export const getPriceClassName = (price: number) => {
  if (price > 0) {
    return 'price-up'
  }
  if (price < 0) {
    return 'price-down'
  }
  return ''
}

// 格式化 key -> label
export const formatLabel = (key) => {
  const words = key.split(/(?=[A-Z])/)
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

// 使用 Moment.js 将 n 个月转换为 x 年 y 月的代码：
export function convertMonthsToYearsAndMonths(months) {
  const duration = moment.duration(months, 'months')
  const years = Math.floor(duration.asYears())
  const remainingMonths = Math.floor(duration.asMonths()) % 12
  return `${years}年${remainingMonths}月`
}

/** 数字金额大写转换(可以处理整数,小数,负数) */
export function numberToChineseMoney(n) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  const head = n < 0 ? '欠' : ''
  n = Math.abs(n)

  let s = ''

  for (var i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)

  for (var i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  )
}

// https://stackoverflow.com/a/2901298
export function numberWithCommas(x) {
  if (!x) {
    return ''
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
