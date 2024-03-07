<script lang="ts">
import {defineComponent} from 'vue'
import ToolBar from '@/components/PageCraft/ToolBar/index.vue'
import MainPlayground from '@/components/PageCraft/MainPlayground/index.vue'
import {useSettingsStore} from '@/store/settings'
import {customThemeOptions, CustomThemeType, ldThemeOptions} from '@/enum/settings'
import {handleExportStyle} from '@/utils/exporter'
import {formatCss} from '@/utils/formater'
import {sassToCSS} from '@/utils/css'
import {copyToClipboard} from '@/utils'
import {useCompStorage} from '@/hooks/use-component-storage'
import {ComponentExportData} from '@/enum/page-craft/block'
import {PaintBrush16Regular} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import {useOpenCloseSound, useSfxBell} from '@/hooks/use-sfx'
import IframeBrowser from '@/components/IframeBrowser/index.vue'
import BackgroundLayer from '@/components/PageCraft/BackgroundLayer/index.vue'
import {useMainStore} from '@/store/main'

export default defineComponent({
  name: 'CraftPage',
  components: {
    IframeBrowser,
    ToolBar,
    StyleEditor: defineAsyncComponent(() => import('@/components/PageCraft/StyleEditor/index.vue')),
    MainPlayground,
    BackgroundLayer,
    PaintBrush16Regular,
  },
  setup() {
    const {t: $t} = useI18n()
    const settingsStore = useSettingsStore()
    const mainStore = useMainStore()

    const listenShortcuts = (event) => {
      const key = event.key.toLowerCase()
      if (event.altKey && key === 'a') {
        settingsStore.showInventory = !settingsStore.showInventory
      } else if (event.altKey && key === 's') {
        settingsStore.showStyleEditor = !settingsStore.showStyleEditor
      } else if (event.altKey && key === 'w') {
        mainStore.isShowSettings = !mainStore.isShowSettings
      } else if (event.altKey && key === 'i') {
        settingsStore.isShowIframeBrowser = !settingsStore.isShowIframeBrowser
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

    return {
      mainStore,
      settingsStore,
      ldThemeOptions,
      styleMenuOptions,
      customThemeOptions,
      CustomThemeType,
    }
  },
})
</script>

<template>
  <div class="page-craft-home-view" :class="{_topLayout: settingsStore.enableTopLayout}">
    <BackgroundLayer v-if="settingsStore.enableReferenceMap" />

    <MainPlayground />

    <ToolBar>
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
      <template #end> </template>
    </ToolBar>
  </div>
  <IframeBrowser v-model:visible="settingsStore.isShowIframeBrowser" />
  <StyleEditor v-model:visible="settingsStore.showStyleEditor" />
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
