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
import {useContextMenu} from '@/hooks/use-context-menu'
import {useInitComponents} from '@/hooks/use-init'
import {useSettingsStore} from '@/store/settings'
import {
  Dismiss20Regular,
  Window16Regular,
  WindowArrowUp16Regular,
  Diversity20Regular,
  MoreHorizontal20Regular,
  Add24Regular,
} from '@vicons/fluent'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import VpWindow from '@/components/CommonUI/VpWindow.vue'

let idx = 1

export default defineComponent({
  name: 'InventoryModal',
  components: {
    VpWindow,
    InventoryList,
    FileChooser,
    Dismiss20Regular,
    Window16Regular,
    WindowArrowUp16Regular,
    Diversity20Regular,
    MoreHorizontal20Regular,
    Add24Regular,
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

    const handleComponentItemClick = (item: BlockItem) => {
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
        label: '👀 Preview',
        props: {
          onClick: async () => {
            nodeAction(item, () => {
              globalEventBus.emit(GlobalEvents.ON_COMP_PREVIEW, {item})
            })
          },
        },
      },
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

    const getAddMenuOptions = () => {
      return [
        {
          label: '🔰 Default Board',
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
        {
          type: 'divider',
          label: 'd1',
        },
        {
          label: '➕ Add Component',
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
  <!--  <PopFloat v-if="mVisible" />-->

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
  <VpWindow
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
      <n-icon size="20"><Diversity20Regular /></n-icon>&nbsp;Inventory List
    </template>
    <template #titleBarRightControls>
      <button @click="settingsStore.isInvAttached = !settingsStore.isInvAttached">
        <n-icon size="16">
          <Window16Regular v-if="settingsStore.isInvAttached" />
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
      <n-tab-pane :name="BlockType.HTML_ELEMENT" tab="Blocks">
        <InventoryList
          :item-list="[...actionBlockItemList, ...htmlBlockItemList]"
          @onItemClick="(v) => $emit('onItemClick', v)"
        />
      </n-tab-pane>
      <n-tab-pane :name="BlockType.COMPONENT" tab="Components">
        <InventoryList
          :item-list="componentListSorted"
          is-component-block
          @onItemClick="handleComponentItemClick"
          @contextmenu="handleContextmenu"
        >
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

    <FileChooser ref="importFileChooserRef" accept="application/JSON" @selected="handleImportAll" />
  </VpWindow>
</template>

<style lang="scss" scoped>
.inventory-modal {
  height: 40vh;
  min-height: 200px;
  &._isAttached {
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
    transition: all 0.3s;
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
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
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
