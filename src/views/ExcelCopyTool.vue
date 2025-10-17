<script lang="ts">
import TabLayout from '@canwdev/vgo-ui/src/components/Layouts/TabLayout.vue'
import RectSwitch from '@canwdev/vgo-ui/src/components/OptionUI/components/RectSwitch.vue'
import DropdownMenu from '@canwdev/vgo-ui/src/components/QuickOptions/DropdownMenu.vue'
import { useSaveShortcut } from '@canwdev/vgo-ui/src/hooks/use-beforeunload'
import { useStorage } from '@vueuse/core'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'
import DropZone from '@/components/CommonUI/DropZone.vue'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import { LS_SettingsKey } from '@/enum/settings'
import { useFileDrop } from '@/hooks/use-file-drop'
import { useMainStore } from '@/store/main'
import { copyToClipboard } from '@/utils'
import dynamicLoadScript from '@/utils/dynamic-load-script'
import globalEventBus, { GlobalEvents } from '@/utils/global-event-bus'
import { handleExportFile, promptGetFileName } from '@/utils/mc-utils/io'
import {
  TextConvertMode,
  textConvertMultipleLine,
  TextConvertOptions,
} from '@/utils/mc-utils/text-convert'

function isAllowedElement(el) {
  return el.tagName.toLowerCase() === 'td'
}

window.demo_aoa_to_sheet = [
  ['Name', 'Value', 'Num', 'Time', '✨Tips'],
  [
    'test001',
    'line1\nline2',
    123,
    new Date(),
    'You can set window.json_to_sheet = [] to generate table!',
  ],
  ['test001', 'line1\n\nline3', -1, new Date(), 'window.json_to_sheet'],
]

window.demo_json_to_sheet = [
  {
    region: 'DE',
    product_name: 'Test1',
    code: '123456',
    url: 'http://localhost:8080',
    tips: '✨ You can set window.demo_json_to_sheet = [] to generate table!',
  },
  {
    region: 'FR',
    product_name: 'Test2',
    code: '7890',
    url: 'https://example.com',
    tips: 'window.demo_json_to_sheet',
  },
]

export default defineComponent({
  name: 'ExcelCopyTool',
  components: {
    TabLayout,
    RectSwitch,
    DropdownMenu,
    CommonNavbar,
    FileChooser,
    DropZone,
  },
  setup() {
    const { t: $t } = useI18n()
    const mainStore = useMainStore()

    const importFileChooserRef = ref()
    const tableWrapperElRef = ref()
    const isReady = ref(false)

    const fileRef = shallowRef<File | null>(null)
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
        tableWrapperElRef.value.innerHTML = ''
        return
      }
      console.log('[renderWorkbook]', workbook)
      const html = window.XLSX.utils.sheet_to_html(getWorksheet(workbook))
      tableWrapperElRef.value.innerHTML = html
    }

    const handleImport = async (file: File) => {
      fileRef.value = null
      checkPlugin()
      if (!/\.xlsx$/.test(file.name)) {
        window.$message.error('Only supports reading xlsx format!')
        return
      }
      const reader = new FileReader()
      workbookRef.value = null
      reader.onload = function (e: any) {
        fileRef.value = file
        const data = e.target.result
        sheetNameIndex.value = 0
        workbookRef.value = window.XLSX.read(data, { type: 'binary' })
        renderWorkbook()
      }
      reader.readAsBinaryString(file)
    }

    const isTrimEmptyLines = ref(true)

    const initXLSX = async () => {
      if (window.XLSX) {
        isReady.value = true
        return
      }
      try {
        await dynamicLoadScript(`${import.meta.env.BASE_URL}lib/xlsx.mini.js`)
      }
      catch (err: any) {
        window.$message.error(err.message)
        console.error(err)
      }
      // window.$message.success('XLSX Ready!')
      console.log('XLSX ready', window.XLSX)
      isReady.value = true
    }

    onMounted(async () => {
      await initXLSX()
    })

    const copyMode = useStorage(
      LS_SettingsKey.EXCEL_COPY_TOOL_COPY_MODE,
      TextConvertMode.HTML,
      localStorage,
      {
        listenToStorageChanges: false,
      },
    )
    const handleClick = (event: MouseEvent) => {
      const el = event.target as HTMLElement
      if (!isAllowedElement(el) || !copyMode.value || copyMode.value === TextConvertMode.DISABLED) {
        return
      }

      if (!el.innerText) {
        return
      }
      let text: string = el.innerText

      console.log(copyMode.value)

      let tip = ''
      if (event.ctrlKey && event.altKey) {
        text = textConvertMultipleLine(text, (tip = TextConvertMode.JSON))
      }
      else if (event.ctrlKey) {
        text = textConvertMultipleLine(text, (tip = TextConvertMode.TEXT))
      }
      else if (event.altKey) {
        text = textConvertMultipleLine(text, (tip = TextConvertMode.HTML))
      }
      else {
        text = textConvertMultipleLine(text, (tip = copyMode.value as TextConvertMode))
      }
      copyToClipboard(text)
      window.$message.success(`${tip} ${$t('msgs.copy_success')}`)

      const range = document.createRange()
      range.selectNode(el)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }

    // 获取excel表格json数据
    const getSheetsJson = ({ currentOnly = false } = {}) => {
      // 使用文本转换器自动转换
      const formatArr = (arr) => {
        const mode = copyMode.value as TextConvertMode
        if (mode === TextConvertMode.DISABLED || mode === TextConvertMode.TEXT) {
          return arr
        }
        return arr.map((obj) => {
          for (const key in obj) {
            if (typeof obj[key] === 'string') {
              obj[key] = textConvertMultipleLine(obj[key], mode)
            }
          }
          return obj
        })
      }

      if (!workbookRef.value) {
        const str = 'Please open Excel file first!'
        window.$message.error(str)
        throw new Error(str)
      }

      if (currentOnly) {
        const roa = window.XLSX.utils.sheet_to_json(getWorksheet(workbookRef.value))
        return formatArr(roa)
      }

      const workbook = workbookRef.value
      const result = {}
      workbook.SheetNames.forEach((sheetName) => {
        const roa = window.XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
        if (roa.length > 0) {
          result[sheetName] = formatArr(roa)
        }
      })
      return result
    }

    const handleExport = async (options = {}) => {
      const json = getSheetsJson(options)

      // 处理文件名
      let name = fileRef.value?.name
      if (name) {
        name = name.substring(0, name.lastIndexOf('.'))
      }

      handleExportFile(
        await promptGetFileName(name, 'excel_sheet_export'),
        JSON.stringify(json, null, 2),
        '.json',
      )
    }
    useSaveShortcut(async () => {
      await handleExport()
    })

    const loadDemo = () => {
      checkPlugin()
      const sheet1 = window.XLSX.utils.aoa_to_sheet(window.demo_aoa_to_sheet)
      const sheet2 = window.XLSX.utils.json_to_sheet(window.demo_json_to_sheet)
      const wb = window.XLSX.utils.book_new()
      window.XLSX.utils.book_append_sheet(wb, sheet1, 'aoa_to_sheet')
      window.XLSX.utils.book_append_sheet(wb, sheet2, 'json_to_sheet')

      sheetNameIndex.value = 0
      workbookRef.value = wb
      renderWorkbook()
    }
    const dropdownMenuOptions = [
      {
        label: '🧩 Current Sheet',
        children: [
          {
            label: '📤 Export JSON',
            props: {
              onClick: async () => {
                await handleExport({ currentOnly: true })
              },
            },
          },
          {
            label: '📋 Copy JSON',
            props: {
              onClick: async () => {
                const json = getSheetsJson({ currentOnly: true })
                await copyToClipboard(JSON.stringify(json, null, 2))
                window.$message.success('Sheet JSON Copied!')
              },
            },
          },
          {
            label: '💻 Print to Console',
            props: {
              onClick: async () => {
                const json = getSheetsJson({ currentOnly: true })
                console.log(json)
                window.$message.success('Print to Console!')
              },
            },
          },
        ],
      },
      {
        label: '📗 All Sheets',
        children: [
          {
            label: '📤 Export All JSON',
            props: {
              onClick: async () => {
                await handleExport()
              },
            },
          },
          {
            label: '📋 Copy All JSON',
            props: {
              onClick: async () => {
                const json = getSheetsJson()
                await copyToClipboard(JSON.stringify(json, null, 2))
                window.$message.success('Sheet JSON Copied!')
              },
            },
          },
          {
            label: '💻 Print All to Console',
            props: {
              onClick: async () => {
                const json = getSheetsJson()
                console.log(json)
                window.$message.success('Print to Console!')
              },
            },
          },
        ],
      },
    ]

    const handleCloseFile = () => {
      fileRef.value = null
      workbookRef.value = null
      sheetNames.value = []
      sheetNameIndex.value = 0
      tableWrapperElRef.value.innerHTML = ''
    }

    onBeforeUnmount(() => {
      handleCloseFile()
    })

    return {
      sheetNames,
      sheetNameIndex,
      handleImport,
      importFileChooserRef,
      loadDemo,
      tableWrapperElRef,
      handleClick,
      copyMode,
      modTextConvertOptions: computed(() => {
        return [{ label: 'Disabled', value: TextConvertMode.DISABLED }, ...TextConvertOptions]
      }),
      dropdownMenuOptions,
      textConvertMultipleLine,
      ...useFileDrop({
        cbFiles: (files) => {
          if (!files.length) {
            return
          }
          handleImport(files[0])
        },
      }),
      isTrimEmptyLines,
      mainStore,
      isReady,
      workbookRef,
      fileRef,
      handleCloseFile,
    }
  },
  computed: {
    GlobalEvents() {
      return GlobalEvents
    },
    globalEventBus() {
      return globalEventBus
    },
  },
})
</script>

<template>
  <div
    class="excel-copy-tool"
    @dragover.prevent.stop="fileDragover"
    @dragleave.prevent.stop="showDropzone = false"
    @drop.prevent.stop="fileDrop"
  >
    <transition name="fade">
      <DropZone v-show="showDropzone" position-fixed text="Drop Excel file here" />
    </transition>

    <div v-loading="!isReady">
      <CommonNavbar>
        <template #extra>
          <div class="flex-row-center-gap">
            <div class="flex-row-center-gap">
              <el-checkbox v-model="isTrimEmptyLines" size="small">
                {{ $t('msgs.trim_empty_lines') }}
              </el-checkbox>
              <a @click="globalEventBus.emit(GlobalEvents.OPEN_TEXT_TRANSFORMER)">
                {{ $t('common.text_transformer') }}:
              </a>
              <RectSwitch v-model="copyMode" size="small" :options="modTextConvertOptions" />
            </div>

            <DropdownMenu v-if="workbookRef" :options="dropdownMenuOptions" :disabled="!isReady">
              <button class="vgo-button">
                <span class="mdi mdi-download" />
                {{ $t('actions.export') }}
              </button>
            </DropdownMenu>

            <button
              v-if="!fileRef"
              :disabled="!isReady"
              class="vgo-button primary"
              @click="importFileChooserRef.chooseFile()"
            >
              {{ `${$t('actions.open')} Excel` }}
            </button>

            <button v-else class="vgo-button primary" @click="handleCloseFile">
              {{ $t('actions.close') }}
            </button>

            <button v-if="!fileRef" class="vgo-button" :disabled="!isReady" @click="loadDemo">
              {{ $t('common.demo') }}
            </button>
          </div>
        </template>
      </CommonNavbar>

      <div v-if="isReady && sheetNames.length" class="sheet-name-card vgo-panel">
        <el-tabs v-model="sheetNameIndex" type="card">
          <el-tab-pane v-for="(item, index) in sheetNames" :key="index" :label="item" :name="index" />
        </el-tabs>
      </div>
    </div>
    <div ref="tableWrapperElRef" class="excel-table-container vgo-panel" @click="handleClick" />

    <FileChooser
      ref="importFileChooserRef"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      @selected="handleImport"
    />
  </div>
</template>

<style lang="scss">
.excel-copy-tool {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;

  .sheet-name-card {
    .el-tabs__header {
      margin-bottom: 0px;
    }
    .el-tabs__content {
      padding: 0;
    }
  }

  .excel-table-container {
    position: relative;
    z-index: 1;
    width: 100%;
    overflow: auto;
    flex: 1;
    border-radius: 0 !important;

    table {
      border-collapse: collapse;
    }

    td {
      height: 25px;
      padding: 5px 10px;
      min-width: 100px;
      vertical-align: baseline;
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
