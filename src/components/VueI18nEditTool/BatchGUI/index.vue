<script setup lang="ts">
import { useBatchWrapper } from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import SubGuiItem from '@/components/VueI18nEditTool/BatchGUI/SubGuiItem.vue'
import CopyButtons from '@/components/VueI18nEditTool/Single/CopyButtons.vue'
import { useI18nMainStore } from '@/components/VueI18nEditTool/store/i18n-tool-main'
import { GlobalEvents, useGlobalBusOn } from '@/utils/global-event-bus'

const i18nMainStore = useI18nMainStore()
const { isLoading, handleSaveChanged, itemsRef } = useBatchWrapper()

useGlobalBusOn(GlobalEvents.I18N_BATCH_GUI_GET_SUBS, (resolve) => {
  resolve(itemsRef.value)
})
</script>

<template>
  <div v-loading="isLoading" class="batch-translate">
    <div v-if="i18nMainStore.translatePath" class="vgo-bg t-action-row flex-row-center-gap">
      <span class="font-code">
        {{ i18nMainStore.translatePath }}
      </span>
      <div class="flex-row-center-gap">
        <span>
          <span class="mdi mdi-content-copy" />
          :</span>
        <CopyButtons ref="cpButtonsRef" :content="i18nMainStore.translatePath" />
      </div>
    </div>
    <div class="batch-translate-list-wrap">
      <SubGuiItem
        v-for="item in i18nMainStore.batchList"
        ref="itemsRef"
        :key="item.dirItem.key"
        :list-item="item"
        @save-changed="handleSaveChanged"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.batch-translate {
  position: relative;
  .t-action-row {
    position: sticky;
    top: 0;
    z-index: 2;
    font-size: 12px;
    padding: 4px 10px;
    border-bottom: 1px solid var(--vgo-color-border);
    gap: 10px;
  }
  .batch-translate-list-wrap {
    padding: 10px 10px;
  }
}
</style>
