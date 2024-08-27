<script setup lang="ts">
import SubGuiItem from '@/components/VueI18nEditTool/BatchGUI/SubGuiItem.vue'
import {useBatchWrapper} from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import CopyButtons from '@/components/VueI18nEditTool/Single/CopyButtons.vue'

const i18nMainStore = useI18nMainStore()
const {isLoading, handleSaveChanged, itemsRef} = useBatchWrapper()

useGlobalBusOn(GlobalEvents.I18N_BATCH_GUI_GET_SUBS, (resolve) => {
  resolve(itemsRef.value)
})
</script>

<template>
  <div class="batch-translate" v-loading="isLoading">
    <div v-if="i18nMainStore.translatePath" class="vp-bg t-action-row flex-row-center-gap">
      <span class="font-code">
        {{ i18nMainStore.translatePath }}
      </span>
      <div class="flex-row-center-gap">
        <span><i class="fa fa-copy"></i> :</span>
        <CopyButtons ref="cpButtonsRef" :content="i18nMainStore.translatePath" />
      </div>
    </div>
    <div class="batch-translate-list-wrap">
      <SubGuiItem
        ref="itemsRef"
        v-for="item in i18nMainStore.batchList"
        :key="item.dirItem.key"
        :list-item="item"
        @saveChanged="handleSaveChanged"
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
    border-bottom: 1px solid $color_border;
    gap: 10px;
  }
  .batch-translate-list-wrap {
    padding: 10px 10px;
  }
}
</style>
