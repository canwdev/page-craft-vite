import type { QuickOptionItem } from '@canwdev/vgo-ui/src/components/QuickOptions/enum'
import type { IEntry } from '@/components/FileManager/types/filesystem'
import type {
  IComponentExportData,
  IComponentItem,
  IComponentMeta,
} from '@/components/PageCraft/ComponentExplorer/enum'
import moment from 'moment/moment'
import { useI18n } from 'vue-i18n'
import { normalizePath } from '@/components/FileManager/utils'
import { fsWebApi } from '@/components/FileManager/utils/api'
import { findHandleByPath } from '@/components/FileManager/utils/providers/opfs-utils'
import {
  regComponentV2,
} from '@/components/PageCraft/ComponentExplorer/enum'
import {
  createFile,
  useComponentManage,
} from '@/components/PageCraft/ComponentExplorer/hooks/use-component-manage'
import { useComponentCover } from '@/components/PageCraft/ComponentExplorer/hooks/use-cover'
import {
  chooseDirectoryAndImport,
  chooseFilesAndImport,
  chooseZipFileAndImport,
  exportZip,
} from '@/components/PageCraft/ComponentExplorer/utils/zip-export'
import { useSettingsStore } from '@/store/settings'
import { guid } from '@/utils'
import globalEventBus, { GlobalEvents } from '@/utils/global-event-bus'
import { promptGetFileName } from '@/utils/mc-utils/io'

export function useComponentFileActions({
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
}) {
  const { t: $t } = useI18n()
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

  // 检查文件名是否重复
  const checkNameExist = (name) => {
    if (files.value.some(f => f.name === name)) {
      window.$message.error('Filename already exists, please rename it!')
      return true
    }
  }

  const handleCreateFolder = async () => {
    try {
      const name = await window.$mcUtils.showInputPrompt({
        title: 'Create Folder',
        value: `folder_${moment(new Date()).format('YYYYMMDD_HHmmss')}`,
      })
      if (checkNameExist(name)) {
        return
      }
      isLoading.value = true
      await fsWebApi.createDir({ path: normalizePath(`${basePath.value}/${name}`) })
      emit('refresh')
    }
    finally {
      isLoading.value = false
    }
  }

  const handleRename = async () => {
    try {
      const item: IEntry = selectedItems.value[0]
      const name = await window.$mcUtils.showInputPrompt({
        title: $t('actions.rename'),
        value: item.name,
      })
      if (checkNameExist(name)) {
        return
      }

      isLoading.value = true
      await fsWebApi.renameEntry({
        fromPath: normalizePath(`${basePath.value}/${item.name}`),
        toPath: normalizePath(`${basePath.value}/${name}`),
      })
      emit('refresh')
    }
    finally {
      isLoading.value = false
    }
  }
  const doDeleteSelected = async () => {
    try {
      isLoading.value = true

      await fsWebApi.deleteEntry({
        path: selectedPaths.value,
      })
    }
    finally {
      isLoading.value = false
      emit('refresh')
    }
  }
  const confirmDelete = () => {
    window.$dialog
      .confirm(`${$t('msgs.are_you_sure_to_dele')} component(s) ?`, $t('actions.confirm'), {
        type: 'warning',
      })
      .then(() => {
        doDeleteSelected()
      })
      .catch()
  }

  // 取消选择当前组件（回到默认画板）
  const cancelSelectComponent = () => {
    settingsStore.curCompInStore = null
  }

  // 导入预设组件
  const doAppendPresetComponents = async () => {
    try {
      isLoading.value = true
      const res = await fetch('./resources/preset-components.json')
      const data = await res.json()
      await importComponentAllJson(data)
    }
    finally {
      isLoading.value = false
      emit('refresh')
    }
  }

  // 导入所有json
  const doImportAll = async () => {
    try {
      const list = await window.$mcUtils.handleImportJson()
      isLoading.value = true
      await importComponentAllJson(list)
      window.$message.success('Import success!')
      emit('refresh')
    }
    finally {
      isLoading.value = false
    }
  }

  // 添加预设组件
  const confirmAppendPreset = () => {
    if (!files.value.length) {
      doAppendPresetComponents()
      return
    }
    window.$dialog
      .confirm(`This action will override same name component, continue?`, $t('actions.confirm'), {
        type: 'warning',
      })
      .then(() => {
        doAppendPresetComponents()
      })
      .catch()
  }

  // 创建组件副本
  const duplicateComponent = async (item: IComponentItem) => {
    try {
      const name = await window.$mcUtils.showInputPrompt({
        title: $t('actions.duplicate'),
        value: `${item.name.replace(regComponentV2, '')}-1.comp`,
      })
      if (checkNameExist(name)) {
        return
      }
      isLoading.value = true

      const fromPath = normalizePath(`${basePath.value}/${item.name}`)
      const toPathAbs = normalizePath(`${basePath.value}/${name}`)

      await fsWebApi.copyPaste({
        fromPaths: [fromPath],
        toPathAbs,
      })

      const id = guid()
      const meta: IComponentMeta = {
        ...item.meta,
        id,
        timeCreated: Date.now(),
      }

      // 更新guid
      await createFile(toPathAbs, 'index.json', JSON.stringify(meta))

      emit('refresh')

      setTimeout(() => {
        // 设置当前选中的组件
        document.querySelector(`.mc-comp-item[data-name="${name}"]`)?.click()
      }, 100)
    }
    finally {
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
  } = useComponentCover({ exportComponentJson })

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
        { label: `➕ ${$t('actions.add_component')}`, props: { onClick: handleCreateComponent } },
        { label: `📁 Create Folder`, props: { onClick: handleCreateFolder } },
        { label: '🔃 Refresh', props: { onClick: () => emit('refresh') } },
        { label: '📋 Paste', props: { onClick: handlePaste }, disabled: !enablePaste.value },
        { split: true },
        {
          label: `🗃️ ${$t('actions.import')}/${$t('actions.export')}`,
          children: [
            {
              label: `📥 ${$t('actions.import')} ${$t('common.all_components')} JSON (Flat)`,
              props: {
                onClick: () => {
                  doImportAll()
                },
              },
            },
            {
              label: `📤 ${$t('actions.export')} ${$t('common.all_components')} JSON (Flat)`,
              props: {
                onClick: async () => {
                  await exportComponentAllJson(components)
                },
              },
              disabled: !components.length,
            },
            { split: true },
            {
              label: `🗜️ ${$t('actions.import')} Current Folder Zip (Recursive)`,
              props: {
                onClick: async () => {
                  try {
                    isLoading.value = true
                    await chooseZipFileAndImport(fsWebApi.getRoot(), basePath.value)
                    emit('refresh')
                  }
                  finally {
                    isLoading.value = false
                  }
                },
              },
            },
            {
              label: `📂 ${$t('actions.import')} Folder (Recursive)`,
              props: {
                onClick: async () => {
                  try {
                    isLoading.value = true
                    await chooseDirectoryAndImport(fsWebApi.getRoot(), basePath.value)
                    emit('refresh')
                  }
                  finally {
                    isLoading.value = false
                  }
                },
              },
            },
            {
              label: `📄 ${$t('actions.import')} Files`,
              props: {
                onClick: async () => {
                  try {
                    isLoading.value = true
                    await chooseFilesAndImport(fsWebApi.getRoot(), basePath.value)
                    emit('refresh')
                  }
                  finally {
                    isLoading.value = false
                  }
                },
              },
            },
            {
              label: `🗜️ ${$t('actions.export')} Current Folder Zip (Recursive)`,
              props: {
                onClick: async () => {
                  try {
                    const handle = await findHandleByPath(
                      fsWebApi.getRoot(),
                      basePath.value,
                      'directory',
                    )
                    if (!handle) {
                      console.error('handle not found')
                      return
                    }
                    await exportZip(handle as FileSystemDirectoryHandle)
                  }
                  finally {
                    isLoading.value = false
                  }
                },
              },
            },
          ],
        },
        { split: true },
        {
          label: '📥 Append Preset',
          props: {
            onClick: () => {
              confirmAppendPreset()
            },
          },
        },
        {
          label: `🔰 ${$t('common.default_board')}`,
          props: {
            class: !settingsStore.curCompInStore ? 'active' : '',
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
    let isCurrentComp = false
    if (settingsStore.curCompInStore) {
      const sid = settingsStore.curCompInStore.id
      isCurrentComp
        = (isComponent && item.meta.id === sid) || !!components.find(i => i.meta.id === sid)
    }

    // 选择文件菜单项
    // @ts-ignore
    return [
      isSingle && {
        label: '📂 Open',
        props: {
          onClick: () => {
            return emit('open', item)
          },
        },
      },

      // 预览
      isComponent && {
        label: `👀 ${$t('actions.preview')}`,
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
      { split: true },
      {
        label: `✂️ ${$t('actions.cut')}`,
        props: { onClick: handleCut },
        disabled: isCurrentComp,
      },
      {
        label: `📄 ${$t('actions.copy')}`,
        props: { onClick: handleCopy },
      },
      isComponent && {
        label: `📄 ${$t('actions.duplicate')}...`,
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
      { split: true },
      isSingle && {
        label: `✏️ ${$t('actions.rename')}`,
        props: { onClick: handleRename },
        disabled: isCurrentComp,
      },
      {
        label: `❌ ${$t('actions.delete')}`,
        props: { onClick: confirmDelete },
        disabled: isCurrentComp,
      },
      isCurrentComp && {
        html: `<div style="font-size: 12px; max-width: 150px; word-break: break-word">${$t(
          'msgs.bu_fen_xuan_xiang_bu',
        )}</div>`,
        disabled: true,
      },
    ].filter(Boolean)
  })
  const ctxMenuRef = ref()
  const handleShowCtxMenu = (item: IEntry | undefined | null, event: MouseEvent) => {
    if (item !== null) {
      if (item === undefined) {
        selectedItems.value = []
      }
      else {
        if (!selectedItemsSet.value.has(item)) {
          selectedItems.value = [item]
        }
      }
    }
    ctxMenuRef.value.showMenu(event)
  }

  const enableAction = computed(() => {
    return selectedItems.value.length > 0
  })

  // 拖拽组件开始
  const handleDragStart = async ({ item, event }) => {
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
