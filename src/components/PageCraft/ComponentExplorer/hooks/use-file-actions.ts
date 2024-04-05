import {showInputPrompt} from '@/components/CommonUI/input-prompt'
import moment from 'moment/moment'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {IEntry} from '@/components/FileManager/types/filesystem'
import {normalizePath} from '@/components/FileManager/utils'
import {fsWebApi} from '@/components/FileManager/utils/api'
import {useComponentManage} from '@/components/PageCraft/ComponentExplorer/hooks/use-component-manage'
import {useI18n} from 'vue-i18n'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useSettingsStore} from '@/store/settings'
import {
  IComponentExportData,
  IComponentItem,
  regComponentV2,
} from '@/components/PageCraft/ComponentExplorer/enum'
import {promptGetFileName} from '@/utils/exporter'

export const useComponentFileActions = ({
  isLoading,
  selectedPaths,
  basePath,
  selectedItems,
  enablePaste,
  handlePaste,
  handleCut,
  handleCopy,
  selectedItemsSet,
  files,
  emit,
}) => {
  const {t: $t} = useI18n()
  const settingsStore = useSettingsStore()

  const {
    handleCreateComponent,
    importComponentAllJson,
    exportComponentAllJson,
    exportComponentJson,
  } = useComponentManage({
    isLoading,
    files,
    basePath,
    emit,
  })

  const handleCreateFolder = async () => {
    try {
      const name = await showInputPrompt({
        title: 'Create Folder',
        value: `folder_${moment(new Date()).format('YYYYMMDD_HHmmss')}`,
      })
      isLoading.value = true
      await fsWebApi.createDir({path: normalizePath(basePath.value + '/' + name)})
      emit('refresh')
    } finally {
      isLoading.value = false
    }
  }

  const handleRename = async () => {
    try {
      const item: IEntry = selectedItems.value[0]
      const name = await showInputPrompt({
        title: 'Rename',
        value: item.name,
      })
      isLoading.value = true
      await fsWebApi.renameEntry({
        fromPath: normalizePath(basePath.value + '/' + item.name),
        toPath: normalizePath(basePath.value + '/' + name),
      })
      emit('refresh')
    } finally {
      isLoading.value = false
    }
  }
  const doDeleteSelected = async () => {
    try {
      isLoading.value = true

      await fsWebApi.deleteEntry({
        path: selectedPaths.value,
      })
    } finally {
      isLoading.value = false
      emit('refresh')
    }
  }
  const confirmDelete = () => {
    window.$dialog.warning({
      title: $t('actions.confirm'),
      content: $t('msgs.are_you_sure_to_dele') + ` component(s) ?`,
      positiveText: $t('actions.ok'),
      negativeText: $t('actions.cancel'),
      onPositiveClick: () => {
        doDeleteSelected()
      },
      onNegativeClick: () => {},
    })
  }

  // 取消选择当前组件（回到默认画板）
  const cancelSelectComponent = () => {
    settingsStore.curCompInStore = null
  }

  // 导入预设组件
  const doAppendPresetComponents = async () => {
    try {
      isLoading.value = true
      const res = await fetch('./preset-components.json')
      const data = await res.json()
      await importComponentAllJson(data)
    } finally {
      isLoading.value = false
      emit('refresh')
    }
  }

  // 导入所有json
  const doImportAll = async () => {
    try {
      isLoading.value = true
      const list = await window.$mcUtils.handleImportJson()
      await importComponentAllJson(list)
      window.$message.success('Import success!')
      emit('refresh')
    } finally {
      isLoading.value = false
    }
  }

  // 添加预设组件
  const confirmAppendPreset = () => {
    if (!files.value.length) {
      doAppendPresetComponents()
      return
    }
    window.$dialog.warning({
      title: $t('actions.confirm'),
      content: `This action will override same name component, continue?`,
      positiveText: $t('actions.ok'),
      negativeText: $t('actions.cancel'),
      onPositiveClick: () => {
        doAppendPresetComponents()
      },
      onNegativeClick: () => {},
    })
  }

  // 创建组件副本
  const duplicateComponent = async (item: IComponentItem) => {
    try {
      isLoading.value = true

      const fromPath = normalizePath(basePath.value + '/' + item.name)
      const toPathAbs = normalizePath(
        basePath.value + '/' + item.name.replace(regComponentV2, '') + '-1.comp'
      )

      await fsWebApi.copyPaste({
        fromPaths: [fromPath],
        toPathAbs,
      })
      emit('refresh')
    } finally {
      isLoading.value = false
    }
  }

  const exportSingleComponent = async (item: IComponentItem) => {
    const exportFileName = await promptGetFileName('', item.name)
    if (!exportFileName) {
      return
    }

    const res: IComponentExportData[] = [await exportComponentJson(item)]

    window.$mcUtils.handleExportFile(exportFileName, JSON.stringify(res, null, 2), '.json')
  }

  const ctxMenuOptions = computed((): QuickOptionItem[] => {
    if (!selectedItems.value.length) {
      return [
        {label: `➕ ${$t('actions.add_component')}`, props: {onClick: handleCreateComponent}},
        {label: `➕ Create Folder`, props: {onClick: handleCreateFolder}},
        {label: 'Refresh', props: {onClick: () => emit('refresh')}},
        {label: 'Paste', props: {onClick: handlePaste}, disabled: !enablePaste.value},
        {split: true},
        {
          label: `📥 ${$t('actions.import')} ${$t('common.all_components')} (JSON)`,
          props: {
            onClick: () => {
              doImportAll()
            },
          },
        },
        {
          label: `📤 ${$t('actions.export')} ${$t('common.all_components')} (JSON)`,
          props: {
            onClick: async () => {
              const list = files.value.filter((item: IComponentItem) => {
                return !!item.meta
              })

              if (!list.length) {
                return
              }

              await exportComponentAllJson(list)
            },
          },
        },
        {split: true},
        {
          label: '📥 Append Preset',
          props: {
            onClick: () => {
              confirmAppendPreset()
            },
          },
        },
        {
          label: '🔰 ' + $t('common.default_board'),
          props: {
            onClick: async () => {
              cancelSelectComponent()
            },
          },
        },
      ]
    }
    const isSingle = selectedItems.value.length === 1
    const isComponent = isSingle && !!selectedItems.value[0].meta
    // @ts-ignore
    return [
      isSingle && {
        label: 'Open',
        props: {
          onClick: () => {
            return emit('open', selectedItems.value[0])
          },
        },
      },

      isComponent && {
        label: '👀 ' + $t('actions.preview'),
        props: {
          onClick: async () => {
            globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW)
          },
        },
      },
      {split: true},
      {
        label: `✂️ ${$t('actions.cut')}`,
        props: {onClick: handleCut},
      },
      {
        label: `📄 ${$t('actions.copy')}`,
        props: {onClick: handleCopy},
      },
      isComponent && {
        label: `📄 ${$t('actions.duplicate')}`,
        props: {
          onClick: () => {
            duplicateComponent(selectedItems.value[0])
          },
        },
      },
      // 导出单个组件
      isComponent && {
        label: `📤 ${$t('actions.export')} JSON`,
        props: {
          onClick: () => {
            exportSingleComponent(selectedItems.value[0])
          },
        },
      },
      {split: true},
      isSingle && {label: '✏️ ' + $t('actions.rename'), props: {onClick: handleRename}},
      {label: '❌ ' + $t('actions.delete'), props: {onClick: confirmDelete}},
    ].filter(Boolean)
  })
  const ctxMenuRef = ref()
  const handleShowCtxMenu = (item: IEntry | null, event: MouseEvent) => {
    if (!item) {
      selectedItems.value = []
    } else {
      if (!selectedItemsSet.value.has(item)) {
        selectedItems.value = [item]
      }
    }
    ctxMenuRef.value.isShow = false
    setTimeout(() => {
      ctxMenuRef.value.showMenu(event)
    })
  }

  const enableAction = computed(() => {
    return selectedItems.value.length > 0
  })

  // 拖拽组件开始
  const handleDragStart = async ({item, event}) => {
    if (!regComponentV2.test(item.name)) {
      return false
    }
    // 不支持异步方法，所以使用全局变量
    // event.dataTransfer.setData('data-component', '111')
    window.$draggingComponentExportData = await exportComponentJson(item)
  }

  return {
    handleCreateFolder,
    handleRename,
    doDeleteSelected,
    confirmDelete,
    ctxMenuOptions,
    ctxMenuRef,
    handleShowCtxMenu,
    enableAction,
    handleCreateComponent,
    handleDragStart,
  }
}
