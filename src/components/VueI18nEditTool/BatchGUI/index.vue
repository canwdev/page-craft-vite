<script setup lang="ts">
import SubGuiItem from '@/components/VueI18nEditTool/BatchGUI/SubGuiItem.vue'
import {useBatchWrapper} from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'
import {useI18nMainStore} from '@/store/i18n-tool-main'

const i18nMainStore = useI18nMainStore()
const {handleSaveChanged, itemsRef, batchList} = useBatchWrapper()

useGlobalBusOn(GlobalEvents.I18N_BATCH_GUI_GET_SUBS, (resolve) => {
  resolve(itemsRef.value)
})
</script>

<template>
  <div class="batch-translate">
    <div class="vp-bg t-action-row">
      <span class="font-code">
        {{ i18nMainStore.translatePath }}
      </span>
    </div>
    <div class="batch-translate-list-wrap">
      <SubGuiItem
        ref="itemsRef"
        v-for="item in batchList"
        :key="item.dirItem.key"
        :list-item="item"
        @saveChanged="handleSaveChanged"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.batch-translate {
  .t-action-row {
    position: sticky;
    top: 0;
    z-index: 2;
    font-size: 12px;
    padding: 4px 10px;
    border-bottom: 1px solid $color_border;
  }
  .batch-translate-list-wrap {
    padding: 10px 10px;
  }
}
</style>
