<script lang="ts">
import {defineComponent} from 'vue'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import dynamicLoadScript from '@/utils/dynamic-load-script'
import iconExcel from '../assets/textures/excel.svg?url'
import {copyToClipboard} from '@/utils'
import {getFileName, handleExportFile} from '@/utils/exporter'
import CopyExampleDialog from '@/components/VueI18nCopyTool/CopyExampleDialog.vue'
const formatMultipleLine = (str, mode) => {
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

const isAllowedElement = (el) => {
  return el.tagName.toLowerCase() === 'td'
}
const CopyMode = {
  none: 'none',
  text: 'text',
  html: 'html',
  json: 'json',
}
const CopyModeOptions = Object.values(CopyMode).map((i) => {
  return {label: i, value: i}
})

export default defineComponent({
  name: 'ExcelCopyTool',
  components: {
    FileChooser,
    CopyExampleDialog,
  },
  setup() {
    const importFileChooserRef = ref()
    const tableWrapperRef = ref()
    const isReady = ref(false)

    const workbookRef = shallowRef()
    const sheetNames = ref<string[]>([])
    const sheetNameIndex = ref(0)

    watch(sheetNameIndex, () => {
      renderWorkbook()
    })

    const checkPlugin = () => {
      if (!isReady.value) {
        const msg = 'XLSX Not Ready!'
        window.$message.error(msg)
        throw new Error(msg)
      }
    }

    const getWorksheet = (workbook) => {
      sheetNames.value = workbook.SheetNames // 工作表名称集合
      return workbook.Sheets[sheetNames.value[sheetNameIndex.value]]
    }

    const renderWorkbook = () => {
      const workbook = workbookRef.value
      if (!workbook) {
        tableWrapperRef.value.innerHTML = ''
        return
      }
      const html = window.XLSX.utils.sheet_to_html(getWorksheet(workbook))
      tableWrapperRef.value.innerHTML = html
    }

    const handleImport = async (file) => {
      checkPlugin()
      if (!/\.xlsx$/g.test(file.name)) {
        console.error('Only supports reading xlsx format!')
        return
      }
      const reader = new FileReader()
      workbookRef.value = null
      reader.onload = function (e: any) {
        const data = e.target.result
        sheetNameIndex.value = 0
        workbookRef.value = window.XLSX.read(data, {type: 'binary'})
        renderWorkbook()
      }
      reader.readAsBinaryString(file)
    }

    onMounted(() => {
      dynamicLoadScript('//unpkg.com/xlsx@0.16.9/xlsx.mini.js', () => {
        window.$message.success('XLSX Ready!')
        console.log('XLSX ready', window.XLSX)
        isReady.value = true
      })
    })

    const copyMode = ref(CopyMode.json)
    const handleClick = (event: MouseEvent) => {
      let el = event.target as HTMLElement
      if (!isAllowedElement(el) || !copyMode.value || copyMode.value === CopyMode.none) {
        return
      }

      if (!el.innerText) {
        return
      }
      let text = el.innerText.trim().replace(/ /gi, ' ') // replace [NBSP]

      console.log(copyMode.value)

      let tip = ''
      if (event.ctrlKey && event.altKey) {
        text = formatMultipleLine(text, (tip = CopyMode.json))
      } else if (event.ctrlKey) {
        text = formatMultipleLine(text, (tip = CopyMode.text))
      } else if (event.altKey) {
        text = formatMultipleLine(text, (tip = CopyMode.html))
      } else {
        text = formatMultipleLine(text, (tip = copyMode.value))
      }
      copyToClipboard(text)
      window.$message.success(tip + ' copied!')

      const range = document.createRange()
      range.selectNode(el)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }

    const getSheetJson = () => {
      if (!workbookRef.value) {
        const str = 'Please open Excel file first!'
        window.$message.error(str)
        throw new Error(str)
      }
      return window.XLSX.utils.sheet_to_json(getWorksheet(workbookRef.value))
    }

    const isShowCopyExample = ref(false)
    return {
      iconExcel,
      sheetNames,
      sheetNameIndex,
      handleImport,
      importFileChooserRef,
      loadDemo() {
        checkPlugin()
        const aoa = [
          ['姓名', '性别', '年龄', '注册时间'],
          ['张三', '男', 18, new Date()],
          ['李四', '女', 22, new Date()],
        ]
        const sheet = window.XLSX.utils.aoa_to_sheet(aoa)
        const wb = window.XLSX.utils.book_new()
        window.XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1')

        sheetNameIndex.value = 0
        workbookRef.value = wb
        renderWorkbook()
      },
      tableWrapperRef,
      handleClick,
      copyMode,
      CopyModeOptions,
      dropdownMenuOptions: [
        {
          label: 'Copy Sheet JSON',
          props: {
            onClick: async () => {
              const json = getSheetJson()
              copyToClipboard(JSON.stringify(json, null, 2))
              window.$message.success('Sheet JSON Copied!')
            },
          },
        },
        {
          label: 'Export Sheet JSON',
          props: {
            onClick: async () => {
              const json = getSheetJson()
              handleExportFile(
                getFileName(null, 'excel_sheet_export'),
                JSON.stringify(json, null, 2),
                '.json'
              )
            },
          },
        },
      ],
      isShowCopyExample,
      formatMultipleLine,
    }
  },
})
</script>

<template>
  <div class="excel-copy-tool">
    <div>
      <n-card size="small">
        <n-page-header subtitle="" @back="$router.push({name: 'HomeView'})">
          <template #title> ExcelCopyTool </template>
          <template #avatar>
            <n-avatar :src="iconExcel" style="background: none" />
          </template>
          <template #extra>
            <n-space>
              <n-space size="small" align="center">
                <n-button text @click="isShowCopyExample = true">CopyMode:</n-button>
                <n-select
                  size="small"
                  v-model:value="copyMode"
                  :options="CopyModeOptions"
                  style="width: 100px"
                />
              </n-space>

              <n-button type="primary" @click="importFileChooserRef.chooseFile()" size="small">
                Import Excel
              </n-button>

              <n-dropdown :options="dropdownMenuOptions" placement="bottom-start" key-field="label">
                <n-button size="small">Export</n-button>
              </n-dropdown>

              <n-button @click="loadDemo" size="small">Demo</n-button>
            </n-space>
          </template>
        </n-page-header>
      </n-card>

      <n-card class="sheet-name-card" size="small">
        <n-tabs size="small" type="card" animated v-model:value="sheetNameIndex">
          <n-tab-pane
            style="padding: 0"
            :name="index"
            :tab="item"
            :key="item"
            v-for="(item, index) in sheetNames"
          >
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
    <div ref="tableWrapperRef" class="excel-table-container" @click="handleClick"></div>

    <FileChooser
      ref="importFileChooserRef"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      @selected="handleImport"
    />

    <CopyExampleDialog
      v-model:visible="isShowCopyExample"
      :title="'Copy Mode Example: ' + copyMode"
      :format-text="(str) => formatMultipleLine(str, copyMode)"
    />
  </div>
</template>

<style lang="scss" scoped>
.excel-copy-tool {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .excel-table-container {
    flex: 1;
  }

  .sheet-name-card {
    :deep(.n-card__content) {
      padding: 5px 5px 0;
    }
  }

  :deep(.excel-table-container) {
    position: relative;
    z-index: 1;
    background-color: white;
    width: 100%;
    overflow: auto;

    table {
      border-collapse: collapse;
    }

    td {
      height: 25px;
      padding: 5px 10px;
    }

    table,
    th,
    td {
      border: 1px solid #aeaeae;
      word-wrap: break-word;
    }
    td:hover {
      background-color: rgba(141, 141, 141, 0.3);
    }
  }
}
</style>
