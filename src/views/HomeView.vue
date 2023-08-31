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
import {useI18n} from 'vue-i18n'

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
    const {t: $t} = useI18n()
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
        label: '📄 ' + $t('actions.copy_compiled_css'),
        props: {
          onClick: async () => {
            const style = loadCurCompStyle()
            const css = formatCss(await sassToCSS(style))
            copyToClipboard(css)
          },
        },
      },
      {
        label: '📤 ' + $t('actions.export'),
        children: [
          {
            label: `📃 ${$t('actions.export')} css`,
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
            label: `📃 ${$t('actions.export')} scss`,
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
          <n-button size="small" @click="isShowSettings = true">{{
            $t('common.settings')
          }}</n-button>
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
          style="min-width: 70px"
          type="primary"
          :secondary="!settingsStore.showStyleEditor"
          @click="settingsStore.showStyleEditor = !settingsStore.showStyleEditor"
        >
          <template #icon>
            <n-icon v-if="settingsStore.showStyleEditor" size="18"
              ><PaintBrush16Regular
            /></n-icon> </template
          >{{ $t('common.style') }}
        </n-button>
      </n-dropdown>
      <template #end>
        <StyleEditor v-model:visible="settingsStore.showStyleEditor" />
      </template>
    </ToolBar>
    <StylusToolsDialog v-model:visible="isShowStylusTools" />

    <n-modal
      v-model:show="isShowGlobalStyleDialog"
      :negative-text="$t('actions.cancel')"
      :positive-text="$t('actions.save')"
      preset="dialog"
      :title="$t('common.global_style')"
      @positive-click="applyGlobalStyle"
    >
      <n-input
        v-model:value="globalStyleText"
        :placeholder="$t('msgs.css_code_only')"
        rows="20"
        style="font-family: monospace"
        type="textarea"
      />
    </n-modal>

    <n-modal v-model:show="isShowSettings" preset="dialog" :title="$t('common.settings')">
      <n-list>
        <n-list-item>
          <n-thing :title="$t('actions.toggle_theme')" />
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
          <n-thing :title="$t('common.top_layout')" />
          <template #suffix>
            <n-switch v-model:value="settingsStore.enableTopLayout" />
          </template>
        </n-list-item>
        <n-list-item>
          <n-thing :title="$t('common.theme')" />
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
          <n-thing :title="$t('common.global_style')" />
          <template #suffix>
            <n-space align="center" justify="end" size="small" style="width: 200px">
              <n-switch v-model:value="settingsStore.enableGlobalCss" />
              <n-button size="small" @click="isShowGlobalStyleDialog = true">{{
                $t('actions.edit')
              }}</n-button>
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
    padding-top: 86px;
    flex-direction: column-reverse;
  }
}
</style>
