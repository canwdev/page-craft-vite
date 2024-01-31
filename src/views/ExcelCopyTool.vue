<script lang="ts">
import {defineComponent, ref} from 'vue'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import dynamicLoadScript from '@/utils/dynamic-load-script'
import iconExcel from '../assets/textures/excel.svg?url'
import {copyToClipboard} from '@/utils'
import {promptGetFileName, handleExportFile} from '@/utils/exporter'
import DropZone from '@/components/CommonUI/DropZone.vue'
import {useFileDrop} from '@/hooks/use-file-drop'
import {useMetaTitle} from '@/hooks/use-meta'
import {
  TextConvertMode,
  TextConvertOptions,
  textConvertMultipleLine,
} from '@/components/VueI18nEditTool/copy-enum'
import {useSaveShortcut} from '@/hooks/use-beforeunload'
import {useMainStore} from '@/store/main'
import {useI18n} from 'vue-i18n'

const isAllowedElement = (el) => {
  return el.tagName.toLowerCase() === 'td'
}

export default defineComponent({
  name: 'ExcelCopyTool',
  components: {
    FileChooser,
    DropZone,
  },
  setup() {
    const {t: $t} = useI18n()
    const mainStore = useMainStore()

    const importFileChooserRef = ref()
    const tableWrapperElRef = ref()
    const isReady = ref(false)

    const fileRef = shallowRef<File | null>(null)
    const workbookRef = shallowRef()
    const sheetNames = ref<string[]>([])
    const sheetNameIndex = ref(0)

    const {metaTitle} = useMetaTitle()

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
      if (!/\.xlsx$/g.test(file.name)) {
        window.$message.error('Only supports reading xlsx format!')
        return
      }
      const reader = new FileReader()
      workbookRef.value = null
      reader.onload = function (e: any) {
        fileRef.value = file
        const data = e.target.result
        sheetNameIndex.value = 0
        workbookRef.value = window.XLSX.read(data, {type: 'binary'})
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
        await dynamicLoadScript('//unpkg.com/xlsx@0.16.9/xlsx.mini.js')
      } catch (err: any) {
        window.$message.error(err.message)
        console.error(err)
      }
      window.$message.success('XLSX Ready!')
      console.log('XLSX ready', window.XLSX)
      isReady.value = true
    }

    onMounted(async () => {
      await initXLSX()
    })

    const copyMode = ref(TextConvertMode.JSON)
    const handleClick = (event: MouseEvent) => {
      let el = event.target as HTMLElement
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
      } else if (event.ctrlKey) {
        text = textConvertMultipleLine(text, (tip = TextConvertMode.TEXT))
      } else if (event.altKey) {
        text = textConvertMultipleLine(text, (tip = TextConvertMode.HTML))
      } else {
        text = textConvertMultipleLine(text, (tip = copyMode.value))
      }
      copyToClipboard(text)
      window.$message.success(tip + ' ' + $t('msgs.copy_success'))

      const range = document.createRange()
      range.selectNode(el)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }

    const getSheetsJson = ({currentOnly = false} = {}) => {
      if (!workbookRef.value) {
        const str = 'Please open Excel file first!'
        window.$message.error(str)
        throw new Error(str)
      }

      if (currentOnly) {
        return window.XLSX.utils.sheet_to_json(getWorksheet(workbookRef.value))
      }

      const workbook = workbookRef.value
      const result = {}
      workbook.SheetNames.forEach(function (sheetName) {
        const roa = window.XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
        if (roa.length > 0) {
          result[sheetName] = roa
        }
      })
      return result
    }

    const handleExport = async (options = {}) => {
      const json = getSheetsJson(options)

      // 处理文件名
      let name = fileRef.value?.name
      if (name) {
        name = name.substring(0, name.lastIndexOf('.')) + '.json'
      }

      handleExportFile(
        await promptGetFileName(name, 'excel_sheet_export'),
        JSON.stringify(json, null, 2),
        '.json'
      )
    }
    useSaveShortcut(async () => {
      await handleExport()
    })

    const loadDemo = () => {
      checkPlugin()
      const sheet1 = window.XLSX.utils.aoa_to_sheet([
        ['Name', 'Value', 'Num', 'Time'],
        ['test001', 'line1\nline2', 123, new Date()],
        ['test001', 'line1\n\nline3', -1, new Date()],
      ])
      const sheet2 = window.XLSX.utils.aoa_to_sheet([['Name'], ['test002'], ['test002']])
      const wb = window.XLSX.utils.book_new()
      window.XLSX.utils.book_append_sheet(wb, sheet1, 'Sheet1')
      window.XLSX.utils.book_append_sheet(wb, sheet2, 'Sheet2')

      sheetNameIndex.value = 0
      workbookRef.value = wb
      renderWorkbook()
    }
    const dropdownMenuOptions = [
      {
        label: 'Current Sheet',
        children: [
          {
            label: 'Export Current Sheet JSON',
            props: {
              onClick: async () => {
                await handleExport({currentOnly: true})
              },
            },
          },
          {
            label: 'Copy Current Sheet JSON',
            props: {
              onClick: async () => {
                const json = getSheetsJson({currentOnly: true})
                await copyToClipboard(JSON.stringify(json, null, 2))
                window.$message.success('Sheet JSON Copied!')
              },
            },
          },
          {
            label: 'Print Current Sheet to Console',
            props: {
              onClick: async () => {
                const json = getSheetsJson({currentOnly: true})
                console.log(json)
                window.$message.success('Print to Console!')
              },
            },
          },
        ],
      },
      {
        label: 'All Sheets',
        children: [
          {
            label: 'Export All Sheets JSON',
            props: {
              onClick: async () => {
                await handleExport()
              },
            },
          },
          {
            label: 'Copy All Sheets JSON',
            props: {
              onClick: async () => {
                const json = getSheetsJson()
                await copyToClipboard(JSON.stringify(json, null, 2))
                window.$message.success('Sheet JSON Copied!')
              },
            },
          },
          {
            label: 'Print All Sheets to Console',
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
      metaTitle,
      iconExcel,
      sheetNames,
      sheetNameIndex,
      handleImport,
      importFileChooserRef,
      loadDemo,
      tableWrapperElRef,
      handleClick,
      copyMode,
      modTextConvertOptions: computed(() => {
        return [{label: 'Disabled', value: TextConvertMode.DISABLED}, ...TextConvertOptions]
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
})
</script>

<template>
  <div
    class="excel-copy-tool"
    @dragover.prevent.stop="fileDragover"
    @dragleave.prevent.stop="showDropzone = false"
    @drop.prevent.stop="fileDrop"
  >
    <transition name="mc-fade">
      <DropZone position-fixed v-show="showDropzone" text="Drop Excel file here" />
    </transition>

    <div>
      <n-card size="small">
        <n-page-header subtitle="" @back="$router.push({name: 'HomePage'})">
          <template #title> {{ metaTitle }} </template>
          <template #avatar>
            <n-avatar :src="iconExcel" style="background: none" />
          </template>
          <template #extra>
            <n-space>
              <n-space size="small" align="center">
                <n-checkbox size="small" v-model:checked="isTrimEmptyLines">
                  {{ $t('msgs.trim_empty_lines') }}
                </n-checkbox>
                <n-button text @click="mainStore.isShowTextTransformer = true"
                  >{{ $t('common.text_transformer') }}:</n-button
                >
                <n-select
                  size="small"
                  v-model:value="copyMode"
                  :options="modTextConvertOptions"
                  style="width: 100px"
                />
              </n-space>

              <n-button
                v-if="!fileRef"
                type="primary"
                :disabled="!isReady"
                @click="importFileChooserRef.chooseFile()"
                size="small"
              >
                {{ $t('actions.open_excel') }}
              </n-button>

              <n-button v-else type="primary" size="small" @click="handleCloseFile">
                {{ $t('actions.close') }}
              </n-button>

              <n-dropdown
                v-if="workbookRef"
                :options="dropdownMenuOptions"
                placement="bottom-start"
                key-field="label"
                :disabled="!isReady"
              >
                <n-button size="small">{{ $t('actions.export') }}</n-button>
              </n-dropdown>

              <n-button v-if="!fileRef" @click="loadDemo" size="small" :disabled="!isReady">{{
                $t('common.demo')
              }}</n-button>
            </n-space>
          </template>
        </n-page-header>
      </n-card>

      <transition name="mc-fade">
        <div class="mc-loading-container" v-if="!isReady">
          <n-spin />
        </div>
      </transition>

      <n-card v-if="isReady" class="sheet-name-card" size="small">
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
    <div ref="tableWrapperElRef" class="excel-table-container" @click="handleClick"></div>

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
    .n-card__content {
      padding: 5px 5px 0;
    }
  }

  .excel-table-container {
    position: relative;
    z-index: 1;
    background-color: white;
    width: 100%;
    overflow: auto;
    flex: 1;

    table {
      border-collapse: collapse;
    }

    td {
      height: 25px;
      padding: 5px 10px;
      min-width: 100px;
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
