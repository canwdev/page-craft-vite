<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import SubTextItem from '@/components/VueI18nEditTool/BatchText/SubTextItem.vue'
import {useBatchWrapper} from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import {useI18nMainStore} from '@/store/i18n-tool-main'

export default defineComponent({
  name: 'BatchText',
  components: {SubTextItem},
  props: {},
  setup(props, {emit}) {
    const i18nMainStore = useI18nMainStore()
    const {handleSaveChanged, itemsRef, filePathArrFiltered} = useBatchWrapper(props)

    const currentTab = ref('')

    watch(
      filePathArrFiltered,
      (val) => {
        // 如果没有选中或切换文件，自动选中第一个文件
        if (!currentTab.value) {
          currentTab.value = val[0].key
          return
        }
        const f = val.find((item) => item.key === currentTab.value)
        if (!f) {
          currentTab.value = val[0].key
        }
      },
      {immediate: true}
    )

    return {
      i18nMainStore,
      handleSaveChanged,
      itemsRef,
      filePathArrFiltered,
      currentTab,
    }
  },
})
</script>

<template>
  <div class="batch-text-editor">
    <div class="editor-tabs-wrap">
      <n-tabs size="small" type="card" animated v-model:value="currentTab">
        <n-tab-pane
          style="padding: 0"
          :name="item.key"
          :tab="(i18nMainStore.changedLabelMap[item.label] ? '* ' : '') + item.label"
          :key="item.key"
          v-for="item in filePathArrFiltered"
        >
        </n-tab-pane>
      </n-tabs>
    </div>

    <div class="editor-wrap">
      <SubTextItem
        ref="itemsRef"
        v-for="item in filePathArrFiltered"
        :key="item.key"
        :dir-item="item"
        :visible="item.key === currentTab"
        @saveChanged="handleSaveChanged"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.batch-text-editor {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  .editor-tabs-wrap {
  }
  .editor-wrap {
    flex: 1;
    overflow: hidden;
  }
}
</style>
