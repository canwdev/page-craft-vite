<script setup lang="ts">
import ToolBar from '@/components/PageCraft/ToolBar/index.vue'
import MainPlayground from '@/components/PageCraft/MainPlayground/index.vue'
import {useSettingsStore} from '@/store/settings'
import {formatCss} from '@/components/StyleEditor/utils/formater'
import {sassToCSS} from '@/components/StyleEditor/utils/css'
import {copyToClipboard} from '@/utils'
import {PaintBrush16Regular} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'
import {useEventListener} from '@vueuse/core'
import {useOpenCloseSound, useSfxOpenCloseSelect, useSfxBrush, useSfxFill} from '@/hooks/use-sfx'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'
import {CLASS_MAIN_CANVAS_ROOT} from '@/enum/page-craft'
import {useComponentStorageV2} from '@/components/PageCraft/ComponentV2/hooks/use-component-manage'

const StyleEditor = defineAsyncComponent(() => import('@/components/StyleEditor/index.vue'))

const {t: $t} = useI18n()
const settingsStore = useSettingsStore()
const mainStore = useMainStore()

const {play: playSfxBrush} = useSfxBrush()
const {play: sfxFill} = useSfxFill()

useOpenCloseSound(() => settingsStore.showStyleEditor)
useSfxOpenCloseSelect(() => mainStore.selecting)

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

const {loadCurCompStyle, saveCurCompStyle} = useComponentStorageV2()
const styleMenuOptions = [
  {
    label: '📄 ' + $t('actions.copy_compiled_css'),
    props: {
      onClick: async () => {
        const style = await loadCurCompStyle()
        const css = formatCss(await sassToCSS(style))
        await copyToClipboard(css)
      },
    },
  },
]

const styleEditorRef = ref()
const isAutoSave = ref(false)
const styleCode = ref('')
watch(styleCode, async () => {
  // console.log('[handleUpdateStyle]', isAutoSave.value)
  if (isAutoSave.value) {
    await saveCurCompStyle(styleCode.value)
  }
})

const reloadStyle = async () => {
  isAutoSave.value = false
  styleCode.value = await loadCurCompStyle()
  setTimeout(() => {
    isAutoSave.value = true
  }, 100)
}
onMounted(async () => {
  await reloadStyle()
})
watch(
  () => settingsStore.curCompInStore,
  async () => {
    await reloadStyle()
  }
)
useGlobalBusOn(GlobalEvents.IMPORT_SUCCESS, reloadStyle)
useGlobalBusOn(GlobalEvents.ON_ADD_STYLE, (arg) => {
  styleEditorRef.value.handleAddStyle(arg)
})
</script>

<template>
  <div class="page-craft-home-view" :class="{_topLayout: settingsStore.enableTopLayout}">
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
    ref="styleEditorRef"
    v-model:visible="settingsStore.showStyleEditor"
    v-model:selecting="mainStore.selecting"
    v-model:styleCode="styleCode"
    :selecting-parent-class="CLASS_MAIN_CANVAS_ROOT"
    @onFormat="playSfxBrush"
    @onInsertCode="sfxFill"
    show-tabs
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
