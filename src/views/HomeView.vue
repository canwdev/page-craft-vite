<script lang="ts">
import {defineComponent} from 'vue'
import ToolBar from '@/components/PageCraft/ToolBar/index.vue'
import MainCanvas from '@/components/PageCraft/MainCanvas/index.vue'
import {useLocalStorageBoolean} from '@/hooks/use-local-storage'
import {LsKeys} from '@/enum/page-craft'
import {getUserTheme, themeOptions, useHandleThemeChange} from '@/hooks/use-global-theme'
import {useMainStore} from '@/store/main-store'
import {createOrFindStyleNode} from '@/utils/dom'
// import BackgroundLayer from '@/components/BackgroundLayer/index.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    ToolBar,
    StyleEditor: defineAsyncComponent(() => import('@/components/PageCraft/StyleEditor/index.vue')),
    MainCanvas,
    StylusToolsDialog: defineAsyncComponent(
      () => import('@/components/PageCraft/StyleEditor/StylusToolsDialog.vue')
    ),
    // BackgroundLayer,
  },
  setup() {
    const mainStore = useMainStore()

    const isEnableGlobalStyle = useLocalStorageBoolean(LsKeys.IS_ENABLE_GLOBAL_STYLE, true)

    const isShowSettings = ref(false)
    const themeValue = ref(getUserTheme())

    const {handleThemeChange} = useHandleThemeChange()

    const styleEl = ref<HTMLElement | null>(null)
    const isShowGlobalStyleDialog = ref(false)
    const globalStyleText = ref('')

    const applyGlobalStyle = () => {
      if (styleEl.value) {
        if (isEnableGlobalStyle.value) {
          styleEl.value.innerHTML = globalStyleText.value
          localStorage.setItem(LsKeys.GLOBAL_STYLE, globalStyleText.value)
        } else {
          styleEl.value.innerHTML = ''
        }
      }
    }

    watch(isEnableGlobalStyle, (val) => {
      applyGlobalStyle()
    })

    onMounted(() => {
      styleEl.value = createOrFindStyleNode(LsKeys.GLOBAL_STYLE)
      globalStyleText.value = localStorage.getItem(LsKeys.GLOBAL_STYLE) || ''

      applyGlobalStyle()
    })

    const isShowStyleEditorStyleEditor = useLocalStorageBoolean(LsKeys.IS_SHOW_STYLE_EDITOR)
    const isShowStylusTools = ref(false)

    return {
      isShowSettings,
      isShowGlobalStyleDialog,
      applyGlobalStyle,
      globalStyleText,
      themeValue,
      themeOptions,
      handleThemeChange,
      mainStore,
      isEnableGlobalStyle,
      isShowStyleEditorStyleEditor,
      isShowStylusTools,
    }
  },
})
</script>

<template>
  <div class="page-craft-home-view">
    <!--    <BackgroundLayer />-->
    <MainCanvas @openStylusTools="isShowStylusTools = true">
      <template #settingsButtons>
        <n-space align="center" size="small">
          <n-button size="small" @click="isShowSettings = true">Settings</n-button>
          <n-a href="https://github.com/canwdev/page-craft-vite" target="_blank">Github...</n-a>
        </n-space>
      </template>
      <template #barExtra>
        <n-button
          size="tiny"
          style="min-width: 120px"
          @click="isShowStyleEditorStyleEditor = !isShowStyleEditorStyleEditor"
        >
          {{ isShowStyleEditorStyleEditor ? '✔' : '' }} Style Editor
        </n-button>
      </template>
    </MainCanvas>
    <ToolBar />
    <StyleEditor v-model:visible="isShowStyleEditorStyleEditor" />
    <StylusToolsDialog v-model:visible="isShowStylusTools" />

    <n-modal
      v-model:show="isShowGlobalStyleDialog"
      negative-text="Cancel"
      positive-text="Save"
      preset="dialog"
      title="Global Style"
      @positive-click="applyGlobalStyle"
    >
      <n-input
        v-model:value="globalStyleText"
        placeholder="CSS Code Only"
        rows="20"
        style="font-family: monospace"
        type="textarea"
      />
    </n-modal>

    <n-modal v-model:show="isShowSettings" preset="dialog" title="PageCraft Settings">
      <n-list>
        <n-list-item>
          <n-thing title="Toggle Theme" />
          <template #suffix>
            <n-select
              v-model:value="themeValue"
              :options="themeOptions"
              style="width: 150px"
              @update:value="handleThemeChange"
            />
          </template>
        </n-list-item>
        <n-list-item>
          <n-thing title="Global Style" />
          <template #suffix>
            <div style="display: flex; align-items: center">
              <n-switch v-model:value="isEnableGlobalStyle" style="margin-right: 20px" />
              <n-button @click="isShowGlobalStyleDialog = true"> Edit </n-button>
            </div>
          </template>
        </n-list-item>
      </n-list>
    </n-modal>
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
