<script lang="ts">
import {defineComponent} from 'vue'
import ToolBar from '@/components/ToolBar/index.vue'
import StyleEditor from '@/components/StyleEditor/index.vue'
import MainCanvas from '@/components/MainCanvas/index.vue'
import {useLocalStorageBoolean} from '@/hooks/use-local-storage'
import {LsKeys} from '@/enum'

export default defineComponent({
  name: 'HomeView',
  components: {
    ToolBar,
    StyleEditor,
    MainCanvas,
  },
  setup() {
    const showStyleEditor = useLocalStorageBoolean(LsKeys.IS_SHOW_STYLE_EDITOR)
    return {
      showStyleEditor,
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
        <n-button size="tiny" style="min-width: 120px" @click="showStyleEditor = !showStyleEditor">
          {{ showStyleEditor ? 'Hide' : 'Show' }} StyleEditor
        </n-button>
      </template>
    </MainCanvas>
    <ToolBar />
    <StyleEditor v-model:visible="showStyleEditor" />
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
