<script lang="ts">
import {defineComponent} from 'vue'
import ToolBar from '@/components/PageCraft/ToolBar/index.vue'
import MainPlayground from '@/components/PageCraft/MainPlayground/index.vue'
import {useSettingsStore} from '@/store/settings'
import {ldThemeOptions} from '@/enum/settings'
import {handleExportStyle} from '@/utils/exporter'
import {formatCss} from '@/components/PageCraft/StyleEditor/utils/formater'
import {sassToCSS} from '@/components/PageCraft/StyleEditor/utils/css'
import {copyToClipboard} from '@/utils'
import {useCompStorage} from '@/hooks/use-component-storage'
import {ComponentExportData} from '@/enum/page-craft/block'
import {PaintBrush16Regular} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import {useOpenCloseSound, useSfxBell} from '@/hooks/use-sfx'
import BackgroundLayer from '@/components/PageCraft/BackgroundLayer/index.vue'
import {useMainStore} from '@/store/main'
import {useEventListener} from '@vueuse/core'

export default defineComponent({
  name: 'CraftPage',
  components: {
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

    const {play: playSfxBell} = useSfxBell()
    useOpenCloseSound(() => settingsStore.showStyleEditor)

    watch(
      () => settingsStore.enableSoundFx,
      () => {
        window.$dialog.warning({
          title: $t('msgs.refresh_page'),
          positiveText: $t('actions.ok'),
          negativeText: $t('actions.cancel'),
          onPositiveClick: () => {
            location.reload()
          },
          onNegativeClick: () => {},
        })
      }
    )
    useEventListener(document, 'keydown', (event) => {
      const key = event.key.toLowerCase()
      if (event.altKey && key === 'a' && !event.ctrlKey) {
        settingsStore.showInventory = !settingsStore.showInventory
      } else if (event.altKey && key === 's' && !event.ctrlKey) {
        settingsStore.showStyleEditor = !settingsStore.showStyleEditor
      } else if (event.altKey && key === 'w') {
        mainStore.isShowSettings = !mainStore.isShowSettings
      } else if (event.altKey && key === '1') {
        const el = document.querySelector('.sl-css-class-input input') as HTMLInputElement | null
        el && el.focus()
      } else if (event.altKey && key === '2') {
        const el = document.querySelector('.sl-inner-html-input input') as HTMLInputElement | null
        el && el.focus()
      }
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
  <StyleEditor
    v-model:visible="settingsStore.showStyleEditor"
    v-model:selecting="mainStore.selecting"
    :selecting-parent-class="'.page-craft-mc'"
  />
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
