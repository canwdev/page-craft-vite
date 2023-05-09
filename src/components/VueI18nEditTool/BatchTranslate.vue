<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import BatchTranslateItem from '@/components/VueI18nEditTool/BatchTranslateItem.vue'

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
  },
  setup(props, {emit}) {
    const {dirTree} = toRefs(props)
    const itemsRef = ref()

    const handleSaveChanged = async () => {
      // save other texts in the same level if not save
      // console.log('itemsRef', itemsRef.value)

      for (let i = 0; i < itemsRef.value.length; i++) {
        const item = itemsRef.value[i]
        await item.saveChange()
      }
    }

    return {
      handleSaveChanged,
      itemsRef,
    }
  },
})
</script>

<template>
  <div class="batch-translate">
    <BatchTranslateItem
      ref="itemsRef"
      v-for="item in dirTree.filter((i) => i.kind === 'directory')"
      :key="item.key"
      :dir-item="item"
      :file-path-arr="filePathArr"
      :translate-path="translatePath"
      @saveChanged="handleSaveChanged"
    />
  </div>
</template>

<style lang="scss" scoped>
.batch-translate {
  padding: 5px;
}
</style>
