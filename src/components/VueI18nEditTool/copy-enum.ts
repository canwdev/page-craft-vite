export const CopyMode = {
  none: 'none',
  text: 'text',
  html: 'html',
  json: 'json',
}
export const CopyModeOptions = Object.values(CopyMode).map((i) => {
  return {label: i, value: i}
})

export const formatMultipleLine = (str, mode = 'text', isTrimEmptyLines = false) => {
  str = str.trim().replace(/ /gi, ' ') // replace [NBSP]

  if (isTrimEmptyLines) {
    str = str.replace(/^\s*[\r\n]/gm, '')
  }
  if (mode === CopyMode.text) {
    return str
  }
  let arr = str.split('\n')
  arr = arr.map((i) => i.trim())
  if (mode === CopyMode.json) {
    if (arr.length === 1) {
      return JSON.stringify(arr[0])
    }
    return JSON.stringify(arr, null, 2)
  }
  if (mode === CopyMode.html) {
    return arr.join('<br>')
  }
}
