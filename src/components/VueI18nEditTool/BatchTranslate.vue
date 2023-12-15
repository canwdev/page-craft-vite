<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import BatchTranslateItem from '@/components/VueI18nEditTool/BatchTranslateItem.vue'
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
      // console.log('itemsRef', itemsRef.value)

      for (let i = 0; i < itemsRef.value.length; i++) {
        const item = itemsRef.value[i]
        await item.saveChange()
      }
    }
    onMounted(() => {
      globalEventBus.on(GlobalEvents.ON_I18N_SAVE_ALL_CHANGES, handleSaveChanged)
    })
    onBeforeUnmount(() => {
      globalEventBus.off(GlobalEvents.ON_I18N_SAVE_ALL_CHANGES, handleSaveChanged)
    })

    return {
      handleSaveChanged,
      itemsRef,
      filePathArrFiltered: computed(() => {
        if (isFoldersMode.value) {
          return dirTree.value.filter((i) => i.kind === 'directory')
        }
        return dirTree.value
      }),
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
      @saveChanged="handleSaveChanged"
      :is-folders-mode="isFoldersMode"
    />
  </div>
</template>

<style lang="scss" scoped>
.batch-translate {
  padding: 5px;
}
</style>
