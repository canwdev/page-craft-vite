<script lang="ts">
import {useMainStore} from '@/store/main'
import {BlockItem, initToolbarList} from '@/enum/page-craft/block'
import ToolItem from '@/components/PageCraft/ToolBar/ToolItem.vue'
import InventoryModal from '@/components/PageCraft/InventoryModal/index.vue'
import {LsKeys} from '@/enum/page-craft'
import {useRouter} from 'vue-router'
import {useSettingsStore} from '@/store/settings'
import {ArrowReset20Regular, Box20Regular, Toolbox20Regular} from '@vicons/fluent'
import PreviewWindow from '@/components/PageCraft/DomPreview/PreviewWindow.vue'
import {useI18n} from 'vue-i18n'
import {useOpenCloseSound, useSfxSelect} from '@/hooks/use-sfx'
import ClassNameInput from '@/components/PageCraft/ToolBar/ClassNameInput.vue'
import {useStorage} from '@vueuse/core'

export default defineComponent({
  name: 'BottomToolBar',
  components: {
    ClassNameInput,
    PreviewWindow,
    ToolItem,
    InventoryModal,
    ArrowReset20Regular,
    Box20Regular,
    Toolbox20Regular,
  },
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const router = useRouter()
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()

    const toolBarList = useStorage(LsKeys.TOOL_BAR_LIST, [...initToolbarList])

    const blinkAnimIndex = ref(-1)
    // add blink animation
    const playBlinkAnim = (index: number) => {
      blinkAnimIndex.value = index
      setTimeout(() => {
        blinkAnimIndex.value = -1
      }, 200)
    }

    const setCurrentToolItem = (item: BlockItem) => {
      const list = [...toolBarList.value]
      list.splice(settingsStore.toolbarIndex, 1, item)
      toolBarList.value = list
      updateCurrentBlock(item)
      playBlinkAnim(settingsStore.toolbarIndex)
    }

    const updateCurrentBlock = (item: BlockItem) => {
      mainStore.setCurrentBlock(item)
      playSfxSelect()
    }

    const handleToolItemClick = (item: BlockItem, index) => {
      settingsStore.toolbarIndex = index
      playSfxSelect()
    }

    const {play: playSfxSelect, stop: stopSfxSelect} = useSfxSelect()
    watch(
      () => settingsStore.toolbarIndex,
      (newIndex) => {
        updateCurrentBlock(toolBarList.value[newIndex])
        stopSfxSelect()
        playSfxSelect()
      }
    )

    const selectNext = () => {
      if (settingsStore.toolbarIndex === toolBarList.value.length - 1) {
        settingsStore.toolbarIndex = 0
        return
      }
      settingsStore.toolbarIndex += 1
    }
    const selectPrev = () => {
      if (settingsStore.toolbarIndex <= 0) {
        settingsStore.toolbarIndex = toolBarList.value.length - 1
        return
      }
      settingsStore.toolbarIndex -= 1
    }
    const handleScroll = (event) => {
      event.preventDefault()
      if (event.deltaY > 0) {
        selectNext()
      } else {
        selectPrev()
      }
    }

    const handleGlobalScroll = (event) => {
      if (event.shiftKey) {
        if (event.deltaY > 0) {
          selectNext()
        } else {
          selectPrev()
        }
      }
    }

    const toolbarRef = ref()

    onBeforeUnmount(() => {
      updateCurrentBlock(toolBarList.value[settingsStore.toolbarIndex])
    })

    onMounted(() => {
      document.addEventListener('wheel', handleGlobalScroll)
      toolbarRef.value.addEventListener('wheel', handleScroll, {passive: false})
    })
    onBeforeUnmount(() => {
      document.removeEventListener('wheel', handleGlobalScroll)
      toolbarRef.value.removeEventListener('wheel', handleScroll)
    })

    // drag & drop switch toolbar item position
    const handleDragStart = (event, index, item: BlockItem) => {
      event.dataTransfer.setData('data-index', index)
      event.dataTransfer.setData('data-block', JSON.stringify(item))
    }
    const switchItemsPosition = (event, newIndex) => {
      const oldIndex =
        Number(event.dataTransfer.getData('data-index')) || settingsStore.toolbarIndex
      const arr = [...toolBarList.value]
      ;[arr[newIndex], arr[oldIndex]] = [arr[oldIndex], arr[newIndex]]
      toolBarList.value = arr
      if (oldIndex === settingsStore.toolbarIndex) {
        settingsStore.toolbarIndex = newIndex
      }
      playBlinkAnim(newIndex)
    }

    const isShowPreviewDialog = ref(true)

    useOpenCloseSound(() => settingsStore.showInventory)

    return {
      settingsStore,
      toolbarRef,
      toolBarList,
      mainStore,
      setCurrentToolItem,
      handleToolItemClick,
      resetToolbar() {
        toolBarList.value = [...initToolbarList]
        updateCurrentBlock(toolBarList.value[settingsStore.toolbarIndex])
        window.$message.success('Toolbar reset success!')
      },
      handleDragStart,
      switchItemsPosition,
      blinkAnimIndex,
      isShowPreviewDialog,
    }
  },
})
</script>

<template>
  <PreviewWindow />

  <InventoryModal
    v-if="!settingsStore.isInvAttached"
    v-model:visible="settingsStore.showInventory"
    @onItemClick="setCurrentToolItem"
  />

  <div
    class="page-craft-toolbar-root"
    :class="{
      _topLayout: settingsStore.enableTopLayout,
    }"
  >
    <InventoryModal
      v-if="settingsStore.isInvAttached"
      v-model:visible="settingsStore.showInventory"
      @onItemClick="setCurrentToolItem"
    />

    <div ref="toolbarRef" class="mc-toolbar vp-panel vp-window-panel _panel-bg">
      <div class="mc-toolbar-above">
        <div class="mc-toolbar-group">
          <portal-target name="indicatorBarTeleportDest">
            <!--
            This component can be located anywhere in your App.
            The slot content of the above portal component will be rendered here.
            -->
          </portal-target>

          <ClassNameInput />
        </div>
        <div class="mc-toolbar-group">
          <n-popconfirm @positive-click="resetToolbar">
            <template #trigger>
              <n-button secondary size="tiny">
                <template #icon>
                  <n-icon size="18"><ArrowReset20Regular /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('msgs.confirm_reset_toolba') }}
          </n-popconfirm>

          <n-button
            style="min-width: 80px"
            size="tiny"
            @click="settingsStore.showInventory = !settingsStore.showInventory"
            title="(alt+a)"
          >
            <template #icon>
              <n-icon v-if="settingsStore.showInventory" size="18"><Box20Regular /></n-icon>
            </template>
            {{ $t('common.inventory') }}
          </n-button>

          <slot></slot>

          <n-button size="tiny" @click="mainStore.isShowQuickLaunch = !mainStore.isShowQuickLaunch">
            <template #icon>
              <n-icon size="18"><Toolbox20Regular /></n-icon>
            </template>
            {{ $t('common.tools') }}
          </n-button>
        </div>
      </div>
      <div class="mc-toolbar-main _scrollbar_mini">
        <ToolItem
          v-for="(item, index) in toolBarList"
          :key="index"
          :item="item"
          :class="{blinkFast: blinkAnimIndex === index}"
          @click="handleToolItemClick(item, index)"
          :active="settingsStore.toolbarIndex === index"
          @onDragStart="(e) => handleDragStart(e, index, item)"
          @onDrop="(e) => switchItemsPosition(e, index)"
        />
      </div>
    </div>

    <slot name="end"></slot>
  </div>
</template>

<style lang="scss">
@import 'tool-item';
.page-craft-toolbar-root {
  position: sticky;
  bottom: 0;
  user-select: none;
  margin-left: auto;
  margin-right: auto;
  z-index: 99;

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
.mc-toolbar {
  padding: 5px 6px 5px;
  overflow: hidden;
  box-sizing: border-box;

  $barWidth: 900px;

  @media screen and (max-width: $barWidth) {
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }

  .mc-toolbar-above {
    padding: 2px 0 6px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 4px;
    label {
      text-shadow: 0 0 10px white;
    }

    .mc-toolbar-group {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .vp-input {
      font-size: 12px;
      line-height: 1;
      padding: 2px 4px;
      flex: 1;
    }
  }

  .mc-toolbar-main {
    width: $barWidth;
    height: 44px;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-gap: 1px;
    grid-template-columns: repeat(19, 1fr);
    grid-template-rows: auto;

    @media screen and (max-width: $barWidth) {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      overflow: auto;
    }
  }
}
</style>
