<script lang="ts">
import {useCraftStore} from '@/store/craft'
import {BlockItem, initToolbarList} from '@/enum/page-craft/block'
import ToolItem from '@/components/PageCraft/ToolBar/ToolItem.vue'
import InventoryModal from '@/components/PageCraft/InventoryModal/index.vue'
import {LsKeys} from '@/enum/page-craft'
import {useLocalStorageObject} from '@/hooks/use-local-storage'
import {useRouter} from 'vue-router'
import {useSettingsStore} from '@/store/settings'
import {ArrowReset20Regular, Box20Regular, Toolbox20Regular} from '@vicons/fluent'
import PreviewWindow from '@/components/PageCraft/DomPreview/PreviewWindow.vue'
import {useI18n} from 'vue-i18n'
import VpWindow from '@/components/CommonUI/VpWindow.vue'
import {useOpenCloseSound, useSfxSelect} from '@/hooks/use-sfx'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useInputAutocomplete} from '@/components/PageCraft/ToolBar/toolbar-hooks'

export default defineComponent({
  name: 'BottomToolBar',
  components: {
    VpWindow,
    PreviewWindow,
    ToolItem,
    InventoryModal,
    ArrowReset20Regular,
    Box20Regular,
    Toolbox20Regular,
  },
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const craftStore = useCraftStore()
    const settingsStore = useSettingsStore()

    const toolBarList = useLocalStorageObject(LsKeys.TOOL_BAR_LIST, [...initToolbarList])

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
      craftStore.setCurrentBlock(item)
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

    const router = useRouter()
    const toolsMenuOptions = [
      {
        label: '⚜ Stylus ' + $t('common.formatting_tool'),
        props: {
          onClick: async () => {
            emit('openStylusTools')
          },
        },
      },
      {
        label: '📊 ' + $t('common.excel_copy_tool'),
        props: {
          onClick: async () => {
            await router.push({name: 'ExcelCopyTool'})
          },
        },
      },
      {
        label: '🌐 ' + $t('common.i18njson_editing_too'),
        props: {
          onClick: async () => {
            await router.push({name: 'VueI18nEditTool'})
          },
        },
      },
      {
        label: '🌎 ' + $t('common.i18njson_batch_tool'),
        props: {
          onClick: async () => {
            await router.push({name: 'VueI18nBatchTool'})
          },
        },
      },
    ]

    const isShowPreviewDialog = ref(true)

    useOpenCloseSound(() => settingsStore.showInventory)

    const handleAddClassName = () => {
      let sl = ''
      craftStore.className.split(' ').forEach((c) => {
        sl += '.' + c
      })
      const code = `\n${sl} {\n}\n`
      globalEventBus.emit(GlobalEvents.ON_ADD_STYLE, {code, isAppend: false})

      craftStore.className = ''
    }

    return {
      settingsStore,
      toolbarRef,
      toolBarList,
      craftStore,
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
      toolsMenuOptions,
      isShowPreviewDialog,
      handleAddClassName,
      // TODO
      ...useInputAutocomplete(),
    }
  },
})
</script>

<template>
  <div
    class="page-craft-enhanced-toolbar-wrapper"
    :class="{
      _topLayout: settingsStore.enableTopLayout,
    }"
  >
    <InventoryModal
      v-model:visible="settingsStore.showInventory"
      @onItemClick="setCurrentToolItem"
    />
    <PreviewWindow />
    <div ref="toolbarRef" class="page-craft-enhanced-toolbar page-craft-panel">
      <div class="page-craft-enhanced-toolbar-above">
        <n-space size="small">
          <portal-target name="indicatorBarTeleportDest">
            <!--
            This component can be located anywhere in your App.
            The slot content of the above portal component will be rendered here.
            -->
          </portal-target>

          <div class="field-row">
            <n-auto-complete v-model:value="craftStore.className" :options="autocompleteOptions">
              <template #default="{handleInput, handleBlur, handleFocus, value: slotValue}">
                <n-input
                  size="tiny"
                  type="text"
                  placeholder="CSS class"
                  clearable
                  class="font-code sl-css-class-input"
                  title="focus shortcut: alt+1; press enter to insert css class; input without dot(.)"
                  @keyup.enter="handleAddClassName"
                  :value="slotValue"
                  @input="handleInput"
                  @focus="handleFocus"
                  @blur="handleBlur"
                />
              </template>
            </n-auto-complete>
          </div>

          <div class="field-row">
            <n-input
              size="tiny"
              type="text"
              v-model:value="craftStore.innerText"
              placeholder="innerHTML | src | value"
              title="focus shortcut: alt+2"
              class="sl-inner-html-input"
              clearable
            />
          </div>
        </n-space>
        <n-space size="small" justify="end">
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

          <n-dropdown
            class="font-emoji"
            :options="toolsMenuOptions"
            key-field="label"
            placement="bottom-start"
            trigger="hover"
          >
            <n-button size="tiny">
              <template #icon>
                <n-icon size="18"><Toolbox20Regular /></n-icon>
              </template>
              {{ $t('common.tools') }}
            </n-button>
          </n-dropdown>
        </n-space>
      </div>
      <div class="page-craft-enhanced-toolbar-main _scrollbar_mini">
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
  padding: 5px 6px 5px;
  overflow: hidden;

  $barWidth: 900px;

  @media screen and (max-width: $barWidth) {
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }

  .page-craft-enhanced-toolbar-above {
    padding: 2px 0 6px;
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
      }
    }
  }

  .page-craft-enhanced-toolbar-main {
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
