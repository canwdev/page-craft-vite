<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {actionBlockItemList, BlockType} from '@/enum/page-craft/block'
import {htmlBlockItemList, TabType} from '@/enum/page-craft/inventory'
import InventoryList from '@/components/PageCraft/InventoryModal/InventoryList.vue'
import {useMainStore} from '@/store/main'
import {useSettingsStore} from '@/store/settings'
import ViewPortWindow from '@/components/VgoUI/packages/ViewPortWindow/index.vue'
import {useI18n} from 'vue-i18n'
import {useSfxPop} from '@/hooks/use-sfx'
import TabLayout from '@/components/VgoUI/packages/Layouts/TabLayout.vue'
import ComponentExplorer from '@/components/PageCraft/ComponentExplorer/ComponentExplorer.vue'
import {colorHash} from '@/utils/color'

export default defineComponent({
  name: 'InventoryModal',
  components: {
    TabLayout,
    ViewPortWindow,
    InventoryList,
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
      <span class="mdi mdi-archive"></span>
      {{ $t('common.inventory_list') }}
    </template>
    <template #titleBarRightControls>
      <button @click="settingsStore.isInvDocked = !settingsStore.isInvDocked">
        <template v-if="!settingsStore.isInvDocked">
          <span class="mdi mdi-dock-bottom"></span>
        </template>
        <template v-else>
          <span class="mdi mdi-dock-window"></span>
        </template>
      </button>
    </template>

    <TabLayout
      v-model="settingsStore.inventoryTab"
      :options="[
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
