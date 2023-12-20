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
import {ComponentData, ComponentExportData} from '@/enum/page-craft/block'
import {useCompStorage} from '@/hooks/use-component-storage'
import {useMainStore} from '@/store/main'
import {UndoRedo} from '@/utils/undo-redo'
import {sassToCSS} from '@/utils/css'
import {useSettingsStore} from '@/store/settings'
import {useI18n} from 'vue-i18n'
import {useBeforeUnload, useSaveShortcut} from '@/hooks/use-beforeunload'
import {useSfxBass, useSfxBell, useSfxFill, useSfxGuitar} from '@/hooks/use-sfx'

export const useMcMain = (options) => {
  const {t: $t} = useI18n()
  const {mainCanvasRef, emit} = options
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()
  const fileChooserRef = ref()
  const isShowImportDialog = ref(false)
  const {loadCurCompHtml, saveCurCompHtml, saveCurCompStyle, loadCurCompStyle} = useCompStorage()
  const undoRedo = ref(new UndoRedo(10))

  useBeforeUnload(() => {
    return undoRedo.value.getCount() > 0
  })
  const {play: playSfxBell} = useSfxBell()
  const {play: sfxFill} = useSfxFill()

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
    playSfxBell()
  }

  const handleImportJson = (data) => {
    const {html = '', style = ''} = new ComponentExportData(data)
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
    sfxFill()
  }

  const getEntityData = async (): Promise<ComponentExportData> => {
    await syncStorageData()
    const html = loadCurCompHtml() || ''
    const style = loadCurCompStyle()

    return new ComponentExportData({
      name: settingsStore.curCompoName,
      html: formatHtml(html),
      style: formatCss(style),
    })
  }

  const handleImportHtml = (html: string) => {
    recordUndo()
    setMainCanvasHtml(html)
    saveData()
    sfxFill()
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
          await handleExportJson(await getEntityData())
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
              await handleExportVue(await getEntityData())
            },
          },
        },
        {
          label: `💚 ${$t('actions.export')} Vue 3 SFC`,
          props: {
            onClick: async () => {
              await handleExportVue(await getEntityData(), 3)
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

  useSaveShortcut(async () => {
    handleExportHtml(await getEntityData())
  })

  // record html before action
  const recordUndo = () => {
    const innerHTML = mainCanvasRef.value.innerHTML
    undoRedo.value.recordUndo(innerHTML)
  }
  const {play: playSfxGuitar} = useSfxGuitar()
  const {play: playSfxBass} = useSfxBass()
  const handleUndo = () => {
    if (!undoRedo.value.undoStack.length) {
      return
    }
    playSfxGuitar()
    const innerHTML = mainCanvasRef.value.innerHTML
    const html = undoRedo.value.undo(innerHTML)
    setMainCanvasHtml(html)
    saveData()
  }

  const handleRedo = () => {
    if (!undoRedo.value.redoStack.length) {
      return
    }
    playSfxBass()
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
