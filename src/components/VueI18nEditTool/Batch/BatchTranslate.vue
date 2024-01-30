<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import BatchTranslateItem from '@/components/VueI18nEditTool/Batch/BatchTranslateItem.vue'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useBatchWrapper} from '@/components/VueI18nEditTool/Batch/batch-hooks'

export default defineComponent({
  name: 'BatchTranslate',
  components: {
    BatchTranslateItem,
  },
  props: {
    dirTree: {
      type: Array as PropType<DirTreeItem[]>,
      default() {
        return []
      },
    },
    filePathArr: {
      type: Array as PropType<string[]>,
      default() {
        return []
      },
    },
    translatePath: {
      type: String,
      default: '',
    },
    isFoldersMode: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, {emit}) {
    const {dirTree, isFoldersMode, filePathArr} = toRefs(props)

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
      :translate-path="translatePath"
      :is-folders-mode="isFoldersMode"
      @saveChanged="handleSaveChanged"
    />
  </div>
</template>

<style lang="scss" scoped>
.batch-translate {
  padding: 10px;
}
</style>
