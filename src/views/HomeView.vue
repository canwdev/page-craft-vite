<script lang="ts">
import {defineComponent} from 'vue'
import ToolBar from '@/components/PageCraft/ToolBar/index.vue'
import MainCanvas from '@/components/PageCraft/MainCanvas/index.vue'
import {LsKeys} from '@/enum/page-craft'
import {useHandleThemeChange} from '@/hooks/use-global-theme'
import {themeOptions, useSettingsStore} from '@/store/settings'
import {createOrFindStyleNode} from '@/utils/dom'
import {useMetaTitle} from '@/hooks/use-meta'
import {handleExportStyle} from '@/utils/exporter'
import {formatCss, formatHtml} from '@/utils/formater'
import {sassToCSS} from '@/utils/css'
import {copyToClipboard} from '@/utils'
import {useCompStorage} from '@/hooks/use-component-storage'
import {ExportItem} from '@/enum/page-craft/block'
import {useCraftStore} from '@/store/craft'
// import BackgroundLayer from '@/components/BackgroundLayer/index.vue'
import {PaintBrush16Regular} from '@vicons/fluent'

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
    PaintBrush16Regular,
  },
  setup() {
    const settingsStore = useSettingsStore()
    const {metaTitle} = useMetaTitle()

    const isShowSettings = ref(false)

    const {handleThemeChange} = useHandleThemeChange()

    const styleEl = ref<HTMLElement | null>(null)
    const isShowGlobalStyleDialog = ref(false)
    const globalStyleText = ref('')

    const applyGlobalStyle = () => {
      if (styleEl.value) {
        if (settingsStore.enableGlobalCss) {
          styleEl.value.innerHTML = globalStyleText.value
          localStorage.setItem(LsKeys.GLOBAL_STYLE, globalStyleText.value)
        } else {
          styleEl.value.innerHTML = ''
        }
      }
    }

    watch(
      () => settingsStore.enableGlobalCss,
      (val) => {
        applyGlobalStyle()
      }
    )

    onMounted(() => {
      styleEl.value = createOrFindStyleNode(LsKeys.GLOBAL_STYLE)
      globalStyleText.value = localStorage.getItem(LsKeys.GLOBAL_STYLE) || ''

      applyGlobalStyle()
    })

    const isShowStylusTools = ref(false)

    const {loadCurCompStyle} = useCompStorage()
    const craftStore = useCraftStore()
    const styleMenuOptions = [
      {
        label: '📄 Copy Compiled CSS',
        props: {
          onClick: async () => {
            const style = loadCurCompStyle()
            const css = formatCss(await sassToCSS(style))
            copyToClipboard(css)
          },
        },
      },
      {
        label: '📤 Export',
        children: [
          {
            label: '📃 Export CSS File',
            props: {
              onClick: async () => {
                await handleExportStyle(
                  new ExportItem({
                    name: settingsStore.curCompoName,
                    html: '',
                    style: formatCss(loadCurCompStyle()),
                  }),
                  true
                )
              },
            },
          },
          {
            label: '📃 Export SCSS File',
            props: {
              onClick: async () => {
                await handleExportStyle(
                  new ExportItem({
                    name: settingsStore.curCompoName,
                    html: '',
                    style: formatCss(loadCurCompStyle()),
                  })
                )
              },
            },
          },
        ],
      },
    ]

    return {
      isShowSettings,
      isShowGlobalStyleDialog,
      applyGlobalStyle,
      globalStyleText,
      settingsStore,
      themeOptions,
      handleThemeChange,
      isShowStylusTools,
      styleMenuOptions,
    }
  },
})
</script>

<template>
  <div class="page-craft-home-view" :class="{_topLayout: settingsStore.enableTopLayout}">
    <!--    <BackgroundLayer />-->

    <MainCanvas>
      <template #settingsButtons>
        <n-space align="center" size="small">
          <n-button size="small" @click="isShowSettings = true">Settings</n-button>
          <n-a href="https://github.com/canwdev/page-craft-vite" target="_blank">Github...</n-a>
        </n-space>
      </template>
    </MainCanvas>

    <ToolBar @openStylusTools="isShowStylusTools = true">
      <n-dropdown
        :options="styleMenuOptions"
        key-field="label"
        placement="bottom-start"
        trigger="hover"
      >
        <n-button
          size="tiny"
          style="min-width: 90px"
          @click="settingsStore.showStyleEditor = !settingsStore.showStyleEditor"
        >
          <template #icon>
            <n-icon v-if="settingsStore.showStyleEditor" size="18"
              ><PaintBrush16Regular
            /></n-icon> </template
          >Style Editor
        </n-button>
      </n-dropdown>
    </ToolBar>
    <StyleEditor v-model:visible="settingsStore.showStyleEditor" />
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
              v-model:value="settingsStore.theme"
              :options="themeOptions"
              style="width: 150px"
              @update:value="handleThemeChange"
            />
          </template>
        </n-list-item>
        <n-list-item>
          <n-thing title="Top Layout" />
          <template #suffix>
            <n-switch v-model:value="settingsStore.enableTopLayout" />
          </template>
        </n-list-item>
        <n-list-item>
          <n-thing title="Theme" />
          <template #suffix>
            <n-space align="center" justify="end" size="small" style="width: 280px">
              <n-switch size="small" v-model:value="settingsStore.enableAeroTheme">
                <template #checked>Aero</template>
                <template #unchecked>Aero</template>
              </n-switch>
              <n-switch
                size="small"
                v-model:value="settingsStore.enableRoundedTheme"
                :round="settingsStore.enableRoundedTheme"
              >
                <template #checked>Rounded</template>
                <template #unchecked>Rounded</template>
              </n-switch>
            </n-space>
          </template>
        </n-list-item>
        <n-list-item>
          <n-thing title="Global Style" />
          <template #suffix>
            <n-space align="center" justify="end" size="small" style="width: 200px">
              <n-switch v-model:value="settingsStore.enableGlobalCss" />
              <n-button size="small" @click="isShowGlobalStyleDialog = true"> Edit </n-button>
            </n-space>
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

  &._topLayout {
    padding-top: 88px;
    flex-direction: column-reverse;
  }
}
</style>
