import moment from 'moment/moment'
import FileSaver from 'file-saver'
import {ExportItem} from '@/enum/block'

export const handleExportJson = (exportData: ExportItem) => {
  handleExportFile(getFileName(exportData.name), JSON.stringify(exportData, null, 2), '.json')
}

export const handleExportVue = (exportData: ExportItem, version = 2) => {
  const {html, style, styleLang} = exportData
  const name = getFileName(exportData.name)

  const styleStr = `
<style lang="${styleLang}" scoped>
${style}
</style>
`

  let sfcStr = ''
  if (version === 3) {
    sfcStr = `<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: '${name}',
})
</script>

<template>
${html}
</template>

${styleStr}
`
  } else {
    sfcStr = `<template>
${html}
</template>

<script>
export default {
  name: '${name}',
}
</script>

${styleStr}
`
  }
  sfcStr.trim()

  handleExportFile(name, sfcStr, '.vue')
}

const getFileName = (name?) => {
  return prompt(
    `Export filename`,
    name || `PageCraft_${moment(new Date()).format('YYYYMMDD_HHmmss')}`
  )
}

export const handleExportFile = (filename, contentStr, ext) => {
  if (!filename) {
    return
  }
  const blob = new Blob([contentStr], {
    type: 'text/plain;charset=utf-8',
  })
  FileSaver.saveAs(blob, filename + ext)
}
