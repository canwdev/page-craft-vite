<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import BatchTranslateItem from '@/components/VueI18nEditTool/Batch/BatchTranslateItem.vue'
import {useBatchWrapper} from '@/components/VueI18nEditTool/Batch/batch-hooks'

export default defineComponent({
  name: 'BatchTranslate',
  components: {
    BatchTranslateItem,
  },
  props: {},
  setup(props, {emit}) {
    const {handleSaveChanged, itemsRef, filePathArrFiltered, subFilePathArr} =
      useBatchWrapper(props)

    return {
      handleSaveChanged,
      itemsRef,
      filePathArrFiltered,
      subFilePathArr,
    }
  },
})
</script>

<template>
  <div class="batch-translate">
    <BatchTranslateItem
      ref="itemsRef"
      v-for="item in filePathArrFiltered"
      :key="item.key"
      :dir-item="item"
      :file-path-arr="subFilePathArr"
      @saveChanged="handleSaveChanged"
    />
  </div>
</template>

<style lang="scss" scoped>
.batch-translate {
  padding: 10px;
}
</style>
