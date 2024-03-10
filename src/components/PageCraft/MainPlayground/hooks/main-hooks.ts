import {
  handleExportHtml,
  handleExportJson,
  handleExportStyle,
  handleExportVue,
  handleReadSelectedFile,
} from '@/utils/exporter'
import globalEventBus, {GlobalEvents, syncStorageData} from '@/utils/global-event-bus'
import {removeMouseOverDomElementEffect} from '@/components/PageCraft/MainPlayground/hooks/interaction-hooks'
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
import {useBroadcastMessage} from '@/hooks/use-broadcast-messae'

export const useMcMain = (options) => {
  const {t: $t} = useI18n()
  const {mainPlaygroundRef, emit} = options
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
    const html = el ? el.outerHTML : mainPlaygroundRef.value.innerHTML
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

  // 保存当前组件的 HTML
  const saveData = (cb?) => {
    removeMouseOverDomElementEffect()
    const innerHTML = mainPlaygroundRef.value.innerHTML
    saveCurCompHtml(innerHTML)
    // 如果开启了多个窗口（iframe)，发送同步状态
    channelRef.value?.postMessage(null)
    if (cb) {
      cb()
    }
  }

  // 用来防止多窗口通信导致的死循环
  const isSelfUpdating = ref(false)
  // 处理多个窗口(iframe)间的状态同步
  const {channelRef} = useBroadcastMessage('mainPlaygroundUpdate', (event) => {
    isSelfUpdating.value = true
    console.log('[mainPlaygroundUpdate]')

    // 强制重新读取数据
    settingsStore.$hydrate({runHooks: true})
    reloadHtml()
    nextTick(() => {
      isSelfUpdating.value = false
    })
  })

  watch(
    () => settingsStore.curCompoName,
    () => {
      if (isSelfUpdating.value) {
        console.warn('isSelfUpdating')
        return
      }
      reloadHtml()
      // 如果开启了多个窗口（iframe)，发送同步状态
      channelRef.value?.postMessage(null)
    }
  )

  const setPlaygroundHtml = (html: string = '') => {
    if (mainPlaygroundRef.value) {
      mainPlaygroundRef.value.innerHTML = html
    }
  }

  const reloadHtml = () => {
    const html = loadCurCompHtml()
    setPlaygroundHtml(html)
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
    setPlaygroundHtml(html)
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
      label: '❌ ' + $t('actions.clear_all_html'),
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
    const innerHTML = mainPlaygroundRef.value.innerHTML
    undoRedo.value.recordUndo(innerHTML)
  }
  const {play: playSfxGuitar} = useSfxGuitar()
  const {play: playSfxBass} = useSfxBass()
  const handleUndo = () => {
    if (!undoRedo.value.undoStack.length) {
      return
    }
    playSfxGuitar()
    const innerHTML = mainPlaygroundRef.value.innerHTML
    const html = undoRedo.value.undo(innerHTML)
    setPlaygroundHtml(html)
    saveData()
  }

  const handleRedo = () => {
    if (!undoRedo.value.redoStack.length) {
      return
    }
    playSfxBass()
    const innerHTML = mainPlaygroundRef.value.innerHTML
    const html = undoRedo.value.redo(innerHTML)
    setPlaygroundHtml(html)
    saveData()
  }

  return {
    htmlMenuOptions,
    fileChooserRef,
    isShowImportDialog,
    setPlaygroundHtml,
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
