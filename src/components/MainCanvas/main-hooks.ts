import {handleExportJson, handleExportVue, handleReadSelectedFile} from '@/utils/exporter'
import globalEventBus, {GlobalEvents, syncStorageData} from '@/utils/global-event-bus'
import {removeMouseOverDomElementEffect} from '@/components/MainCanvas/interaction-hooks'
import {copyToClipboard} from '@/utils'
import {formatCss, formatHtml} from '@/utils/formater'
import {ExportItem} from '@/enum/block'
import {useCompStorage} from '@/hooks/use-component-storage'
import {useCraftStore} from '@/store/craft'

export const useMcMain = (options) => {
  const {mainCanvasRef} = options
  const craftStore = useCraftStore()
  const fileChooserRef = ref()
  const isShowImportDialog = ref(false)
  const {loadCurCompHtml, saveCurCompHtml, saveCurCompStyle, loadCurCompStyle} = useCompStorage()

  onMounted(() => {
    reloadHtml()
    globalEventBus.on(GlobalEvents.SYNC_STORAGE_DATA, saveData)
    globalEventBus.on(GlobalEvents.IMPORT_SUCCESS, reloadHtml)
  })
  onBeforeUnmount(() => {
    globalEventBus.off(GlobalEvents.SYNC_STORAGE_DATA, saveData)
    globalEventBus.off(GlobalEvents.IMPORT_SUCCESS, reloadHtml)
  })

  const copyHtml = (el?) => {
    removeMouseOverDomElementEffect()
    const html = el ? el.outerHTML : mainCanvasRef.value.innerHTML
    copyToClipboard(formatHtml(html))
    window.$message.success('Copy Success!')

    saveData()
  }

  const handleImportJson = (data) => {
    const {html = '', style = ''} = new ExportItem(data)
    saveCurCompHtml(html)
    saveCurCompStyle(style)
    globalEventBus.emit(GlobalEvents.IMPORT_SUCCESS, style)
    window.$message.success('Import Success!')
  }
  const handleImportJsonSelected = async (file) => {
    const str = await handleReadSelectedFile(file)
    handleImportJson(JSON.parse(str as string))
  }
  const pasteHtmlText = ref('')

  const saveData = (cb?) => {
    removeMouseOverDomElementEffect()
    const innerHTML = mainCanvasRef.value.innerHTML
    saveCurCompHtml(innerHTML)
    if (cb) {
      cb()
    }
  }

  watch(
    () => craftStore.currentComponentName,
    () => {
      reloadHtml()
    }
  )

  const setMainCanvasHtml = (html?: string) => {
    if (mainCanvasRef.value) {
      mainCanvasRef.value.innerHTML = html
    }
  }

  const reloadHtml = () => {
    const html = loadCurCompHtml()
    setMainCanvasHtml(html)
  }

  const getEntityData = async (): Promise<ExportItem> => {
    await syncStorageData()
    const html = loadCurCompHtml() || ''
    const style = loadCurCompStyle()

    return new ExportItem({
      name: craftStore.currentComponentName,
      html: formatHtml(html),
      style: formatCss(style),
    })
  }

  const handleImportHtml = (html: string) => {
    setMainCanvasHtml(html)
    saveData()
  }

  const exportMenuOptions = [
    {
      label: '📥 Import JSON',
      props: {
        onClick: async () => {
          fileChooserRef.value.chooseFile()
        },
      },
    },
    {
      label: '📃 Export JSON',
      props: {
        onClick: async () => {
          handleExportJson(await getEntityData())
        },
      },
    },
    {
      label: '📤 Export',
      children: [
        {
          label: '💚 Export Vue 2 SFC',
          props: {
            onClick: async () => {
              handleExportVue(await getEntityData())
            },
          },
        },
        {
          label: '💚 Export Vue 3 SFC',
          props: {
            onClick: async () => {
              handleExportVue(await getEntityData(), 3)
            },
          },
        },
      ],
    },
    {
      type: 'divider',
      label: 'd0',
    },
    {
      label: '📄 Paste HTML...',
      props: {
        onClick: async () => {
          isShowImportDialog.value = true
        },
      },
    },
    {
      label: '📄 Copy All HTML',
      props: {
        onClick: async () => {
          copyHtml()
        },
      },
    },
    {
      type: 'divider',
      label: 'd1',
    },
    {
      label: '❌ Clear All Code',
      props: {
        onClick: async () => {
          window.$dialog.warning({
            title: 'Confirm',
            content: `Confirm clear all code? this can not be undo!`,
            positiveText: 'OK',
            negativeText: 'Cancel',
            onPositiveClick: () => {
              handleImportHtml('')
              globalEventBus.emit(GlobalEvents.IMPORT_SUCCESS, '')
              window.$message.success('Clear!')
            },
            onNegativeClick: () => {},
          })
        },
      },
    },
  ]

  return {
    exportMenuOptions,
    fileChooserRef,
    isShowImportDialog,
    setMainCanvasHtml,
    pasteHtmlText,
    handleImportHtml,
    handleImportJsonSelected,
    saveData,
    copyHtml,
  }
}
