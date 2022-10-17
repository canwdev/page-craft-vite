<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {useIsDarkMode} from '@/hooks/use-global-theme'
import {
  BlockType,
  actionBlockItemList,
  BlockItem,
  ActionType,
  createComponentBlockItem,
} from '@/enum/block'
import {htmlBlockItemList} from '@/enum/inventory'
import {ActionBlockItems} from '@/enum/block'
import InventoryList from '@/components/InventoryModal/InventoryList.vue'
import {useCraftStore} from '@/store/craft'
import {useLocalStorageString} from '@/hooks/use-local-storage'
import {LsKeys} from '@/enum'
import {useCompImportExport, useCompStorage} from '@/hooks/use-component-storage'
import FileChooser from '@/components/FileChooser.vue'
import {colorHash} from '@/utils'
import PopWindow from '@/components/DomPreview/PopWindow.vue'
import {useContextMenu} from '@/hooks/use-context-menu'

let idx = 1

export default defineComponent({
  name: 'InventoryModal',
  components: {
    InventoryList,
    FileChooser,
    PopWindow,
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
    const {isDarkMode} = useIsDarkMode()
    const craftStore = useCraftStore()

    const {clearCompStorage, renameCompStorage, copyCompStorage} = useCompStorage()

    const currentTab = useLocalStorageString(LsKeys.INVENTORY_TAB, BlockType.COMPONENT)
    const isMinHeight = ref(false)

    const handleItemClick = (item: BlockItem) => {
      craftStore.setCurrentBlock(item)
    }

    const {exportAll, handleImportAll, componentList, currentComponentName} = useCompImportExport()
    const importFileChooserRef = ref()

    const componentListFormatted = computed(() => {
      return [ActionBlockItems.ADD_COMPONENT, ...[...componentList.value].reverse()]
    })

    watch(
      currentComponentName,
      (val) => {
        craftStore.currentComponentName = val
      },
      {immediate: true}
    )

    const handleComponentItemClick = (item: BlockItem) => {
      if (item.actionType === ActionType.ADD_COMPONENT) {
        handleCreateComponent()
        return
      }
      currentComponentName.value = item.title
    }

    const cancelSelectComponent = () => {
      currentComponentName.value = ''
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

    const handleCreateComponent = () => {
      let name = getNamePrompt('Please enter the component name', `Component${idx}`)

      componentList.value = [...componentList.value, createComponentBlockItem(name)]
      currentComponentName.value = name
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
          if (currentComponentName.value === item.title) {
            currentComponentName.value = ''
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
          currentComponentName.value = ''
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

      if (item.title === currentComponentName.value) {
        currentComponentName.value = name
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
      currentComponentName.value = name
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
      mVisible,
      isDarkMode,
      BlockType,
      actionBlockItemList,
      htmlBlockItemList,
      handleItemClick,
      currentTab,
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
  <PopWindow v-if="mVisible" />

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
    <div class="inventory-modal win7" v-show="mVisible" :class="{_dark: isDarkMode}">
      <div class="window _window-color glass">
        <div ref="titleBarRef" class="title-bar">
          <div
            class="title-bar-text font-minecraft"
            style="display: flex; align-items: center; height: 14px"
          >
            <img src="~@/assets/textures/crafting_table_top.png" alt="tools" />
            &nbsp;Inventory List
          </div>

          <div ref="titleBarButtonsRef" class="title-bar-controls">
            <button title="Close" aria-label="Minimize" @click="mVisible = false" />
            <button
              :aria-label="isMinHeight ? 'Maximize' : 'Restore'"
              @click="isMinHeight = !isMinHeight"
            ></button>
          </div>
        </div>

        <div class="_window-body _bg font-minecraft">
          <n-tabs v-model:value="currentTab" size="small" type="segment" animated>
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
  :deep(.n-tab-pane) {
    padding-top: 0;
  }
}
</style>
