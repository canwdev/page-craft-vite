import {copyToClipboard} from '@/utils'

export const copy = async (val, isShowVal = false) => {
  if (typeof val === 'object') {
    console.info('object', val)
    val = JSON.stringify(val, null, 2)
  }
  console.info('copy:', val)
  await copyToClipboard(val)
  let showVal = ''
  if (isShowVal) {
    if (val.length > 50) {
      showVal = val.slice(0, 50) + '...'
    } else {
      showVal = val
    }
  }
  if (showVal) {
    showVal = ': ' + showVal
  }
  window.$message.success(`Copied${showVal}`)
}
