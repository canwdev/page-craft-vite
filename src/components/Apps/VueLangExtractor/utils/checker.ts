import {parse} from 'acorn'

const vueKeyMap = {
  id: true,
  key: true,
  class: true,
  cls: true,
  className: true,
  href: true,
  rel: true,
  ref: true,
  style: true,
  type: true,
  ratio: true,
  src: true,
  visible: true,
}
export const checkKeyNeedExtract = (key: string) => {
  // console.log('key', key)
  if (vueKeyMap[key]) {
    return false
  }
  // data-*
  if (key.startsWith('data-')) {
    return false
  }
  return true
}

// 如 DemoVue2，SimpleCounter, DemoPage, isLoading，单个大写开头的单词不算，如 Apple，Bandwidth，Highest，Medium
function isValidCodeName(str) {
  // 检查是否包含空格
  if (/\s/.test(str)) {
    return false
  }
  // 检查首字符是否为字母
  if (!/^[A-Za-z]/.test(str)) {
    return false
  }
  // 检查从第二个字符开始是否有大写字母
  return /[A-Z]/.test(str.slice(1))
}

// 检测内容是否需要提取，如人类可读的文本内容，不包括代码内容
export const valueNeedExtract = (value: string, handleWarning) => {
  if (!Number.isNaN(Number(value))) {
    // 忽略数字
    return false
  }
  value = value.trim()
  // console.log('value', value)

  // 检查长度是否至少为2
  if (value.length < 2) {
    return false
  }

  // 检测内容是否为非ASCII字符，如中文或其他语言（非代码内容）
  // eslint-disable-next-line no-control-regex
  if (/[^\x00-\x7F]/.test(value)) {
    return true
  }

  // 检测全小写，变量名或表达式
  if (value === value.toLowerCase()) {
    return false
  }

  // 检测不包含空格且包含点，是对象属性
  if (!value.includes(' ') && value.includes('.')) {
    return false
  }

  // 检测类名或变量名，如 SimpleCounter, DemoPage, isLoading
  if (isValidCodeName(value)) {
    return false
  }

  // 检测不包含空格且全是大写（专业术语）
  if (!value.includes(' ') && value === value.toUpperCase()) {
    return false
  }

  // 检测是否以协议开头
  if (/^(https?:\/\/|ftp:\/\/|mailto:\/\/|tel:\/\/|data:)/i.test(value)) {
    return false
  }

  // 检测文本中是否包含 $(任意内容) 模式
  if (/\${[^}]*}/gi.test(value)) {
    const message = '请手动处理 $(任意内容)'
    console.warn(message, {value})
    handleWarning &&
      handleWarning({
        message,
        value,
      })
    return false
  }

  // 检测文本中是否包含 $t(任意内容) 模式
  // if (/\$\w+\('[^']*'\)/gi.test(value)) {
  if (/\$t\('[^']*'\)/gi.test(value)) {
    const message = '请手动处理 $任意(任意内容)'
    console.warn(message, {value})
    handleWarning &&
      handleWarning({
        message,
        value,
      })
    return false
  }

  // 检测是否包含 ? : () => { }
  if (/\?|:|=>|=|{|}/gi.test(value)) {
    // 尝试用 acorn 解析文本，检测是否为代码内容
    try {
      parse(value, {ecmaVersion: 2020})
      // console.warn('解析成功，是代码内容：', value)
      return false
    } catch (error) {
      // 解析失败，为文本内容
    }
  }

  return true
}

window.$parse = parse
