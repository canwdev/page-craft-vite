<script setup lang="ts">
import SubTextItem from '@/components/VueI18nEditTool/BatchJson/SubJsonItem.vue'
import {useBatchWrapper} from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'

const i18nMainStore = useI18nMainStore()
const i18nSetStore = useI18nToolSettingsStore()
const {isLoading, handleSaveChanged, itemsRef} = useBatchWrapper()

const currentTab = ref('')

watch(
  () => i18nMainStore.batchList,
  (batchList) => {
    if (!batchList[0]) {
      return
    }
    // 自动选中当前json文件夹对应的tab
    const f = batchList.find((item) => item.rootDir.label === i18nMainStore.currentIso)
    if (!f) {
      // 回退默认
      currentTab.value = batchList[0].rootDir.key
      return
    }
    currentTab.value = f.rootDir.key
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
        :is-monaco-editor="i18nSetStore.isJsonMonacoEditor"
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
