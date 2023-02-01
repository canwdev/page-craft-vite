<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import BatchTranslateItem from '@/components/VueI18nCopyTool/BatchTranslateItem.vue'

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
      type: Array,
      default() {
        return []
      },
    },
    translatePath: {
      type: String,
      default: '',
    },
  },
  setup(props, {emit}) {
    const {dirTree} = toRefs(props)

    return {}
  },
})
</script>

<template>
  <div class="batch-translate">
    <BatchTranslateItem
      v-for="item in dirTree.filter((i) => i.kind === 'directory')"
      :key="item.key"
      :dir-item="item"
      :file-path-arr="filePathArr"
      :translate-path="translatePath"
    />
  </div>
</template>

<style lang="scss" scoped>
.batch-translate {
  padding: 10px 0 10px 10px;
}
</style>
