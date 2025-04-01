import moment from 'moment/moment'

/**
 * 复制字符串到剪贴板操作（兼容新旧接口）
 * @param text 要复制的文本
 */
export const copyToClipboard = (text): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 如果支持 Clipboard API，就使用它
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    } else {
      // 使用 document.execCommand 兼容旧 API
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.display = 'none'
      document.body.appendChild(textarea)
      textarea.select()

      try {
        const success = document.execCommand('copy')
        if (!success) {
          throw new Error('Unable to perform copy operation')
        } else {
          resolve()
        }
      } catch (error) {
        reject(error)
      } finally {
        document.body.removeChild(textarea)
      }
    }
  })
}

/**
 * 从剪贴板粘贴文本（兼容新旧接口）
 * @param options 配置参数
 */
export const readClipboardData = (options: any = {}): Promise<string> => {
  const {
    // 是否修剪前后空格
    isTrim = true,
    // 修复windows下粘贴换行符
    isNormalize = true,
  } = options

  const formatText = (text) => {
    if (isTrim) {
      text = text.trim()
    }
    if (isNormalize) {
      text = text.replace(/\r\n/g, '\n')
    }

    return text
  }

  return new Promise((resolve, reject) => {
    // 检查浏览器是否支持 Clipboard API
    if (navigator.clipboard) {
      navigator.clipboard
        .readText()
        .then((text) => {
          resolve(formatText(text))
        })
        .catch((err) => {
          reject(err)
        })
    } else {
      // 如果不支持，回退到使用 Document.execCommand
      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('paste')
      const text = textarea.value
      resolve(formatText(text))
      document.body.removeChild(textarea)
    }
  })
}

export const isCharacterKeyPress = (evt) => {
  if (typeof evt.which == 'undefined') {
    // This is IE, which only fires keypress events for printable keys
    return true
  } else if (typeof evt.which == 'number' && evt.which > 0) {
    // In other browsers except old versions of WebKit, evt.which is
    // only greater than zero if the keypress is a printable key.
    // We need to filter out backspace and ctrl/alt/meta key combinations
    return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8
  }
  return false
}

export function pad2Num(num: number, len = 2) {
  return num.toString().padStart(len, '0')
}

export function formatDate(d: any, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!d) {
    return ''
  }
  return moment(d).format(format)
}

export const formatSelectOptions = (list: string[]) => {
  return list.map((item) => {
    return {
      value: item,
      label: item,
    }
  })
}

export const sleep = (timeoutInMs: number) =>
  new Promise((r) => {
    setTimeout(r, timeoutInMs)
  })

export function guid_S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
export const guid = (split = '-') => {
  return (
    guid_S4() +
    guid_S4() +
    split +
    guid_S4() +
    split +
    guid_S4() +
    split +
    guid_S4() +
    split +
    guid_S4() +
    guid_S4() +
    guid_S4()
  )
}

// 字节转换为可读的单位
export const bytesToSize = (bytes, autoNo = '0 B') => {
  bytes = Number(bytes)
  if (Number.isNaN(bytes)) {
    return '-'
  }
  if (bytes === 0) return autoNo
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number(bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}
