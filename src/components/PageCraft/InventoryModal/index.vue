<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {
  actionBlockItemList,
  BlockItem,
  BlockType,
  ComponentExportData,
  createComponentBlockItem,
} from '@/enum/page-craft/block'
import {htmlBlockItemList, TabType} from '@/enum/page-craft/inventory'
import InventoryList from '@/components/PageCraft/InventoryModal/InventoryList.vue'
import {useMainStore} from '@/store/main'
import {saveCompStorage, useCompImportExport, useCompStorage} from '@/hooks/use-component-storage'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import {colorHash, sleep} from '@/utils'
import {useContextMenu} from '@/hooks/use-context-menu'
import {FilterType} from '@/enum/settings'
import {useSettingsStore} from '@/store/settings'
import {
  Add24Regular,
  Star20Regular,
  Star20Filled,
  Box20Regular,
  BoxMultiple20Regular,
  Image20Filled,
  Image20Regular,
  MoreHorizontal20Regular,
  TextSortAscending20Regular,
  Timeline20Regular,
  Window16Regular,
  WindowArrowUp16Regular,
} from '@vicons/fluent'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {useI18n} from 'vue-i18n'
import {fileToBase64, handleReadSelectedFile} from '@/utils/exporter'
import {useSfxPop} from '@/hooks/use-sfx'
import PopFloat from '@/components/PageCraft/DomPreview/PopFloat.vue'
import {takeScreenshot} from '@/utils/screenshot'
import DialogImageCropper from '@/components/CommonUI/DialogImageCropper.vue'
import {showInputPrompt} from '@/components/CommonUI/input-prompt'
import TabLayout from '@/components/CommonUI/TabLayout.vue'
import {NIcon} from 'naive-ui'
import ComponentExplorer from '@/components/PageCraft/ComponentV2/ComponentExplorer.vue'
import * as changeCase from 'change-case'

let idx = 1

export default defineComponent({
  name: 'InventoryModal',
  components: {
    TabLayout,
    DialogImageCropper,
    PopFloat,
    ViewPortWindow,
    InventoryList,
    FileChooser,
    Window16Regular,
    WindowArrowUp16Regular,
    Box20Regular,
    MoreHorizontal20Regular,
    Add24Regular,
    TextSortAscending20Regular,
    Timeline20Regular,
    Image20Filled,
    Image20Regular,
    ComponentExplorer,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onItemClick', 'update:visible'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()
    const {play: playSfxPop} = useSfxPop()

    watch(
      () => settingsStore.inventoryTab,
      () => {
        playSfxPop()
      }
    )

    const {clearCompStorage, renameCompStorage, copyCompStorage, saveCompHtml, saveCompStyle} =
      useCompStorage()

    const handleItemClick = (item: BlockItem) => {
      mainStore.setCurrentBlock(item)
    }

    const {handleExportAllJson, handleImportAllJson, componentList, updateCompMeta} =
      useCompImportExport()
    const importFileChooserRef = ref()
    const handleImportJsonFileSelected = async (file) => {
      const str = await handleReadSelectedFile(file)
      const importList: ComponentExportData[] = JSON.parse(str as string)
      return await handleImportAllJson(importList)
    }

    const isSortByName = ref(false)
    const componentListSorted = computed(() => {
      let list = componentList.value
      const isStared = settingsStore.inventoryFilterType === FilterType.STARED

      if (settingsStore.inventoryFilterType !== FilterType.ALL) {
        list = list.filter((item: BlockItem) => {
          if (isStared) {
            return item.data.stared
          } else {
            return !item.data.stared
          }
        })
      }

      if (isSortByName.value) {
        return list.sort((a, b) => a.title.localeCompare(b.title))
      }
      return list.sort((a, b) => {
        return b.data.timestamp - a.data.timestamp
      })
    })

    const handleComponentItemClick = (item: BlockItem) => {
      settingsStore.curCompPath = item.title
    }

    const cancelSelectComponent = () => {
      settingsStore.curCompPath = ''
    }

    const inputPrompt = (title = '', value = '') => {
      return showInputPrompt({
        title,
        value,
        validateFn: (val) => {
          if (componentList.value.find((item) => item.title === val)) {
            const message = $t('msgs.name_already_exists')
            window.$message.error(message)
            throw new Error(message)
          }
        },
      })
    }

    onMounted(async () => {
      await initComponents()
    })

    const handleCreateComponent = async () => {
      let name = await inputPrompt($t('msgs.please_enter_the_nam'), `Component${idx}`)

      const newItem = createComponentBlockItem(name)
      componentList.value = [newItem, ...componentList.value]
      updateCompMeta(newItem.title, newItem.data)

      // 设置默认HTML、SCSS代码
      const className = changeCase.paramCase(name || 'my-component')
      saveCompHtml(name, `<div class="${className}"></div>`)
      saveCompStyle(name, `.${className} {\n}\n`)

      // 设置当前选中的组件名
      settingsStore.curCompPath = name
      idx++
    }

    const handleDeleteComponent = () => {
      const item = editingNode.value
      window.$dialog.warning({
        title: $t('actions.confirm'),
        content: $t('msgs.are_you_sure_to_dele') + ` ${item.title}?`,
        positiveText: $t('actions.ok'),
        negativeText: $t('actions.cancel'),
        onPositiveClick: () => {
          const index = componentList.value.findIndex((i) => i.id === item.id)
          const list = [...componentList.value]
          list.splice(index, 1)
          componentList.value = list

          // remove local storage
          clearCompStorage(item.title)

          // reset current component name
          if (settingsStore.curCompPath === item.title) {
            settingsStore.curCompPath = ''
          }
        },
        onNegativeClick: () => {},
      })
    }

    const handleComponentDeleteAll = () => {
      window.$dialog.warning({
        title: $t('actions.confirm'),
        content: $t('msgs.sure_to_del_all'),
        positiveText: $t('actions.ok'),
        negativeText: $t('actions.cancel'),
        onPositiveClick: () => {
          settingsStore.curCompPath = ''
          const list = [...componentList.value]
          // 只对当前过滤的列表项进行删除
          componentListSorted.value.forEach((item) => {
            clearCompStorage(item.title)

            // 清空内存中的列表项
            const idx = list.findIndex((i) => i.title === item.title)
            if (idx > -1) {
              list.splice(idx, 1)
            }
          })
          componentList.value = list
        },
        onNegativeClick: () => {},
      })
    }

    const doAppendPresetComponents = async () => {
      const res = await fetch('./preset-components.json')
      const data = await res.json()
      await handleImportAllJson(data)
    }

    const initComponents = async () => {
      if (!settingsStore.isInitialized) {
        // create example component if not initialized
        let length = componentList.value.length
        if (!length) {
          await doAppendPresetComponents()

          // 自动选择最后一项
          setTimeout(() => {
            length = componentList.value.length
            if (componentList.value[length - 1]?.title) {
              settingsStore.curCompPath = componentList.value[length - 1].title
            }
          })
        }
        window.$message.success('Welcome to PageCraft!')
        settingsStore.isInitialized = true
      }
    }

    const confirmAppendPresetComponents = async () => {
      if (!componentList.value.length) {
        await doAppendPresetComponents()
        return
      }
      window.$dialog.warning({
        title: $t('actions.confirm'),
        content: `This action will override same name component, continue?`,
        positiveText: $t('actions.ok'),
        negativeText: $t('actions.cancel'),
        onPositiveClick: async () => {
          await doAppendPresetComponents()
        },
        onNegativeClick: () => {},
      })
    }

    const handleComponentRename = async () => {
      const item = editingNode.value
      const name = await inputPrompt($t('msgs.please_enter_the_nam'), item.title)

      const index = componentList.value.findIndex((i) => i.id === item.id)
      const list = [...componentList.value]
      list.splice(index, 1, item)
      componentList.value = list

      if (item.title === settingsStore.curCompPath) {
        settingsStore.curCompPath = name
      }

      // rename local storage
      renameCompStorage(item.title, name)
      item.title = name
    }

    const handleComponentDuplicate = async () => {
      const item = editingNode.value
      const newName = await inputPrompt($t('msgs.please_input_new_name'), item.title + '-1')

      copyCompStorage(item.title, newName)

      const newItem = createComponentBlockItem(newName, {
        ...item.data,
        timestamp: Date.now(),
      })
      componentList.value = [newItem, ...componentList.value]

      updateCompMeta(newItem.title, newItem.data)
      settingsStore.curCompPath = newName
      idx++
    }

    /*image cropper start*/
    const isShowImageCropper = ref(false)
    const cropperEditingSrc = ref('')
    const cropperCompleteCb = ref<any>(null) // 裁剪完成回调函数
    const cropperCancelCb = ref<any>(null) // 裁剪完成回调函数
    const startCropImage = (options) => {
      const {src = '', onComplete, onCancel} = options

      cropperEditingSrc.value = src
      cropperCompleteCb.value = onComplete
      cropperCancelCb.value = onCancel
      isShowImageCropper.value = true
    }
    const handleCropperSave = (base64url: string) => {
      if (typeof cropperCompleteCb.value === 'function') {
        cropperCompleteCb.value(base64url)
      }
      cropperCleanup()
    }
    const handleCropperCancel = () => {
      if (typeof cropperCancelCb.value === 'function') {
        cropperCompleteCb.value()
      }
      cropperCleanup()
    }
    const cropperCleanup = () => {
      isShowImageCropper.value = false
      cropperEditingSrc.value = ''
      cropperCancelCb.value = null
      cropperCompleteCb.value = null
    }
    /*image cropper end*/

    const getCompMenuOptions = (item: BlockItem) => [
      {
        label: '👀 ' + $t('actions.preview'),
        props: {
          onClick: async () => {
            globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW, {item})
          },
        },
      },
      {
        label: '⭐ Toggle Star',
        props: {
          onClick: async () => {
            nodeAction(item, () => {
              item.data.stared = !item.data.stared
              updateCompMeta(item.title, item.data)
            })
          },
        },
      },
      {
        label: '🖼️ Cover',
        children: [
          {
            label: '🖼️ Capture cover...',
            props: {
              onClick: async () => {
                nodeAction(item, async () => {
                  try {
                    const base64url = await takeScreenshot({
                      async onCaptureStart() {
                        globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW, {item, maximum: true})
                        await sleep(500)
                      },
                      quality: 0.7,
                    })
                    startCropImage({
                      src: base64url,
                      onComplete(newSrc) {
                        item.data.cover = newSrc
                        updateCompMeta(item.title, item.data)
                      },
                    })

                    globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW_CLOSE, {maximum: false})
                  } catch (e) {
                    console.error(e)
                    globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW_CLOSE, {maximum: false})
                  }
                })
              },
            },
          },
          {
            label: '🖼️ Upload cover',
            props: {
              onClick: async () => {
                nodeAction(item, async () => {
                  // @ts-ignore
                  const [handle] = await window.showOpenFilePicker({
                    types: [
                      {
                        description: '🖼️ Cover Image',
                        accept: {
                          'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                        },
                      },
                    ],
                  })
                  const file = await handle.getFile()
                  const base64url = await fileToBase64(file)
                  item.data.cover = base64url
                  updateCompMeta(item.title, item.data)
                })
              },
            },
          },
          item.data.cover && {
            label: '✏️ Edit cover',
            props: {
              onClick: async () => {
                startCropImage({
                  src: item.data.cover,
                  onComplete(newSrc) {
                    item.data.cover = newSrc
                    updateCompMeta(item.title, item.data)
                  },
                })
              },
            },
          },
          item.data.cover && {
            label: '❌ Remove cover',
            props: {
              onClick: async () => {
                nodeAction(item, async () => {
                  item.data.cover = undefined
                  updateCompMeta(item.title, item.data)
                })
              },
            },
          },
        ].filter(Boolean),
      },
      {
        label: '✏️ ' + $t('actions.rename'),
        props: {
          onClick: async () => {
            nodeAction(item, () => {
              handleComponentRename()
            })
          },
        },
      },
      {
        label: '📄 ' + $t('actions.duplicate'),
        props: {
          onClick: async () => {
            nodeAction(item, () => {
              handleComponentDuplicate()
            })
          },
        },
      },
      {
        label: '❌ ' + $t('actions.delete'),
        props: {
          onClick: async () => {
            nodeAction(item, () => {
              handleDeleteComponent()
            })
          },
        },
      },
    ]

    const getAddMenuOptions = () => {
      return [
        {
          label: '🔰 ' + $t('common.default_board'),
          props: {
            onClick: async () => {
              cancelSelectComponent()
            },
          },
        },
        {
          label: '❌ ' + $t('actions.delete_all'),
          props: {
            onClick: async () => {
              handleComponentDeleteAll()
            },
          },
        },
        {
          label: '📥 Append Preset',
          props: {
            onClick: () => {
              confirmAppendPresetComponents()
            },
          },
        },
        {
          type: 'divider',
          label: 'd0',
        },
        {
          label: `📥 ${$t('actions.import')} ${$t('common.all_components')} (JSON)`,
          props: {
            onClick: async () => {
              importFileChooserRef.value.chooseFile()
            },
          },
        },
        {
          label: `📃 ${$t('actions.export')} ${$t('common.all_components')} (JSON)`,
          props: {
            onClick: async () => {
              await handleExportAllJson({list: componentListSorted.value})
            },
          },
        },
        {
          type: 'divider',
          label: 'd1',
        },
        {
          label: '➕ ' + $t('actions.add_component'),
          props: {
            onClick: async () => {
              handleCreateComponent()
            },
          },
        },
      ]
    }

    const {editingNode, nodeAction, handleContextmenu, ...contextMenuEtc} =
      useContextMenu(getCompMenuOptions)

    const componentFilterTabs = [
      {
        title: 'All',
        value: FilterType.ALL,
        render: h(NIcon, {size: 20}, () => h(BoxMultiple20Regular)),
      },
      {
        title: 'Stared',
        value: FilterType.STARED,
        render: h(NIcon, {size: 20}, () => h(Star20Filled)),
      },
      {
        title: 'Not Stared',
        value: FilterType.NOT_STARED,
        icon: h(Star20Regular),
        render: h(NIcon, {size: 20}, () => h(Star20Regular)),
      },
    ]

    return {
      mainStore,
      settingsStore,
      mVisible,
      BlockType,
      TabType,
      actionBlockItemList,
      htmlBlockItemList,
      handleItemClick,
      handleComponentItemClick,
      componentList,
      handleDeleteComponent,
      handleComponentRename,
      handleComponentDeleteAll,
      cancelSelectComponent,
      getCompMenuOptions,
      getAddMenuOptions,
      componentListSorted,
      handleCreateComponent,
      importFileChooserRef,
      handleImportJsonFileSelected,
      handleImportAllJson,
      colorHash,
      handleContextmenu,
      isSortByName,
      FilterType,
      playSfxPop,
      isShowImageCropper,
      editingImageSrc: cropperEditingSrc,
      handleCropperSave,
      handleCropperCancel,
      ...contextMenuEtc,
      // icons
      componentFilterTabs,
    }
  },
})
</script>

<template>
  <n-dropdown
    v-if="mVisible"
    trigger="manual"
    placement="bottom-start"
    :show="showRightMenu"
    :options="rightMenuOptions"
    :x="xRef"
    :y="yRef"
    @select="handleSelectContextmenu"
    key-field="label"
    :on-clickoutside="handleClickOutside"
  />
  <ViewPortWindow
    class="inventory-modal"
    v-model:visible="mVisible"
    wid="inv"
    :class="{
      _topLayout: settingsStore.enableTopLayout,
      _docked: settingsStore.isInvDocked,
    }"
    :init-win-options="{height: '400px'}"
    :allow-move="!settingsStore.isInvDocked"
  >
    <template #titleBarLeft>
      <n-icon class="window-icon" size="18"><Box20Regular /></n-icon
      >{{ $t('common.inventory_list') }}
    </template>
    <template #titleBarRightControls>
      <button @click="settingsStore.isInvDocked = !settingsStore.isInvDocked">
        <n-icon size="16">
          <Window16Regular v-if="!settingsStore.isInvDocked" />
          <WindowArrowUp16Regular v-else />
        </n-icon>
      </button>
    </template>

    <TabLayout
      v-model="settingsStore.inventoryTab"
      :tab-list="[
        {
          label: 'Tools' + ` (${actionBlockItemList.length})`,
          value: TabType.TOOLS,
        },
        {
          label: 'HTML' + ` (${htmlBlockItemList.length})`,
          value: TabType.HTML_ELEMENTS,
        },
        {
          label: $t('common.components') + ` (${componentListSorted.length})`,
          value: TabType.COMPONENTS,
        },
        {
          label: $t('common.components') + ` V2(Beta)`,
          value: TabType.COMPONENTS_V2,
        },
      ]"
    >
      <InventoryList
        v-if="settingsStore.inventoryTab === TabType.TOOLS"
        :item-list="actionBlockItemList"
        @onItemClick="(v) => $emit('onItemClick', v)"
      />
      <InventoryList
        v-else-if="settingsStore.inventoryTab === TabType.HTML_ELEMENTS"
        :item-list="htmlBlockItemList"
        @onItemClick="(v) => $emit('onItemClick', v)"
      />
      <InventoryList
        v-else-if="settingsStore.inventoryTab === TabType.COMPONENTS"
        :item-list="componentListSorted"
        is-component-block
        @onItemClick="handleComponentItemClick"
        @contextmenu="handleContextmenu"
        :large-card="settingsStore.inventoryIsLargeCard"
      >
        <template #filterStart>
          <TabLayout
            horizontal
            v-model="settingsStore.inventoryFilterType"
            :tab-list="componentFilterTabs"
          />
        </template>
        <template #filterEnd>
          <n-button
            quaternary
            @click="playSfxPop(), (isSortByName = !isSortByName)"
            title="Change sort method"
            size="small"
          >
            <n-icon size="20">
              <TextSortAscending20Regular v-if="isSortByName" />
              <Timeline20Regular v-else />
            </n-icon>
          </n-button>

          <n-button
            quaternary
            @click="
              playSfxPop(),
                (settingsStore.inventoryIsLargeCard = !settingsStore.inventoryIsLargeCard)
            "
            title="Toggle stared"
            size="small"
          >
            <n-icon size="20">
              <Image20Filled v-if="settingsStore.inventoryIsLargeCard" />
              <Image20Regular v-else />
            </n-icon>
          </n-button>

          <n-dropdown :options="getAddMenuOptions()" key-field="label" trigger="hover">
            <n-button quaternary title="Component Menu" size="small">
              <n-icon size="20">
                <MoreHorizontal20Regular />
              </n-icon>
            </n-button>
          </n-dropdown>
        </template>
        <template #actionMenu="{item}">
          <n-dropdown
            :options="getCompMenuOptions(item)"
            key-field="label"
            placement="bottom-start"
            trigger="hover"
          >
            <n-button quaternary size="tiny" style="min-width: 10px" @click.stop>
              <n-icon size="20"> <MoreHorizontal20Regular /></n-icon>
            </n-button>
          </n-dropdown>
        </template>
        <template #end>
          <button @click="handleCreateComponent" class="mc-btn-add">
            <n-icon size="24"> <Add24Regular /></n-icon>
          </button>
        </template>
      </InventoryList>

      <ComponentExplorer v-else-if="settingsStore.inventoryTab === TabType.COMPONENTS_V2" />
    </TabLayout>

    <PopFloat />
    <FileChooser
      ref="importFileChooserRef"
      accept="application/JSON"
      @selected="handleImportJsonFileSelected"
    />
    <DialogImageCropper
      v-model:visible="isShowImageCropper"
      :src="editingImageSrc"
      @onSave="handleCropperSave"
      @onCancel="handleCropperCancel"
    />
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
.inventory-modal {
  height: 40vh;
  min-height: 120px;

  &._docked {
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    top: unset !important;
    bottom: 86px !important;
    width: auto !important;
    box-shadow: none !important;
    &._topLayout {
      top: 86px !important;
      bottom: unset !important;
    }
  }
  :deep(.n-tab-pane) {
    padding-top: 0;
    height: 100%;
  }
  :deep(.n-tabs-pane-wrapper) {
    flex: 1;
  }
}
</style>
