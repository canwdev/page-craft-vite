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
} from '@/enum/block'
import {htmlBlockItemList} from '@/enum/inventory'
import {ActionBlockItems} from '@/enum/block'
import InventoryList from '@/components/InventoryModal/InventoryList.vue'
import {useCraftStore} from '@/store/craft'
import {useLocalStorageObject, useLocalStorageString} from '@/hooks/use-local-storage'
import {LsKeys} from '@/enum'
import {useComponentStorage} from '@/hooks/use-component-storage'

let idx = 1

export default defineComponent({
  name: 'InventoryModal',
  components: {
    InventoryList,
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

    const currentComponentName = useLocalStorageString(LsKeys.CURRENT_COMPONENT_NAME, '')
    const componentList = useLocalStorageObject(LsKeys.COMPONENT_LIST, [])
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
      if (item.title === currentComponentName.value) {
        currentComponentName.value = ''
        return
      }
      currentComponentName.value = item.title
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

      // rename local storage
      renameComponentStorage(item.title, name)
      item.title = name
    }

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
    }
  },
})
</script>

<template>
  <transition name="zoom">
    <div class="inventory-modal win7" v-show="mVisible" :class="{_dark: isDarkMode}">
      <div class="window _window-color glass">
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
                  <n-button size="tiny" @click="handleComponentDelete(item)"> Delete </n-button>
                  <n-button size="tiny" @click="handleComponentRename(item)"> Rename </n-button>
                </template>
              </InventoryList>
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>
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
