<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import SubGuiItem from '@/components/VueI18nEditTool/BatchGUI/SubGuiItem.vue'
import {useBatchWrapper} from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'
import {useI18nMainStore} from '@/store/i18n-tool-main'

export default defineComponent({
  name: 'BatchTranslate',
  components: {
    SubGuiItem,
  },
  props: {},
  setup(props, {emit}) {
    const i18nMainStore = useI18nMainStore()
    const {handleSaveChanged, itemsRef, filePathArrFiltered} = useBatchWrapper(props)

    useGlobalBusOn(GlobalEvents.I18N_BATCH_GUI_GET_SUBS, (resolve) => {
      resolve(itemsRef.value)
    })

    return {
      i18nMainStore,
      handleSaveChanged,
      itemsRef,
      filePathArrFiltered,
    }
  },
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
        v-for="item in filePathArrFiltered"
        :key="item.key"
        :dir-item="item"
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
