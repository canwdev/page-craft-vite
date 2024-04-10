import {sassToCSS} from '@/components/StyleEditor/utils/css'
import {formatCss, formatHtml} from '@/components/StyleEditor/utils/formater'
import {IComponentExportData} from '@/components/PageCraft/ComponentExplorer/enum'
import {handleExportFile, promptGetFileName} from '@/utils/mc-utils/io'

export const handleExportHtml = async (exportData: IComponentExportData, options?) => {
  const {html, style} = exportData
  const {isInline = false, inlineWithStyleTag = false} = options || {}

  let nameSuffix = ''
  if (isInline) {
    nameSuffix += '-inline'
    if (inlineWithStyleTag) {
      nameSuffix += '-with-style-tag'
    }
  }

  let name = await promptGetFileName(exportData.name ? exportData.name + nameSuffix : '')

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
export const handleExportVue = async (exportData: IComponentExportData, version = 2) => {
  const {html, style} = exportData
  const name = await promptGetFileName(exportData.name)

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
