<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import BatchTranslateItem from '@/components/VueI18nEditTool/Batch/BatchTranslateItem.vue'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'

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
    const {dirTree, isFoldersMode} = toRefs(props)
    const itemsRef = ref()

    const handleSaveChanged = async () => {
      // save other texts in the same level if not save
      // console.log('[handleSaveChanged]', itemsRef.value)

      // 逐个更新文件，而不是在组件内更新，以减少磁盘读写
      for (let i = 0; i < itemsRef.value.length; i++) {
        const item = itemsRef.value[i]
        await item.saveChange({isSetValue: true})
      }
    }
    onMounted(() => {
      globalEventBus.on(GlobalEvents.ON_I18N_SAVE_ALL_CHANGES, handleSaveChanged)
    })
    onBeforeUnmount(() => {
      globalEventBus.off(GlobalEvents.ON_I18N_SAVE_ALL_CHANGES, handleSaveChanged)
    })

    const filePathArrFiltered = computed(() => {
      if (isFoldersMode.value) {
        return dirTree.value.filter((i) => i.kind === 'directory')
      }
      return dirTree.value
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
    <BatchTranslateItem
      ref="itemsRef"
      v-for="item in filePathArrFiltered"
      :key="item.key"
      :dir-item="item"
      :file-path-arr="isFoldersMode ? filePathArr.slice(1) : filePathArr"
      :translate-path="translatePath"
      :is-folders-mode="isFoldersMode"
      @saveChanged="handleSaveChanged"
    />
  </div>
</template>

<style lang="scss" scoped>
.batch-translate {
  padding: 5px;
}
</style>
