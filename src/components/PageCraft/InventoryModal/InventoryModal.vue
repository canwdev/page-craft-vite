<script lang="ts" setup>
import TabLayout from '@canwdev/vgo-ui/src/components/Layouts/TabLayout.vue'
import ViewPortWindow from '@canwdev/vgo-ui/src/components/ViewPortWindow/ViewPortWindow.vue'
import { useI18n } from 'vue-i18n'
import ComponentExplorer from '@/components/PageCraft/ComponentExplorer/ComponentExplorer.vue'
import InventoryList from '@/components/PageCraft/InventoryModal/InventoryList.vue'
import { actionBlockItemList } from '@/enum/page-craft/block'
import { htmlBlockItemList, TabType } from '@/enum/page-craft/inventory'
import { useModelWrapper } from '@/hooks/use-model-wrapper'
import { useSettingsStore } from '@/store/settings'

const props = withDefaults(defineProps<{
  visible?: boolean
}>(), {
  visible: false,
})
const emit = defineEmits(['update:visible'])

const { t: $t } = useI18n()
const mVisible = useModelWrapper(props, emit, 'visible')
const settingsStore = useSettingsStore()
</script>

<template>
  <ViewPortWindow
    v-model:visible="mVisible"
    class="inventory-modal"
    wid="inv"
    :class="{
      _topLayout: settingsStore.enableTopLayout,
      _docked: settingsStore.isInvDocked,
    }"
    :init-win-options="{ height: '400px' }"
    :allow-move="!settingsStore.isInvDocked"
  >
    <template #titleBarLeft>
      <span class="mdi mdi-archive" />
      {{ $t('common.inventory_list') }} (alt+a)
    </template>
    <template #titleBarRightControls>
      <button @click="settingsStore.isInvDocked = !settingsStore.isInvDocked">
        <template v-if="!settingsStore.isInvDocked">
          <span class="mdi mdi-dock-bottom" />
        </template>
        <template v-else>
          <span class="mdi mdi-dock-window" />
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
        @on-item-click="(v) => $emit('onItemClick', v)"
      />
      <InventoryList
        v-else-if="settingsStore.inventoryTab === TabType.HTML_ELEMENTS"
        :item-list="htmlBlockItemList"
        @on-item-click="(v) => $emit('onItemClick', v)"
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
