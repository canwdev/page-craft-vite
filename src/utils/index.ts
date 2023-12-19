import ColorHash from 'color-hash'
import moment from 'moment/moment'

export const copyToClipboard = (text: string) => {
  const input = document.createElement('textarea')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
}

export const readClipboardData = () => {
  return new Promise((resolve, reject) => {
    // 检查浏览器是否支持 Clipboard API
    if (navigator.clipboard) {
      navigator.clipboard
        .readText()
        .then((text) => {
          resolve(text)
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
      const clipboardData = textarea.value
      resolve(clipboardData)
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

// https://stackoverflow.com/a/16348977
export const stringToColour = (str = '') => {
  let i
  let hash = 0
  for (i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

export const customHash = (str = '') => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i)
  }
  return hash
}
export const colorHash = new ColorHash({
  hash: customHash,
  lightness: [0.66],
  // hue: [
  //   {min: 30, max: 90},
  //   {min: 180, max: 210},
  //   {min: 270, max: 285},
  // ],
  // saturation: [0.35, 0.5, 0.65],
})

export function pad2Num(num: number, len = 2) {
  return num.toString().padStart(len, '0')
}

export function formatDate(d: Date) {
  if (!d) {
    return ''
  }
  return moment(d).format('YYYY-MM-DD HH:mm:ss')
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

export const guid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}
