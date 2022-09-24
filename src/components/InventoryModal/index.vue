<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {useIsDarkMode} from '@/hooks/use-global-theme'
import {BlockType, actionBlockItemList, BlockItem} from '@/enum/block'
import {htmlBlockItemList} from '@/enum/inventory'
import InventoryList from '@/components/InventoryModal/InventoryList.vue'
import {useCraftStore} from '@/store/craft'
import {useLocalStorageString} from '@/hooks/use-local-storage'
import {LsKeys} from '@/enum'

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

    const currentTab = useLocalStorageString(LsKeys.INVENTORY_TAB, BlockType.COMPONENT)
    const isMini = ref(false)

    const handleItemClick = (item: BlockItem) => {
      craftStore.setCurrentBlock(item)
    }

    return {
      mVisible,
      isDarkMode,
      BlockType,
      actionBlockItemList,
      htmlBlockItemList,
      handleItemClick,
      currentTab,
      isMini,
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
              :aria-label="isMini ? 'Maximize' : 'Restore'"
              @click="isMini = !isMini"
            ></button>
          </div>
        </div>

        <div class="_window-body _bg">
          <n-tabs v-model:value="currentTab" size="small" type="segment" animated>
            <n-tab-pane :name="BlockType.HTML_ELEMENT" tab="HTML">
              <InventoryList
                :block-item-list="htmlBlockItemList"
                @onItemClick="(v) => $emit('onItemClick', v)"
                :is-mini="isMini"
              />
            </n-tab-pane>
            <n-tab-pane :name="BlockType.ACTIONS" tab="Actions">
              <InventoryList
                :block-item-list="actionBlockItemList"
                :show-filter="false"
                @onItemClick="(v) => $emit('onItemClick', v)"
                :is-mini="isMini"
              />
            </n-tab-pane>
            <n-tab-pane :name="BlockType.COMPONENT" tab="Components">
              <InventoryList :block-item-list="[]" :show-filter="false" :is-mini="isMini" />
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
