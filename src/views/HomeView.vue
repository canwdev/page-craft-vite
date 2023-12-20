<script lang="ts">
import {defineComponent} from 'vue'
import ToolBar from '@/components/PageCraft/ToolBar/index.vue'
import MainCanvas from '@/components/PageCraft/MainCanvas/index.vue'
import {useSettingsStore} from '@/store/settings'
import {customThemeOptions, CustomThemeType, ldThemeOptions} from '@/enum/settings'
import {useMetaTitle} from '@/hooks/use-meta'
import {handleExportStyle} from '@/utils/exporter'
import {formatCss} from '@/utils/formater'
import {sassToCSS} from '@/utils/css'
import {copyToClipboard} from '@/utils'
import {useCompStorage} from '@/hooks/use-component-storage'
import {ComponentExportData} from '@/enum/page-craft/block'
// import BackgroundLayer from '@/components/BackgroundLayer/index.vue'
import {PaintBrush16Regular} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import {useOpenCloseSound, useSfxBell} from '@/hooks/use-sfx'
import VueMonaco from '@/components/CommonUI/VueMonaco.vue'
import IframeBrowser from '@/components/IframeBrowser/index.vue'
import {useGlobalStyle} from '@/hooks/use-global-theme'

export default defineComponent({
  name: 'HomeView',
  components: {
    IframeBrowser,
    VueMonaco,
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

    const isShowGlobalStyleDialog = ref(false)
    const {globalStyleText, applyGlobalStyle} = useGlobalStyle()

    const listenShortcuts = (event) => {
      const key = event.key.toLowerCase()
      if (event.altKey && key === 'a') {
        settingsStore.showInventory = !settingsStore.showInventory
      } else if (event.altKey && key === 's') {
        settingsStore.showStyleEditor = !settingsStore.showStyleEditor
      } else if (event.altKey && key === 'w') {
        isShowSettings.value = !isShowSettings.value
      } else if (event.altKey && key === 'i') {
        isShowIframeBrowser.value = !isShowIframeBrowser.value
      } else if (event.altKey && key === '1') {
        const el = document.querySelector('.sl-css-class-input input') as HTMLInputElement | null
        el && el.focus()
      } else if (event.altKey && key === '2') {
        const el = document.querySelector('.sl-inner-html-input input') as HTMLInputElement | null
        el && el.focus()
      }
    }

    const {play: playSfxBell} = useSfxBell()
    useOpenCloseSound(() => settingsStore.showStyleEditor)

    watch(
      () => settingsStore.enableSoundFx,
      () => {
        window.$dialog.warning({
          title: 'Refresh page?',
          positiveText: $t('actions.ok'),
          negativeText: $t('actions.cancel'),
          onPositiveClick: () => {
            location.reload()
          },
          onNegativeClick: () => {},
        })
      }
    )

    onMounted(() => {
      document.addEventListener('keydown', listenShortcuts)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', listenShortcuts)
    })

    const isShowStylusTools = ref(false)
    const isShowIframeBrowser = ref(false)

    const {loadCurCompStyle} = useCompStorage()
    const styleMenuOptions = [
      {
        label: '📄 ' + $t('actions.copy_compiled_css'),
        props: {
          onClick: async () => {
            const style = loadCurCompStyle()
            const css = formatCss(await sassToCSS(style))
            copyToClipboard(css)
            playSfxBell()
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
                  new ComponentExportData({
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
                  new ComponentExportData({
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

    useOpenCloseSound(() => isShowSettings.value)

    return {
      isShowSettings,
      isShowGlobalStyleDialog,
      applyGlobalStyle,
      globalStyleText,
      settingsStore,
      ldThemeOptions,
      isShowStylusTools,
      isShowIframeBrowser,
      styleMenuOptions,
      customThemeOptions,
      CustomThemeType,
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
          <n-button title="(alt+w)" size="small" @click="isShowSettings = true">{{
            $t('common.settings')
          }}</n-button>
          <n-a href="https://github.com/canwdev/page-craft-vite" target="_blank">Github...</n-a>
        </n-space>
      </template>
    </MainCanvas>

    <ToolBar
      @openStylusTools="isShowStylusTools = true"
      @openIframeBrowser="isShowIframeBrowser = !isShowIframeBrowser"
    >
      <n-dropdown
        :options="styleMenuOptions"
        key-field="label"
        placement="bottom-start"
        trigger="hover"
      >
        <n-button
          size="tiny"
          style="min-width: 70px"
          @click="settingsStore.showStyleEditor = !settingsStore.showStyleEditor"
          title="(alt+s)"
        >
          <template #icon>
            <n-icon v-if="settingsStore.showStyleEditor" size="18"
              ><PaintBrush16Regular
            /></n-icon> </template
          >{{ $t('common.style') }}
        </n-button>
      </n-dropdown>
      <template #end>
        <IframeBrowser v-model:visible="isShowIframeBrowser" />
        <StyleEditor v-model:visible="settingsStore.showStyleEditor" />
      </template>
    </ToolBar>
    <StylusToolsDialog v-model:visible="isShowStylusTools" />

    <n-modal
      v-model:show="isShowGlobalStyleDialog"
      :negative-text="$t('actions.cancel')"
      :positive-text="$t('actions.save')"
      preset="dialog"
      :title="$t('common.global_style') + ' ' + $t('msgs.css_code_only')"
      @positive-click="applyGlobalStyle"
    >
      <VueMonaco
        v-if="isShowGlobalStyleDialog"
        v-model="globalStyleText"
        style="height: 500px"
        language="css"
      />
    </n-modal>

    <n-modal v-model:show="isShowSettings" preset="dialog" :title="$t('common.settings')">
      <n-list>
        <n-list-item>
          <n-thing :title="$t('actions.toggle_ld_theme')" />
          <template #suffix>
            <n-select
              v-model:value="settingsStore.ldTheme"
              :options="ldThemeOptions"
              style="width: 150px"
            />
          </template>
        </n-list-item>

        <n-list-item>
          <n-thing :title="$t('common.theme')" />
          <template #suffix>
            <n-select
              v-model:value="settingsStore.customTheme"
              :options="customThemeOptions"
              style="width: 150px"
            />
          </template>
        </n-list-item>

        <n-list-item v-if="settingsStore.customTheme === CustomThemeType.DEFAULT">
          <n-thing :title="$t('common.theme') + ' Config'" />
          <template #suffix>
            <div style="min-width: 150px">
              <n-space size="small" justify="end">
                Aero
                <n-switch size="small" v-model:value="settingsStore.enableAeroTheme" />
              </n-space>
              <n-space size="small" justify="end">
                Rounded
                <n-switch
                  size="small"
                  v-model:value="settingsStore.enableRoundedTheme"
                  :round="settingsStore.enableRoundedTheme"
                />
              </n-space>
            </div>
          </template>
        </n-list-item>

        <n-list-item>
          <n-thing :title="$t('common.top_layout')" />
          <template #suffix>
            <n-switch v-model:value="settingsStore.enableTopLayout" />
          </template>
        </n-list-item>

        <n-list-item>
          <n-thing :title="`Sound Fx`" />
          <template #suffix>
            <n-switch v-model:value="settingsStore.enableSoundFx" />
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
