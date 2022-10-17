<script lang="ts">
import {defineComponent} from 'vue'
import ToolBar from '@/components/ToolBar/index.vue'
import StyleEditor from '@/components/StyleEditor/index.vue'
import MainCanvas from '@/components/MainCanvas/index.vue'
import {useLocalStorageBoolean} from '@/hooks/use-local-storage'
import {LsKeys} from '@/enum'
import StylusToolsDialog from '@/components/StyleEditor/StylusToolsDialog.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    ToolBar,
    StyleEditor,
    MainCanvas,
    StylusToolsDialog,
  },
  setup() {
    const isShowStyleEditorStyleEditor = useLocalStorageBoolean(LsKeys.IS_SHOW_STYLE_EDITOR)
    const isShowStylusTools = ref(false)
    return {
      isShowStyleEditorStyleEditor,
      isShowStylusTools,
    }
  },
})
</script>

<template>
  <div class="page-craft-home-view">
    <MainCanvas>
      <template #settingsButtons>
        <slot name="settingsButtons"> </slot>
      </template>
      <template #barExtra>
        <n-popover :duration="100" :show-arrow="false" trigger="hover" :delay="300">
          <template #trigger>
            <n-button
              size="tiny"
              style="min-width: 120px"
              @click="isShowStyleEditorStyleEditor = !isShowStyleEditorStyleEditor"
            >
              {{ isShowStyleEditorStyleEditor ? '✔' : '' }} Style Editor
            </n-button>
          </template>
          <n-button
            size="small"
            style="min-width: 120px"
            @click="isShowStylusTools = !isShowStylusTools"
          >
            Stylus Tools
          </n-button>
        </n-popover>
      </template>
    </MainCanvas>
    <ToolBar />
    <StyleEditor v-model:visible="isShowStyleEditorStyleEditor" />
    <StylusToolsDialog v-model:visible="isShowStylusTools" />
  </div>
</template>

<style lang="scss" scoped>
.page-craft-home-view {
  width: 100%;
  height: 100%;
  overflow: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
