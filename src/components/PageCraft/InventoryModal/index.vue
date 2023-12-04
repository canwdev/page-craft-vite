<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {
  actionBlockItemList,
  BlockItem,
  BlockType,
  createComponentBlockItem,
} from '@/enum/page-craft/block'
import {htmlBlockItemList, TabType} from '@/enum/page-craft/inventory'
import InventoryList from '@/components/PageCraft/InventoryModal/InventoryList.vue'
import {useCraftStore} from '@/store/craft'
import {useCompImportExport, useCompStorage} from '@/hooks/use-component-storage'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import {colorHash, sleep} from '@/utils'
import {useContextMenu} from '@/hooks/use-context-menu'
import {useInitComponents} from '@/hooks/use-init'
import {FilterType, useSettingsStore} from '@/store/settings'
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
import {fileToBase64} from '@/utils/exporter'
import {useSfxPop} from '@/hooks/use-sfx'
import PopFloat from '@/components/PageCraft/DomPreview/PopFloat.vue'
import {takeScreenshot} from '@/utils/screenshot'
import DialogImageCropper from '@/components/CommonUI/DialogImageCropper.vue'

let idx = 1

export default defineComponent({
  name: 'InventoryModal',
  components: {
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
    Star20Filled,
    Star20Regular,
    TextSortAscending20Regular,
    Timeline20Regular,
    BoxMultiple20Regular,
    Image20Filled,
    Image20Regular,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onItemClick'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const craftStore = useCraftStore()
    const settingsStore = useSettingsStore()
    const {play: playSfxPop} = useSfxPop()

    watch(
      () => settingsStore.inventoryTab,
      () => {
        playSfxPop()
      }
    )

    const {clearCompStorage, renameCompStorage, copyCompStorage} = useCompStorage()

    const handleItemClick = (item: BlockItem) => {
      craftStore.setCurrentBlock(item)
    }

    const {handleExportAllJson, handleImportAllJson, componentList, updateCompMeta} =
      useCompImportExport()
    const importFileChooserRef = ref()

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
      settingsStore.curCompoName = item.title
    }

    const cancelSelectComponent = () => {
      settingsStore.curCompoName = ''
    }

    const getNamePrompt = (message = '', name = '') => {
      name = prompt(message, name) || ''
      if (!name) {
        const message = $t('msgs.the_component_name_c')
        throw new Error(message)
      }
      if (componentList.value.find((item) => item.title === name)) {
        const message = $t('msgs.name_already_exists')
        window.$message.error(message)
        throw new Error(message)
      }
      return name
    }

    onMounted(() => {
      useInitComponents({
        componentListRef: componentList,
      })
    })

    const handleCreateComponent = () => {
      let name = getNamePrompt($t('msgs.please_enter_the_nam'), `Component${idx}`)

      const newItem = createComponentBlockItem(name)
      componentList.value = [newItem, ...componentList.value]
      updateCompMeta(newItem.title, newItem.data)
      settingsStore.curCompoName = name
      idx++
    }

    const handleComponentDelete = () => {
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
          if (settingsStore.curCompoName === item.title) {
            settingsStore.curCompoName = ''
          }
        },
        onNegativeClick: () => {},
      })
    }

    const handleDeleteAll = () => {
      window.$dialog.warning({
        title: $t('actions.confirm'),
        content: $t('msgs.sure_to_del_all'),
        positiveText: $t('actions.ok'),
        negativeText: $t('actions.cancel'),
        onPositiveClick: () => {
          settingsStore.curCompoName = ''
          componentList.value.forEach((item) => {
            clearCompStorage(item.title)
          })
          componentList.value = []
        },
        onNegativeClick: () => {},
      })
    }

    const handleComponentRename = () => {
      const item = editingNode.value
      const name = getNamePrompt($t('msgs.please_enter_the_nam'), item.title)

      const index = componentList.value.findIndex((i) => i.id === item.id)
      const list = [...componentList.value]
      list.splice(index, 1, item)
      componentList.value = list

      if (item.title === settingsStore.curCompoName) {
        settingsStore.curCompoName = name
      }

      // rename local storage
      renameCompStorage(item.title, name)
      item.title = name
    }

    const handleComponentDuplicate = () => {
      const item = editingNode.value
      const newName = getNamePrompt($t('msgs.please_input_new_name'), item.title + '-1')

      copyCompStorage(item.title, newName)

      const newItem = createComponentBlockItem(newName, {
        ...item.data,
        timestamp: Date.now(),
      })
      componentList.value = [newItem, ...componentList.value]

      updateCompMeta(newItem.title, newItem.data)
      settingsStore.curCompoName = newName
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
              handleComponentDelete()
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
              handleDeleteAll()
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

    return {
      craftStore,
      settingsStore,
      mVisible,
      BlockType,
      TabType,
      actionBlockItemList,
      htmlBlockItemList,
      handleItemClick,
      handleComponentItemClick,
      componentList,
      handleComponentDelete,
      handleComponentRename,
      handleDeleteAll,
      cancelSelectComponent,
      getCompMenuOptions,
      getAddMenuOptions,
      componentListSorted,
      handleCreateComponent,
      importFileChooserRef,
      handleImportAllJson,
      colorHash,
      handleContextmenu,
      isSortByName,
      FilterType,
      changeFilterType() {
        const filterValues = Object.values(FilterType)
        const currentIndex = filterValues.indexOf(settingsStore.inventoryFilterType)
        const nextIndex = (currentIndex + 1) % filterValues.length
        settingsStore.inventoryFilterType = filterValues[nextIndex]
        playSfxPop()
      },
      playSfxPop,
      isShowImageCropper,
      editingImageSrc: cropperEditingSrc,
      handleCropperSave,
      handleCropperCancel,
      ...contextMenuEtc,
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
    @select="handleSelect"
    key-field="label"
    :on-clickoutside="handleClickOutside"
  />
  <ViewPortWindow
    class="inventory-modal"
    v-model:visible="mVisible"
    wid="inv"
    :class="{
      _topLayout: settingsStore.enableTopLayout,
      _isAttached: settingsStore.isInvAttached,
    }"
    :allow-move="!settingsStore.isInvAttached"
  >
    <template #titleBarLeft>
      <n-icon class="window-icon" size="20"><Box20Regular /></n-icon
      >{{ $t('common.inventory_list') }}
    </template>
    <template #titleBarRightControls>
      <button @click="settingsStore.isInvAttached = !settingsStore.isInvAttached">
        <n-icon size="16">
          <Window16Regular v-if="!settingsStore.isInvAttached" />
          <WindowArrowUp16Regular v-else />
        </n-icon>
      </button>
    </template>

    <n-tabs
      v-model:value="settingsStore.inventoryTab"
      size="small"
      type="segment"
      animated
      style="height: 100%"
    >
      <n-tab-pane :name="TabType.TOOLS" :tab="'Tools' + ` (${actionBlockItemList.length})`">
        <InventoryList
          :item-list="actionBlockItemList"
          @onItemClick="(v) => $emit('onItemClick', v)"
        />
      </n-tab-pane>
      <n-tab-pane
        :name="TabType.HTML_ELEMENTS"
        :tab="'HTML ' + $t('common.blocks') + ` (${htmlBlockItemList.length})`"
      >
        <InventoryList
          :item-list="htmlBlockItemList"
          @onItemClick="(v) => $emit('onItemClick', v)"
        />
      </n-tab-pane>
      <n-tab-pane
        :name="TabType.COMPONENTS"
        :tab="$t('common.components') + ` (${componentListSorted.length})`"
      >
        <InventoryList
          :item-list="componentListSorted"
          is-component-block
          @onItemClick="handleComponentItemClick"
          @contextmenu="handleContextmenu"
          :large-card="settingsStore.inventoryIsLargeCard"
        >
          <template #customFilter>
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
            <n-button quaternary @click="changeFilterType" title="Toggle stared" size="small">
              <n-icon size="20">
                <BoxMultiple20Regular v-if="settingsStore.inventoryFilterType === FilterType.ALL" />
                <Star20Filled v-if="settingsStore.inventoryFilterType === FilterType.STARED" />
                <Star20Regular v-if="settingsStore.inventoryFilterType === FilterType.NOT_STARED" />
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
            <n-dropdown
              :options="getAddMenuOptions()"
              key-field="label"
              placement="top-end"
              trigger="hover"
            >
              <button @click="handleCreateComponent" class="mc-btn-add">
                <n-icon size="24"> <Add24Regular /></n-icon>
              </button>
            </n-dropdown>
          </template>
        </InventoryList>
      </n-tab-pane>
    </n-tabs>

    <PopFloat />
    <FileChooser
      ref="importFileChooserRef"
      accept="application/JSON"
      @selected="handleImportAllJson"
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

  &._isAttached {
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    top: unset !important;
    bottom: 86px !important;
    width: auto !important;
    box-shadow: none;
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
.mc-btn-add {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  border-radius: 50%;
  background-color: #e91e63;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border: none;
  outline: none;

  &:hover {
    filter: contrast(200%) brightness(1.5);
  }
}
</style>
