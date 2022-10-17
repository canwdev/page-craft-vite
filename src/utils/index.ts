import ColorHash from 'color-hash'
export const copyToClipboard = (text: string) => {
  const input = document.createElement('textarea')
  input.value = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
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

export function formatDate(date: Date) {
  if (!date) {
    return ''
  }
  const year = date.getFullYear() + '-'
  const month = pad2Num(date.getMonth() + 1) + '-'
  const day = pad2Num(date.getDate())
  const hours = ' ' + pad2Num(date.getHours()) + ':'
  const minutes = pad2Num(date.getMinutes())
  return [year, month, day, hours, minutes].join('')
}

export const formatSelectOptions = (list: string[]) => {
  return list.map((item) => {
    return {
      value: item,
      label: item,
    }
  })
}
