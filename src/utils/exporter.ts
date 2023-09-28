import moment from 'moment/moment'
import FileSaver from 'file-saver'
import {ComponentExportData} from '@/enum/page-craft/block'
import {sassToCSS} from '@/utils/css'
import {formatCss, formatHtml} from '@/utils/formater'

export const handleExportJson = (exportData: ComponentExportData) => {
  handleExportFile(getFileName(exportData.name), JSON.stringify(exportData, null, 2), '.json')
}

export const handleExportStyle = async (exportData: ComponentExportData, isCss = false) => {
  let style = exportData.style
  if (isCss) {
    style = formatCss(await sassToCSS(style))
  }
  handleExportFile(getFileName(exportData.name), style, isCss ? '.css' : '.scss')
}

export const handleExportHtml = async (exportData: ComponentExportData, options?) => {
  const {html, style} = exportData
  const {isInline = false, inlineWithStyleTag = false} = options || {}

  let nameSuffix = ''
  if (isInline) {
    nameSuffix += '-inline'
    if (inlineWithStyleTag) {
      nameSuffix += '-with-style-tag'
    }
  }

  let name = getFileName(exportData.name ? exportData.name + nameSuffix : '')

  const cssCode = style ? formatCss(await sassToCSS(style)) : ''
  let htmlStr
  if (isInline) {
    htmlStr = window.$juice(`<style>${cssCode}</style>
${html}`)
    if (inlineWithStyleTag) {
      htmlStr = `<style>${cssCode}</style>${htmlStr}`
    }
    htmlStr = formatHtml(htmlStr)
  } else {
    htmlStr = `<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${name}</title>
  <style>
    ${cssCode}
  </style>
</head>
<body>
${html}
</body>
</html>
`
  }

  handleExportFile(name, htmlStr, '.html')
}
export const handleExportVue = (exportData: ComponentExportData, version = 2) => {
  const {html, style} = exportData
  const name = getFileName(exportData.name)

  const styleStr = `
<style lang="scss" scoped>
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

export const getFileName = (name?, fallbackPrefix = 'PageCraft') => {
  return prompt(
    `Export filename`,
    name || `${fallbackPrefix}_${moment(new Date()).format('YYYYMMDD_HHmmss')}`
  )
}

export const handleExportFile = (filename, contentStr, ext) => {
  if (!filename) {
    throw new Error('filename is required')
  }
  const blob = new Blob([contentStr], {
    type: 'text/plain;charset=utf-8',
  })
  FileSaver.saveAs(blob, filename + ext)
}

export const handleReadSelectedFile = (file) => {
  // console.log(file)
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

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}
