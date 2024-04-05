import {showInputPrompt} from '@/components/CommonUI/input-prompt'
import moment from 'moment/moment'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {IEntry} from '@/components/FileManager/types/filesystem'
import {normalizePath} from '@/components/FileManager/utils'
import {fsWebApi} from '@/components/FileManager/utils/api'
import {
  createFile,
  useComponentManage,
} from '@/components/PageCraft/ComponentExplorer/hooks/use-component-manage'
import {useI18n} from 'vue-i18n'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useSettingsStore} from '@/store/settings'
import {
  IComponentExportData,
  IComponentItem,
  IComponentMeta,
  regComponentV2,
} from '@/components/PageCraft/ComponentExplorer/enum'
import {promptGetFileName} from '@/utils/exporter'
import {useComponentCover} from '@/components/PageCraft/ComponentExplorer/hooks/use-cover'
import {guid} from '@/utils'

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

      const meta: IComponentMeta = {
        ...item.meta,
        id: guid(),
        timeCreated: Date.now(),
      }

      // 更新guid
      await createFile(toPathAbs, 'index.json', JSON.stringify(meta))

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

  const {
    getCoverOption,

    // cover params
    isShowImageCropper,
    cropperEditingSrc,
    handleCropperSave,
    handleCropperCancel,
  } = useComponentCover({exportComponentJson})

  // 当前文件夹下选择的组件，如果没有选择，返回所有组件
  const curDirComponents = computed(() => {
    const list = selectedItems.value.length ? selectedItems.value : files.value
    return list.filter((item: IComponentItem) => {
      return regComponentV2.test(item.name)
    })
  })

  const ctxMenuOptions = computed((): QuickOptionItem[] => {
    const components = curDirComponents.value

    // 无选择菜单项
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
              await exportComponentAllJson(components)
            },
          },
          disabled: !components.length,
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
    const item = isSingle ? selectedItems.value[0] : null
    const isComponent = isSingle && !!item.meta
    const isCurrentComp =
      (isComponent && item.meta.id === settingsStore.curCompInStore?.id) ||
      components.find((i) => i.meta.id === settingsStore.curCompInStore?.id)

    // 选择文件菜单项
    // @ts-ignore
    return [
      isSingle && {
        label: 'Open',
        props: {
          onClick: () => {
            return emit('open', item)
          },
        },
      },

      // 预览
      isComponent && {
        label: '👀 ' + $t('actions.preview'),
        props: {
          onClick: async () => {
            globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW, {
              item: await exportComponentJson(item),
            })
          },
        },
      },
      // 封面
      isComponent && getCoverOption(item),
      {split: true},
      {
        label: `✂️ ${$t('actions.cut')}`,
        props: {onClick: handleCut},
        disabled: isCurrentComp,
      },
      {
        label: `📄 ${$t('actions.copy')}`,
        props: {onClick: handleCopy},
      },
      isComponent && {
        label: `📄 ${$t('actions.duplicate')}`,
        props: {
          onClick: () => {
            duplicateComponent(item)
          },
        },
      },
      isComponent
        ? {
            // 导出单个组件
            label: `📤 ${$t('actions.export')} JSON`,
            props: {
              onClick: () => {
                exportSingleComponent(item)
              },
            },
          }
        : components.length
        ? {
            // 导出多选组件
            label: `📤 ${$t('actions.export')} JSON`,
            props: {
              onClick: async () => {
                await exportComponentAllJson(components)
              },
            },
          }
        : null,
      {split: true},
      isSingle && {
        label: '✏️ ' + $t('actions.rename'),
        props: {onClick: handleRename},
        disabled: isCurrentComp,
      },
      {
        label: '❌ ' + $t('actions.delete'),
        props: {onClick: confirmDelete},
        disabled: isCurrentComp,
      },
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

    // cover params
    isShowImageCropper,
    cropperEditingSrc,
    handleCropperSave,
    handleCropperCancel,
  }
}
