<script setup lang="ts">
import SubTextItem from '@/components/VueI18nEditTool/BatchJson/SubJsonItem.vue'
import {useBatchWrapper} from '@/components/VueI18nEditTool/BatchGUI/hooks/batch-hooks'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'

const i18nMainStore = useI18nMainStore()
const {isLoading, handleSaveChanged, itemsRef} = useBatchWrapper()

const currentTab = ref('')

watch(
  () => i18nMainStore.batchList,
  (val) => {
    if (!val[0]) {
      return
    }
    // 如果没有选中或切换文件，自动选中第一个文件
    if (!currentTab.value) {
      currentTab.value = val[0].rootDir.key
      return
    }
    const f = val.find((item) => item.rootDir.key === currentTab.value)
    if (!f) {
      currentTab.value = val[0].rootDir.key
    }
  },
  {immediate: true}
)
</script>

<template>
  <div class="batch-text-editor">
    <transition name="fade">
      <div class="os-loading-container _absolute" v-if="isLoading">
        <n-spin />
      </div>
    </transition>

    <div class="editor-tabs-wrap">
      <n-tabs size="small" type="card" animated v-model:value="currentTab">
        <n-tab-pane
          style="padding: 0"
          :name="item.rootDir.key"
          :tab="
            (i18nMainStore.changedLabelMap[item.rootDir.label] ? '* ' : '') + item.rootDir.label
          "
          :key="item.rootDir.key"
          v-for="item in i18nMainStore.batchList"
        >
        </n-tab-pane>
      </n-tabs>
    </div>

    <div class="editor-wrap">
      <SubTextItem
        ref="itemsRef"
        v-for="item in i18nMainStore.batchList"
        :key="item.rootDir.key"
        :list-item="item"
        :visible="item.rootDir.key === currentTab"
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
  position: relative;
  .editor-tabs-wrap {
  }
  .editor-wrap {
    flex: 1;
    overflow: hidden;
  }
}
</style>
