<script lang="ts">
import {useCraftStore} from '@/store/craft'
import {BlockItem, initToolbarList} from '@/enum/page-craft/block'
import ToolItem from '@/components/PageCraft/ToolBar/ToolItem.vue'
import {useIsDarkMode} from '@/hooks/use-global-theme'
import InventoryModal from '@/components/PageCraft/InventoryModal/index.vue'
import {LsKeys} from '@/enum/page-craft'
import {
  useLocalStorageBoolean,
  useLocalStorageNumber,
  useLocalStorageObject,
} from '@/hooks/use-local-storage'

export default defineComponent({
  name: 'BottomToolBar',
  components: {
    ToolItem,
    InventoryModal,
  },
  setup() {
    const craftStore = useCraftStore()
    const isShowInventoryModal = useLocalStorageBoolean(LsKeys.IS_SHOW_INVENTORY, false)

    const currentIndex = useLocalStorageNumber(LsKeys.TOOL_BAR_INDEX, 0)
    const toolBarList = useLocalStorageObject(LsKeys.TOOL_BAR_LIST, [...initToolbarList])

    const handleInvItemClick = (item: BlockItem) => {
      const list = [...toolBarList.value]
      list.splice(currentIndex.value, 1, item)
      toolBarList.value = list
      updateCurrentBlock(item)
    }

    const updateCurrentBlock = (item: BlockItem) => {
      craftStore.setCurrentBlock(item)
    }

    const handleToolItemClick = (item: BlockItem, index) => {
      currentIndex.value = index
    }

    watch(currentIndex, (newIndex) => {
      updateCurrentBlock(toolBarList.value[newIndex])
    })

    const handleScroll = (event) => {
      event.preventDefault()
      if (event.deltaY > 0) {
        if (currentIndex.value === toolBarList.value.length - 1) {
          currentIndex.value = 0
          return
        }
        currentIndex.value += 1
      } else {
        if (currentIndex.value <= 0) {
          currentIndex.value = toolBarList.value.length - 1
          return
        }
        currentIndex.value -= 1
      }
    }

    const toolbarRef = ref()

    onBeforeUnmount(() => {
      updateCurrentBlock(toolBarList.value[currentIndex.value])
    })

    onMounted(() => {
      toolbarRef.value.addEventListener('wheel', handleScroll, {passive: false})
    })
    onBeforeUnmount(() => {
      toolbarRef.value.removeEventListener('wheel', handleScroll)
    })

    return {
      toolbarRef,
      toolBarList,
      craftStore,
      ...useIsDarkMode(),
      isShowInventoryModal,
      handleInvItemClick,
      currentIndex,
      handleToolItemClick,
      resetToolbar() {
        toolBarList.value = [...initToolbarList]
        updateCurrentBlock(toolBarList.value[currentIndex.value])
        window.$message.success('Toolbar reset success!')
      },
    }
  },
})
</script>

<template>
  <div class="page-craft-enhanced-toolbar-wrapper">
    <InventoryModal v-model:visible="isShowInventoryModal" @onItemClick="handleInvItemClick" />
    <div
      ref="toolbarRef"
      class="page-craft-enhanced-toolbar page-craft-aero-panel"
      :class="{_dark: isDarkMode}"
    >
      <div class="page-craft-enhanced-toolbar-above">
        <n-space size="small">
          <div class="field-row">
            <label for="inputClass" class="font-minecraft">Class </label>
            <n-input
              size="tiny"
              id="inputClass"
              type="text"
              v-model:value="craftStore.className"
              placeholder="CSS Class"
              style="font-family: monospace"
              clearable
            />
          </div>

          <div class="field-row">
            <label for="inputContent" class="font-minecraft">Content </label>
            <n-input
              size="tiny"
              id="inputContent"
              type="text"
              v-model:value="craftStore.innerText"
              placeholder="innerHTML | src | value"
              clearable
            />
          </div>
        </n-space>
        <n-space size="small">
          <n-popconfirm @positive-click="resetToolbar">
            <template #trigger>
              <n-button size="tiny"> Reset </n-button>
            </template>
            Confirm reset toolbar?
          </n-popconfirm>

          <n-button size="tiny" @click="isShowInventoryModal = !isShowInventoryModal">
            {{ isShowInventoryModal ? 'Hide' : 'Show' }} Inventory
          </n-button>
        </n-space>
      </div>
      <div class="page-craft-enhanced-toolbar-main">
        <ToolItem
          v-for="(item, index) in toolBarList"
          :key="index"
          :item="item"
          @click="handleToolItemClick(item, index)"
          :active="currentIndex === index"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-craft-enhanced-toolbar-wrapper {
  position: sticky;
  bottom: 0;
  user-select: none;
  margin-left: auto;
  margin-right: auto;
  z-index: 999;
}
.page-craft-enhanced-toolbar {
  border-bottom: 0;
  border-bottom: 0;
  padding: 5px 10px 6px;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

  .page-craft-enhanced-toolbar-above {
    padding: 2px 0 8px;
    display: flex;
    justify-content: space-between;
    label {
      text-shadow: 0 0 10px white;
    }
    .field-row {
      display: flex;
      .n-input {
        margin-left: 5px;
      }
    }
  }

  .page-craft-enhanced-toolbar-main {
    width: 724px;
    height: 44px;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-template-columns: repeat(18, 1fr);
    grid-template-rows: auto;
    background-image: url('@/assets/gui/widgets-bar.png');
    border-left: 2px solid black;
    border-right: 2px solid black;
  }
}
</style>
