<script lang="ts">
import MainCanvas from '@/components/MainCanvas/index.vue'
import {LsKeys} from '@/enum'
import {createOrFindStyleNode} from '@/utils/dom'
import {getUserTheme, themeOptions, ThemeType, useHandleThemeChange} from '@/hooks/use-global-theme'
import HomeView from '@/views/HomeView.vue'

export default defineComponent({
  components: {
    HomeView,
  },
  emits: ['themeChange'],
  setup() {
    window.$message = useMessage()
    window.$notification = useNotification()
    window.$dialog = useDialog()
    window.$loadingBar = useLoadingBar()

    const isShowSettings = ref(false)
    const themeValue = ref(getUserTheme())

    const {handleThemeChange} = useHandleThemeChange()

    const styleEl = ref<HTMLElement | null>(null)
    const isShowGlobalStyleDialog = ref(false)
    const globalStyleText = ref('')

    const applyGlobalStyle = () => {
      if (styleEl.value) {
        styleEl.value.innerHTML = globalStyleText.value
        localStorage.setItem(LsKeys.GLOBAL_STYLE, globalStyleText.value)
      }
    }

    onMounted(() => {
      styleEl.value = createOrFindStyleNode(LsKeys.GLOBAL_STYLE)
      const style = localStorage.getItem(LsKeys.GLOBAL_STYLE) || ''

      if (style) {
        globalStyleText.value = style
        applyGlobalStyle()
      }
    })

    return {
      isShowSettings,
      isShowGlobalStyleDialog,
      applyGlobalStyle,
      globalStyleText,
      themeValue,
      themeOptions,
      handleThemeChange,
    }
  },
})
</script>
<template>
  <HomeView>
    <template #settingsButtons>
      <n-space size="small">
        <n-button size="tiny" @click="isShowSettings = true">Settings</n-button>
        <n-button size="tiny" @click="isShowGlobalStyleDialog = true">Global Style...</n-button>
      </n-space>
      <n-space size="small">
        <n-a href="https://github.com/canwdev/page-craft-vite" target="_blank">Github</n-a>
      </n-space>
    </template>
  </HomeView>

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

  <n-modal v-model:show="isShowSettings" preset="dialog" title="Settings">
    <n-list>
      <n-list-item>
        <n-thing title="Toggle light/dark theme" />
        <template #suffix>
          <n-select
            v-model:value="themeValue"
            :options="themeOptions"
            style="width: 150px"
            @update:value="handleThemeChange"
          />
        </template>
      </n-list-item>
    </n-list>
  </n-modal>
</template>
