<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import SubGuiItem from '@/components/VueI18nEditTool/BatchGUI/SubGuiItem.vue'
import {useBatchWrapper} from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'

export default defineComponent({
  name: 'BatchTranslate',
  components: {
    SubGuiItem,
  },
  props: {},
  setup(props, {emit}) {
    const {handleSaveChanged, itemsRef, filePathArrFiltered} = useBatchWrapper(props)

    useGlobalBusOn(GlobalEvents.I18N_BATCH_GUI_GET_SUBS, (resolve) => {
      resolve(itemsRef.value)
    })

    return {
      handleSaveChanged,
      itemsRef,
      filePathArrFiltered,
    }
  },
})
</script>

<template>
  <div class="batch-translate">
    <SubGuiItem
      ref="itemsRef"
      v-for="item in filePathArrFiltered"
      :key="item.key"
      :dir-item="item"
      @saveChanged="handleSaveChanged"
    />
  </div>
</template>

<style lang="scss" scoped>
.batch-translate {
  padding: 10px;
}
</style>
