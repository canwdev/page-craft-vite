import moment from 'moment/moment'
import FileSaver from 'file-saver'
import {ExportItem} from '@/enum/block'
import {sassToCSS} from '@/utils/css'
import {formatCss} from '@/utils/formater'

export const handleExportJson = (exportData: ExportItem) => {
  handleExportFile(getFileName(exportData.name), JSON.stringify(exportData, null, 2), '.json')
}

export const handleExportHtml = async (exportData: ExportItem, isEmail = false) => {
  const {html, style, styleLang} = exportData
  const name = getFileName(exportData.name)

  console.log(inlineCss)
  return

  const htmlStr = `<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${name}</title>
  <style>
    ${formatCss(await sassToCSS(style))}
  </style>
</head>
<body>
${html}
</body>
</html>
`
  handleExportFile(name, htmlStr, '.html')
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

export const getFileName = (name?) => {
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

export const handleReadSelectedFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(reader.result)
      } catch (error: any) {
        reject(error)
        window.$message.error('Import Failed! ' + error.message)
      }
    }
    reader.readAsText(file)
  })
}
