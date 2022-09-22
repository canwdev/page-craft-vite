import moment from 'moment/moment'
import FileSaver from 'file-saver'

export type ExportData = {
  html: string
  style: string
  styleLang: string
  timestamp: number
}

export const handleExportJson = (exportData: ExportData) => {
  handleExportFile(getFileName(), JSON.stringify(exportData, null, 2), '.json')
}

export const handleExportVue = (exportData: ExportData, version = 2) => {
  const {html, style, styleLang} = exportData
  const name = getFileName()

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

const getFileName = () => {
  const dateStr = moment(new Date()).format('YYYYMMDD_HHmmss')
  return prompt(`Export filename`, `PageCraft_${dateStr}`)
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
