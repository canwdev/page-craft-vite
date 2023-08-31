import {
  handleExportHtml,
  handleExportJson,
  handleExportStyle,
  handleExportVue,
  handleReadSelectedFile,
} from '@/utils/exporter'
import globalEventBus, {GlobalEvents, syncStorageData} from '@/utils/global-event-bus'
import {removeMouseOverDomElementEffect} from '@/components/PageCraft/MainCanvas/interaction-hooks'
import {copyToClipboard} from '@/utils'
import {formatCss, formatHtml} from '@/utils/formater'
import {ExportItem} from '@/enum/page-craft/block'
import {useCompStorage} from '@/hooks/use-component-storage'
import {useCraftStore} from '@/store/craft'
import {UndoRedo} from '@/utils/undo-redo'
import {sassToCSS} from '@/utils/css'
import {useSettingsStore} from '@/store/settings'
import {useI18n} from 'vue-i18n'

export const useMcMain = (options) => {
  const {t: $t} = useI18n()
  const {mainCanvasRef, emit} = options
  const craftStore = useCraftStore()
  const settingsStore = useSettingsStore()
  const fileChooserRef = ref()
  const isShowImportDialog = ref(false)
  const {loadCurCompHtml, saveCurCompHtml, saveCurCompStyle, loadCurCompStyle} = useCompStorage()
  const undoRedo = ref(new UndoRedo(10))

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
    window.$message.success($t('msgs.copy_success'))

    saveData()
  }

  const handleImportJson = (data) => {
    const {html = '', style = ''} = new ExportItem(data)
    saveCurCompHtml(html)
    saveCurCompStyle(style)
    globalEventBus.emit(GlobalEvents.IMPORT_SUCCESS, style)
    window.$message.success($t('msgs.import_success'))
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
    () => settingsStore.curCompoName,
    () => {
      reloadHtml()
    }
  )

  const setMainCanvasHtml = (html: string = '') => {
    if (mainCanvasRef.value) {
      mainCanvasRef.value.innerHTML = html
    }
  }

  const reloadHtml = () => {
    const html = loadCurCompHtml()
    setMainCanvasHtml(html)
    undoRedo.value.clear()
  }

  const getEntityData = async (): Promise<ExportItem> => {
    await syncStorageData()
    const html = loadCurCompHtml() || ''
    const style = loadCurCompStyle()

    return new ExportItem({
      name: settingsStore.curCompoName,
      html: formatHtml(html),
      style: formatCss(style),
    })
  }

  const handleImportHtml = (html: string) => {
    recordUndo()
    setMainCanvasHtml(html)
    saveData()
  }

  const htmlMenuOptions = [
    {
      label: `📥 ${$t('actions.import')} JSON`,
      props: {
        onClick: async () => {
          fileChooserRef.value.chooseFile()
        },
      },
    },
    {
      label: `📃 ${$t('actions.export')} JSON`,
      props: {
        onClick: async () => {
          handleExportJson(await getEntityData())
        },
      },
    },
    {
      label: `📤 ${$t('actions.export')}`,
      children: [
        {
          label: `💚 ${$t('actions.export')} Vue 2 SFC`,
          props: {
            onClick: async () => {
              handleExportVue(await getEntityData())
            },
          },
        },
        {
          label: `💚 ${$t('actions.export')} Vue 3 SFC`,
          props: {
            onClick: async () => {
              handleExportVue(await getEntityData(), 3)
            },
          },
        },
        {
          label: `📑 ${$t('actions.export')} HTML`,
          props: {
            onClick: async () => {
              handleExportHtml(await getEntityData())
            },
          },
        },
        {
          label: `📧 ${$t('actions.export')} Email HTML`,
          props: {
            onClick: async () => {
              handleExportHtml(await getEntityData(), {isInline: true})
            },
          },
        },
        {
          label: `📧 ${$t('actions.export')} Email HTML (With Style Tag)`,
          props: {
            onClick: async () => {
              handleExportHtml(await getEntityData(), {isInline: true, inlineWithStyleTag: true})
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
      label: `📄 ${$t('actions.paste')} HTML...`,
      props: {
        onClick: async () => {
          isShowImportDialog.value = true
        },
      },
    },
    {
      label: `📄 ${$t('actions.copy')} HTML`,
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
      label: '❌ ' + $t('actions.clear_all_code'),
      props: {
        onClick: async () => {
          window.$dialog.warning({
            title: $t('actions.confirm'),
            content: $t('msgs.confirm_clear_curren'),
            positiveText: $t('actions.ok'),
            negativeText: $t('actions.cancel'),
            onPositiveClick: () => {
              handleImportHtml('')
              globalEventBus.emit(GlobalEvents.IMPORT_SUCCESS, '')
              window.$message.success($t('actions.done') + '!')
            },
            onNegativeClick: () => {},
          })
        },
      },
    },
  ]

  // record html before action
  const recordUndo = () => {
    const innerHTML = mainCanvasRef.value.innerHTML
    undoRedo.value.recordUndo(innerHTML)
  }

  const handleUndo = () => {
    const innerHTML = mainCanvasRef.value.innerHTML
    const html = undoRedo.value.undo(innerHTML)
    setMainCanvasHtml(html)
    saveData()
  }

  const handleRedo = () => {
    const innerHTML = mainCanvasRef.value.innerHTML
    const html = undoRedo.value.redo(innerHTML)
    setMainCanvasHtml(html)
    saveData()
  }

  return {
    htmlMenuOptions,
    fileChooserRef,
    isShowImportDialog,
    setMainCanvasHtml,
    pasteHtmlText,
    handleImportHtml,
    handleImportJsonSelected,
    saveData,
    copyHtml,
    undoRedo,
    recordUndo,
    handleUndo,
    handleRedo,
  }
}
