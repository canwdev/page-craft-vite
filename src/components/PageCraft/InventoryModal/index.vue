<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {actionBlockItemList, BlockItem, BlockType} from '@/enum/page-craft/block'
import {htmlBlockItemList, TabType} from '@/enum/page-craft/inventory'
import InventoryList from '@/components/PageCraft/InventoryModal/InventoryList.vue'
import {useMainStore} from '@/store/main'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import {colorHash} from '@/utils'
import {useSettingsStore} from '@/store/settings'
import {Box20Regular, Window16Regular, WindowArrowUp16Regular} from '@vicons/fluent'
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import {useI18n} from 'vue-i18n'
import {useSfxPop} from '@/hooks/use-sfx'
import PopFloat from '@/components/PageCraft/ComponentExplorer/PopFloat.vue'
import DialogImageCropper from '@/components/CommonUI/DialogImageCropper.vue'
import TabLayout from '@/components/CommonUI/TabLayout.vue'
import {NIcon} from 'naive-ui'
import ComponentExplorer from '@/components/PageCraft/ComponentExplorer/ComponentExplorer.vue'

export default defineComponent({
  name: 'InventoryModal',
  components: {
    TabLayout,
    DialogImageCropper,
    PopFloat,
    ViewPortWindow,
    InventoryList,
    Window16Regular,
    WindowArrowUp16Regular,
    Box20Regular,
    ComponentExplorer,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onItemClick', 'update:visible'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()
    const {play: playSfxPop} = useSfxPop()

    watch(
      () => settingsStore.inventoryTab,
      () => {
        playSfxPop()
      },
    )

    return {
      mainStore,
      settingsStore,
      mVisible,
      BlockType,
      TabType,
      actionBlockItemList,
      htmlBlockItemList,
      colorHash,
      playSfxPop,
    }
  },
})
</script>

<template>
  <ViewPortWindow
    class="inventory-modal"
    v-model:visible="mVisible"
    wid="inv"
    :class="{
      _topLayout: settingsStore.enableTopLayout,
      _docked: settingsStore.isInvDocked,
    }"
    :init-win-options="{height: '400px'}"
    :allow-move="!settingsStore.isInvDocked"
  >
    <template #titleBarLeft>
      <n-icon class="window-icon" size="18"><Box20Regular /></n-icon
      >{{ $t('common.inventory_list') }}
    </template>
    <template #titleBarRightControls>
      <button @click="settingsStore.isInvDocked = !settingsStore.isInvDocked">
        <n-icon size="16">
          <Window16Regular v-if="!settingsStore.isInvDocked" />
          <WindowArrowUp16Regular v-else />
        </n-icon>
      </button>
    </template>

    <TabLayout
      v-model="settingsStore.inventoryTab"
      :tab-list="[
        {
          label: 'Tools' + ` (${actionBlockItemList.length})`,
          value: TabType.TOOLS,
        },
        {
          label: 'HTML' + ` (${htmlBlockItemList.length})`,
          value: TabType.HTML_ELEMENTS,
        },
        {
          label: $t('common.components'),
          value: TabType.COMPONENTS,
        },
      ]"
    >
      <InventoryList
        v-if="settingsStore.inventoryTab === TabType.TOOLS"
        :item-list="actionBlockItemList"
        @onItemClick="(v) => $emit('onItemClick', v)"
      />
      <InventoryList
        v-else-if="settingsStore.inventoryTab === TabType.HTML_ELEMENTS"
        :item-list="htmlBlockItemList"
        @onItemClick="(v) => $emit('onItemClick', v)"
      />

      <ComponentExplorer v-else-if="settingsStore.inventoryTab === TabType.COMPONENTS" />
    </TabLayout>
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
.inventory-modal {
  height: 40vh;
  min-height: 120px;

  &._docked {
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
  }
  :deep(.n-tab-pane) {
    padding-top: 0;
    height: 100%;
  }
  :deep(.n-tabs-pane-wrapper) {
    flex: 1;
  }
}
</style>
