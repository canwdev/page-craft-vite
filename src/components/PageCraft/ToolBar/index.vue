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
import {useMainStore} from '@/store/main-store'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'BottomToolBar',
  components: {
    ToolItem,
    InventoryModal,
  },
  setup(props, {emit}) {
    const craftStore = useCraftStore()
    const isShowInventoryModal = useLocalStorageBoolean(LsKeys.IS_SHOW_INVENTORY, false)

    const currentIndex = useLocalStorageNumber(LsKeys.TOOL_BAR_INDEX, 0)
    const toolBarList = useLocalStorageObject(LsKeys.TOOL_BAR_LIST, [...initToolbarList])

    const blinkAnimIndex = ref(-1)
    const setCurrentToolItem = (item: BlockItem) => {
      const list = [...toolBarList.value]
      list.splice(currentIndex.value, 1, item)
      toolBarList.value = list
      updateCurrentBlock(item)

      // add blink animation
      blinkAnimIndex.value = currentIndex.value
      setTimeout(() => {
        blinkAnimIndex.value = -1
      }, 200)
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

    // drag & drop switch toolbar item position
    const handleDragStart = (event, index, item: BlockItem) => {
      event.dataTransfer.setData('data-index', index)
      event.dataTransfer.setData('data-block', JSON.stringify(item))
    }
    const switchItemsPosition = (event, newIndex) => {
      const oldIndex = Number(event.dataTransfer.getData('data-index')) || currentIndex.value
      const arr = [...toolBarList.value]
      ;[arr[newIndex], arr[oldIndex]] = [arr[oldIndex], arr[newIndex]]
      toolBarList.value = arr
      if (oldIndex === currentIndex.value) {
        currentIndex.value = newIndex
      }
    }

    const mainStore = useMainStore()

    const router = useRouter()
    const toolsMenuOptions = [
      {
        label: 'Stylus Format Tool',
        props: {
          onClick: async () => {
            emit('openStylusTools')
          },
        },
      },
      {
        label: 'Excel Copy Tool',
        props: {
          onClick: async () => {
            await router.push({name: 'ExcelCopyTool'})
          },
        },
      },
      {
        label: 'I18n Edit Tool',
        props: {
          onClick: async () => {
            await router.push({name: 'VueI18nEditTool'})
          },
        },
      },
      {
        label: 'I18n Batch Tool',
        props: {
          onClick: async () => {
            await router.push({name: 'VueI18nBatchTool'})
          },
        },
      },
    ]

    return {
      mainStore,
      toolbarRef,
      toolBarList,
      craftStore,
      ...useIsDarkMode(),
      isShowInventoryModal,
      setCurrentToolItem,
      currentIndex,
      handleToolItemClick,
      resetToolbar() {
        toolBarList.value = [...initToolbarList]
        updateCurrentBlock(toolBarList.value[currentIndex.value])
        window.$message.success('Toolbar reset success!')
      },
      handleDragStart,
      switchItemsPosition,
      blinkAnimIndex,
      toolsMenuOptions,
    }
  },
})
</script>

<template>
  <div class="page-craft-enhanced-toolbar-wrapper" :class="{_topLayout: mainStore.isTopLayout}">
    <InventoryModal v-model:visible="isShowInventoryModal" @onItemClick="setCurrentToolItem" />
    <div
      ref="toolbarRef"
      class="page-craft-enhanced-toolbar page-craft-aero-panel"
      :class="{_dark: isDarkMode}"
    >
      <div class="page-craft-enhanced-toolbar-above">
        <n-space size="small">
          <portal-target name="indicatorBarTeleportDest">
            <!--
            This component can be located anywhere in your App.
            The slot content of the above portal component will be rendered here.
            -->
          </portal-target>

          <div class="field-row">
            <n-input
              size="tiny"
              type="text"
              v-model:value="craftStore.className"
              placeholder="CSS Class"
              style="font-family: monospace"
              clearable
            />
          </div>

          <div class="field-row">
            <n-input
              size="tiny"
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
              <n-button v-show="false" size="tiny"> Reset </n-button>
            </template>
            Confirm reset toolbar?
          </n-popconfirm>

          <slot></slot>

          <n-button
            style="min-width: 80px"
            size="tiny"
            @click="isShowInventoryModal = !isShowInventoryModal"
          >
            {{ isShowInventoryModal ? '✔' : '' }} Inventory
          </n-button>

          <n-dropdown
            :options="toolsMenuOptions"
            key-field="label"
            placement="bottom-start"
            trigger="hover"
          >
            <n-button size="tiny"> Tools </n-button>
          </n-dropdown>
        </n-space>
      </div>
      <div class="page-craft-enhanced-toolbar-main">
        <ToolItem
          v-for="(item, index) in toolBarList"
          :key="index"
          :item="item"
          :class="{blinkFast: blinkAnimIndex === index}"
          @click="handleToolItemClick(item, index)"
          :active="currentIndex === index"
          @onDragStart="(e) => handleDragStart(e, index, item)"
          @onDrop="(e) => switchItemsPosition(e, index)"
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

  &._topLayout {
    position: fixed;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 914px;
    top: 0;
    bottom: unset;
  }
}
.page-craft-enhanced-toolbar {
  border-bottom: 0;
  border-bottom: 0;
  padding: 5px 6px 6px;
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
      align-items: center;
      .n-input {
        width: 160px;
        margin-left: 5px;
      }
    }
  }

  .page-craft-enhanced-toolbar-main {
    width: 900px;
    height: 44px;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-gap: 1px;
    grid-template-columns: repeat(19, 1fr);
    grid-template-rows: auto;
  }
}
</style>
