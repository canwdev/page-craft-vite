<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {
  BlockType,
  actionBlockItemList,
  BlockItem,
  ActionType,
  createComponentBlockItem,
} from '@/enum/page-craft/block'
import {htmlBlockItemList} from '@/enum/page-craft/inventory'
import {ActionBlockItems} from '@/enum/page-craft/block'
import InventoryList from '@/components/PageCraft/InventoryModal/InventoryList.vue'
import {useCraftStore} from '@/store/craft'
import {useCompImportExport, useCompStorage} from '@/hooks/use-component-storage'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import {colorHash} from '@/utils'
import PopWindow from '@/components/PageCraft/DomPreview/PopWindow.vue'
import {useContextMenu} from '@/hooks/use-context-menu'
import {useInitComponents} from '@/hooks/use-init'
import {useSettingsStore} from '@/store/settings'
import {
  Dismiss20Regular,
  ArrowMaximize16Regular,
  ArrowMinimize16Regular,
  Diversity20Regular,
} from '@vicons/fluent'

let idx = 1

export default defineComponent({
  name: 'InventoryModal',
  components: {
    InventoryList,
    FileChooser,
    PopWindow,
    Dismiss20Regular,
    ArrowMaximize16Regular,
    ArrowMinimize16Regular,
    Diversity20Regular,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onItemClick'],
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const craftStore = useCraftStore()
    const settingsStore = useSettingsStore()

    const {clearCompStorage, renameCompStorage, copyCompStorage} = useCompStorage()

    const isMinHeight = ref(false)

    const handleItemClick = (item: BlockItem) => {
      craftStore.setCurrentBlock(item)
    }

    const {exportAll, handleImportAll, componentList} = useCompImportExport()
    const importFileChooserRef = ref()

    const componentListSorted = computed(() => {
      return componentList.value.sort((a, b) => {
        return b.data.timestamp - a.data.timestamp
      })
    })

    const componentListFormatted = computed(() => {
      return [ActionBlockItems.ADD_COMPONENT, ...componentListSorted.value]
    })

    const handleComponentItemClick = (item: BlockItem) => {
      if (item.actionType === ActionType.ADD_COMPONENT) {
        handleCreateComponent()
        return
      }
      settingsStore.curCompoName = item.title
    }

    const cancelSelectComponent = () => {
      settingsStore.curCompoName = ''
    }

    const getNamePrompt = (message = '', name = '') => {
      name = prompt(message, name) || ''
      if (!name) {
        const message = 'The component name cannot be empty'
        throw new Error(message)
      }
      if (componentList.value.find((item) => item.title === name)) {
        const message = 'The component name already exists'
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
      let name = getNamePrompt('Please enter the component name', `Component${idx}`)

      componentList.value = [...componentList.value, createComponentBlockItem(name)]
      settingsStore.curCompoName = name
      idx++
    }

    const handleComponentDelete = () => {
      const item = editingNode.value
      window.$dialog.warning({
        title: 'Confirm',
        content: `Are you sure to delete ${item.title}?`,
        positiveText: 'OK',
        negativeText: 'Cancel',
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
        title: 'Confirm',
        content: `Are you sure to delete all components?`,
        positiveText: 'OK',
        negativeText: 'Cancel',
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
      const name = getNamePrompt('Please input component name', item.title)

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
      const name = getNamePrompt('Please input new component name', item.title + '-1')

      copyCompStorage(item.title, name)

      componentList.value = [...componentList.value, createComponentBlockItem(name)]
      settingsStore.curCompoName = name
      idx++
    }

    const getCompMenuOptions = (item) => [
      {
        label: '✏️ Rename',
        props: {
          onClick: async () => {
            nodeAction(item, () => {
              handleComponentRename()
            })
          },
        },
      },
      {
        label: '📄 Duplicate',
        props: {
          onClick: async () => {
            nodeAction(item, () => {
              handleComponentDuplicate()
            })
          },
        },
      },
      {
        label: '❌ Delete',
        props: {
          onClick: async () => {
            nodeAction(item, () => {
              handleComponentDelete()
            })
          },
        },
      },
    ]

    const getMenuOptions = (item: BlockItem) => {
      if (item.blockType === BlockType.COMPONENT) {
        return getCompMenuOptions(item)
      }
      return [
        {
          label: '🧹 Cancel Select',
          props: {
            onClick: async () => {
              cancelSelectComponent()
            },
          },
        },
        {
          label: '❌ Delete All',
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
          label: '📥 Import All (JSON)',
          props: {
            onClick: async () => {
              importFileChooserRef.value.chooseFile()
            },
          },
        },
        {
          label: '📃 Export All (JSON)',
          props: {
            onClick: async () => {
              await exportAll()
            },
          },
        },
      ]
    }

    const {editingNode, nodeAction, handleContextmenu, ...contextMenuEtc} =
      useContextMenu(getMenuOptions)

    return {
      craftStore,
      settingsStore,
      mVisible,
      BlockType,
      actionBlockItemList,
      htmlBlockItemList,
      handleItemClick,
      isMinHeight,
      componentListFormatted,
      handleComponentItemClick,
      componentList,
      handleComponentDelete,
      handleComponentRename,
      handleDeleteAll,
      cancelSelectComponent,
      getMenuOptions,
      importFileChooserRef,
      handleImportAll,
      colorHash,
      handleContextmenu,
      ...contextMenuEtc,
    }
  },
})
</script>

<template>
  <!-- TODO: 改为弹窗预览 -->
  <!--  <PopWindow v-if="mVisible" />-->

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

  <transition name="zoom">
    <div
      class="inventory-modal page-craft-window"
      v-show="mVisible"
      :class="{
        _dark: craftStore.isAppDarkMode,
        _topLayout: settingsStore.enableTopLayout,
        _blur: settingsStore.enableAeroTheme,
        _rounded: settingsStore.enableRoundedTheme,
        _thin: !settingsStore.enableRoundedTheme,
      }"
    >
      <div class="page-craft-window-content">
        <div ref="titleBarRef" class="page-craft-title-bar">
          <div
            class="page-craft-title-bar-text"
            style="display: flex; align-items: center; height: 14px"
          >
            <n-icon v-if="settingsStore.showInventory" size="20"><Diversity20Regular /></n-icon
            >&nbsp;Inventory List
          </div>

          <div ref="titleBarButtonsRef" class="page-craft-window-controls">
            <button @click="isMinHeight = !isMinHeight">
              <n-icon size="16">
                <ArrowMaximize16Regular v-if="isMinHeight" />
                <ArrowMinimize16Regular v-else />
              </n-icon>
            </button>

            <button title="Close" @click="mVisible = false" class="_danger">
              <n-icon size="20"><Dismiss20Regular /></n-icon>
            </button>
          </div>
        </div>

        <div class="page-craft-window-body _bg">
          <n-tabs v-model:value="settingsStore.inventoryTab" size="small" type="segment" animated>
            <n-tab-pane :name="BlockType.HTML_ELEMENT" tab="Blocks">
              <InventoryList
                :item-list="[...actionBlockItemList, ...htmlBlockItemList]"
                @onItemClick="(v) => $emit('onItemClick', v)"
                :is-min-height="isMinHeight"
              />
            </n-tab-pane>
            <n-tab-pane :name="BlockType.COMPONENT" tab="Components">
              <InventoryList
                :item-list="componentListFormatted"
                is-component-block
                :is-min-height="isMinHeight"
                @onItemClick="handleComponentItemClick"
                @contextmenu="handleContextmenu"
              >
                <template #actionMenu="{item}">
                  <n-dropdown
                    :options="getMenuOptions(item)"
                    key-field="label"
                    placement="bottom-start"
                    trigger="click"
                  >
                    <n-button size="tiny" style="min-width: 10px" @click.stop>...</n-button>
                  </n-dropdown>
                </template>
              </InventoryList>
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>

      <FileChooser
        ref="importFileChooserRef"
        accept="application/JSON"
        @selected="handleImportAll"
      />
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.inventory-modal {
  position: absolute;
  bottom: 88px;
  left: 0;
  right: 0;

  &._topLayout {
    top: 88px;
    bottom: unset;
  }
  :deep(.n-tab-pane) {
    padding-top: 0;
  }
}
</style>
