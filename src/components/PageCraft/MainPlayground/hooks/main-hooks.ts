import type { IComponentExportData } from '@/components/PageCraft/ComponentExplorer/enum'
import { useBeforeUnload, useSaveShortcut } from '@canwdev/vgo-ui/src/hooks/use-beforeunload'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useComponentStorageV2 } from '@/components/PageCraft/ComponentExplorer/hooks/use-component-manage'
import { sassToCSS } from '@/components/StyleEditor/utils/css'
import { beautifyCss, beautifyHtml } from '@/components/StyleEditor/utils/formater'
import { StyleEditorKeys } from '@/enum/settings'
import { useBroadcastMessage } from '@/hooks/use-broadcast-messae'
import { useSfxBass, useSfxBell, useSfxFill, useSfxGuitar } from '@/hooks/use-sfx'
import { useMainStore } from '@/store/main'
import { useSettingsStore } from '@/store/settings'
import { copyToClipboard } from '@/utils'
import { handleExportHtml, handleExportVue } from '@/utils/exporter'
import globalEventBus, { GlobalEvents, syncStorageData } from '@/utils/global-event-bus'
import { UndoRedo } from '@/utils/undo-redo'

export function useMcMain(options) {
  const { t: $t } = useI18n()
  const { mainPlaygroundRef, emit } = options
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()
  const isShowImportDialog = ref(false)
  const { loadCurCompHtml, saveCurCompHtml, saveCurCompStyle, loadCurCompStyle }
    = useComponentStorageV2()
  const undoRedo = ref(new UndoRedo(10))

  useBeforeUnload(() => {
    return undoRedo.value.getCount() > 0
  })
  const { play: playSfxBell } = useSfxBell()
  const { play: sfxFill } = useSfxFill()

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
    const html = el ? el.outerHTML : mainPlaygroundRef.value.innerHTML
    copyToClipboard(beautifyHtml(html))
    window.$message.success($t('msgs.copy_success'))

    saveData()
    playSfxBell()
  }

  const pasteHtmlText = ref('')

  // 保存当前组件的 HTML
  const saveData = async (cb?) => {
    const innerHTML = mainPlaygroundRef.value.innerHTML
    await saveCurCompHtml(innerHTML)
    // 如果开启了多个窗口（iframe)，发送同步状态
    channelRef.value?.postMessage(null)
    if (cb) {
      cb()
    }
  }

  // 用来防止多窗口通信导致的死循环
  const isSelfUpdating = ref(false)
  // 处理多个窗口(iframe)间的状态同步
  const { channelRef } = useBroadcastMessage('mainPlaygroundUpdate', (event) => {
    isSelfUpdating.value = true
    console.log('[mainPlaygroundUpdate]')

    // 强制重新读取数据
    settingsStore.$hydrate({ runHooks: true })
    reloadHtml()
    nextTick(() => {
      isSelfUpdating.value = false
    })
  })

  watch(
    () => settingsStore.curCompInStore,
    () => {
      if (isSelfUpdating.value) {
        console.warn('isSelfUpdating')
        return
      }
      reloadHtml()
      // 如果开启了多个窗口（iframe)，发送同步状态
      channelRef.value?.postMessage(null)
    },
  )

  const setPlaygroundHtml = (html: string = '') => {
    if (mainPlaygroundRef.value) {
      mainPlaygroundRef.value.innerHTML = html
    }
  }

  const reloadHtml = async () => {
    const html = await loadCurCompHtml()
    setPlaygroundHtml(html)
    undoRedo.value.clear()
    sfxFill()
  }

  const variableStyleCode = useStorage(StyleEditorKeys.VARIABLES_STYLE, '')
  const getEntityData = async ({
    // 是否插入scss变量代码
    insertVariableCode = true,
  } = {}) => {
    await syncStorageData()
    const html = (await loadCurCompHtml()) || ''
    let style = await loadCurCompStyle()
    if (insertVariableCode) {
      style = variableStyleCode.value + style
    }

    const res: IComponentExportData = {
      name: settingsStore.curCompInStore?.title || '',
      html: beautifyHtml(html),
      style: beautifyCss(style),
      timestamp: Date.now(),
    }

    return res
  }

  const handleImportHtml = (html: string) => {
    recordUndo()
    setPlaygroundHtml(html)
    saveData()
    sfxFill()
  }

  const htmlMenuOptions = [
    {
      label: `📤 ${$t('actions.export')}`,
      children: [
        {
          label: `💚 ${$t('actions.export')} Vue 2 SFC`,
          props: {
            onClick: async () => {
              await handleExportVue(await getEntityData({ insertVariableCode: false }))
            },
          },
        },
        {
          label: `💚 ${$t('actions.export')} Vue 3 SFC`,
          props: {
            onClick: async () => {
              await handleExportVue(await getEntityData({ insertVariableCode: false }), 3)
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
              handleExportHtml(await getEntityData(), { isInline: true })
            },
          },
        },
        {
          label: `📧 ${$t('actions.export')} Email HTML (With Style Tag)`,
          props: {
            onClick: async () => {
              handleExportHtml(await getEntityData(), { isInline: true, inlineWithStyleTag: true })
            },
          },
        },
      ],
    },
    {
      split: true,
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
      label: `📄 ${$t('actions.copy_compiled_css')}`,
      props: {
        onClick: async () => {
          const style = await loadCurCompStyle()
          const css = beautifyCss(await sassToCSS(style))
          window.$mcUtils.copy(css)
        },
      },
    },

    {
      split: true,
    },
    {
      label: `❌ ${$t('actions.clear_all_html')}`,
      props: {
        onClick: async () => {
          window.$dialog
            .confirm($t('msgs.confirm_clear_curren'), $t('actions.confirm'), {
              type: 'warning',
            })
            .then(() => {
              handleImportHtml('')
              globalEventBus.emit(GlobalEvents.IMPORT_SUCCESS, '')
              window.$message.success(`${$t('actions.done')}!`)
            })
            .catch()
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
  const { play: playSfxGuitar } = useSfxGuitar()
  const { play: playSfxBass } = useSfxBass()
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
    isShowImportDialog,
    setPlaygroundHtml,
    pasteHtmlText,
    handleImportHtml,
    saveData,
    copyHtml,
    undoRedo,
    recordUndo,
    handleUndo,
    handleRedo,
  }
}
