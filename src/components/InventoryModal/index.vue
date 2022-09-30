<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {useIsDarkMode} from '@/hooks/use-global-theme'
import {
  BlockType,
  actionBlockItemList,
  BlockItem,
  ActionType,
  initToolbarList,
  createComponentBlockItem,
  ExportItem,
} from '@/enum/block'
import {htmlBlockItemList} from '@/enum/inventory'
import {ActionBlockItems} from '@/enum/block'
import InventoryList from '@/components/InventoryModal/InventoryList.vue'
import {useCraftStore} from '@/store/craft'
import {useLocalStorageObject, useLocalStorageString} from '@/hooks/use-local-storage'
import {LsKeys} from '@/enum'
import {useComponentImportExport, useComponentStorage} from '@/hooks/use-component-storage'
import FileChooser from '@/components/FileChooser.vue'
import DomPreview from '@/components/DomPreview/DomPreview.vue'
import {colorHash} from '@/utils'

let idx = 1

export default defineComponent({
  name: 'InventoryModal',
  components: {
    InventoryList,
    FileChooser,
    DomPreview,
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

    const {clearComponentStorage, renameComponentStorage} = useComponentStorage()

    const currentTab = useLocalStorageString(LsKeys.INVENTORY_TAB, BlockType.COMPONENT)
    const isMinHeight = ref(false)

    const handleItemClick = (item: BlockItem) => {
      craftStore.setCurrentBlock(item)
    }

    const {exportAll, handleImportAll, componentList, currentComponentName} =
      useComponentImportExport()
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
        handleCreateComponent(item)
        return
      }
      currentComponentName.value = item.title
    }

    const cancelSelectComponent = () => {
      currentComponentName.value = ''
    }

    const handleCreateComponent = (item: BlockItem) => {
      let name = `Component${idx}`
      name = prompt('Please enter the component name', name) || ''
      if (!name) {
        return
      }
      if (componentList.value.find((item) => item.title === name)) {
        window.$message.error('The component name already exists')
        return
      }

      componentList.value = [...componentList.value, createComponentBlockItem(name)]
      currentComponentName.value = name
      idx++
    }

    const handleComponentDelete = (item: BlockItem) => {
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
          clearComponentStorage(item.title)

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
            clearComponentStorage(item.title)
          })
          componentList.value = []
        },
        onNegativeClick: () => {},
      })
    }

    const handleComponentRename = (item: BlockItem) => {
      const name = prompt('请输入组件名称', item.title)
      if (!name) {
        return
      }
      if (componentList.value.find((item) => item.title === name)) {
        window.$message.error('The component name already exists')
        return
      }
      const index = componentList.value.findIndex((i) => i.id === item.id)
      const list = [...componentList.value]
      list.splice(index, 1, item)
      componentList.value = list

      if (item.title === currentComponentName.value) {
        currentComponentName.value = name
      }

      // rename local storage
      renameComponentStorage(item.title, name)
      item.title = name
    }

    const getCompMenuOptions = (item) => [
      {
        label: '🖊 Rename',
        props: {
          onClick: async () => {
            handleComponentRename(item)
          },
        },
      },
      {
        label: '❌ Delete',
        props: {
          onClick: async () => {
            handleComponentDelete(item)
          },
        },
      },
    ]

    const commonMenuOptions = [
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
      getCompMenuOptions,
      commonMenuOptions,
      importFileChooserRef,
      handleImportAll,
      colorHash,
    }
  },
})
</script>

<template>
  <transition name="zoom">
    <div class="inventory-modal win7" v-show="mVisible" :class="{_dark: isDarkMode}">
      <div class="window _window-color glass">
        <!--        <template v-if="mVisible">-->
        <!--          <DomPreview-->
        <!--            v-for="i in ['aaa', 'asdasda', 'vn8w9rw3', 'asdasd21233332323', 'asdxc33333']"-->
        <!--            :key="i"-->
        <!--            :id="`Comp${i}`"-->
        <!--            :style="`div { color: ${colorHash.hex(i)} }`"-->
        <!--          >-->
        <!--            <div>Hello world</div>-->
        <!--          </DomPreview>-->
        <!--        </template>-->

        <div ref="titleBarRef" class="title-bar">
          <div class="title-bar-text" style="display: flex; align-items: center; height: 14px">
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

        <div class="_window-body _bg">
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
              >
                <template #actionMenu="{item}">
                  <template v-if="item.actionType">
                    <n-dropdown
                      :options="commonMenuOptions"
                      key-field="label"
                      placement="bottom-start"
                      trigger="hover"
                    >
                      <n-button size="tiny" style="min-width: 10px" @click.stop>...</n-button>
                    </n-dropdown>
                  </template>
                  <template v-else>
                    <n-dropdown
                      :options="getCompMenuOptions(item)"
                      key-field="label"
                      placement="bottom-start"
                      trigger="hover"
                    >
                      <n-button size="tiny" style="min-width: 10px" @click.stop>...</n-button>
                    </n-dropdown>
                  </template>
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
