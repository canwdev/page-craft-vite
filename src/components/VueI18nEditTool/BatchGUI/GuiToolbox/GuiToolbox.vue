<script lang="ts" setup="">
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import {useI18n} from 'vue-i18n'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import {ref} from 'vue'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {useDebounceFn} from '@vueuse/core'
import {useGuiToolbox} from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-gui-toolbox'
import {blinkPanel} from '@/utils/anim'
import {useBatchTranslateAnalyser} from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-analyser'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {useBatchTranslateRefactor} from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-refactor'

const emit = defineEmits(['reloadTranslates'])
const tiSelector = '.translate-item'
const {t: $t} = useI18n()
const i18nMainStore = useI18nMainStore()

const {getArrayFromRight, pasteJsonOverrideRight} = useGuiToolbox()

onMounted(() => {
  locateSelectedPath()
})

const locateSelectedPath = () => {
  const currentPath = i18nMainStore.translatePath
  if (!currentPath) {
    return
  }
  const el = document.querySelector(`${tiSelector}[data-translate-path="${currentPath}"]`)
  if (el) {
    el.scrollIntoView({behavior: 'smooth', block: 'center'})
    el.classList.add('t_selected')
  }
}

const {handleAnalyse, analyseMessage} = useBatchTranslateAnalyser()
const {handleDeleteKeys, handleRenameKeys, handleGptTranslate} = useBatchTranslateRefactor(emit)

const guiToolboxOptions = computed((): QuickOptionItem[] => {
  const currentPath = i18nMainStore.translatePath
  return [
    {
      label: $t('msgs.fen_xi_fan_yi_shu'),
      props: {
        onClick: () => handleAnalyse(),
      },
    },
    {
      label: 'AI Translate',
      disabled: !currentPath,
      props: {
        onClick: () => handleGptTranslate(),
      },
    },
    {split: true},
    {
      label: $t('msgs.copy_json_from_right'),
      disabled: !currentPath,
      props: {
        onClick: async () => {
          window.$qlUtils.copy(await getArrayFromRight())
        },
      },
    },
    {
      label: $t('msgs.paste_json_override_right'),
      disabled: !currentPath,
      props: {
        onClick: () => pasteJsonOverrideRight(),
      },
    },
    {split: true},
    {
      label: 'Refactor: Delete Keys',
      disabled: !currentPath,
      props: {
        onClick: () => handleDeleteKeys(),
      },
    },
    {
      label: 'Refactor: Rename Keys',
      disabled: !currentPath,
      props: {
        onClick: async () => {
          await handleRenameKeys()
          setTimeout(() => {
            locateSelectedPath()
          }, 500)
        },
      },
    },
  ]
})

// 过滤key
const toolboxFilterKey = ref('')
// 过滤到多个元素的跳转index，来回切换
const toolboxFilterIndex = ref(0)
const toolboxFilterEls = ref<HTMLElement[]>([])

const toolboxFilterKeyChange = () => {
  if (!toolboxFilterEls.value.length) {
    Array.from(document.querySelectorAll(tiSelector)).forEach((el) => {
      el.classList.remove('t_highlight')
      el.classList.remove('t_highlight_current')
    })
    toolboxFilterEls.value = Array.from(
      document.querySelectorAll(
        `${tiSelector}[data-translate-path*="${toolboxFilterKey.value.trim()}"]`
      )
    ) as HTMLElement[]
  }
  const els = toolboxFilterEls.value

  if (toolboxFilterIndex.value >= els.length) {
    toolboxFilterIndex.value = 0
  }
  els.forEach((el, index) => {
    // const key = el.getAttribute('data-translate-path')
    if (index === toolboxFilterIndex.value) {
      // console.log('scrollIntoView', index, el)
      el.classList.add('t_highlight_current')
      el.scrollIntoView({behavior: 'smooth', block: 'center'})
    } else {
      el.classList.remove('t_highlight_current')
    }

    // 高亮
    el.classList.add('t_highlight')
  })
  toolboxFilterIndex.value++
}
const toolboxFilterKeyChangeDebounced = useDebounceFn(toolboxFilterKeyChange, 500)
watch(toolboxFilterKey, () => {
  // 过滤内容变化，清空index
  toolboxFilterIndex.value = 0
  toolboxFilterEls.value = []
  toolboxFilterKeyChangeDebounced()
})
</script>

<template>
  <div class="vp-bg action-row">
    <n-popover trigger="hover" placement="bottom-start" style="padding: 0">
      <template #trigger>
        <button class="vp-button">
          {{ $t('common.tools') }}
        </button>
      </template>

      <QuickOptions is-static :options="guiToolboxOptions" class="vp-panel" />
    </n-popover>
    <button class="vp-button" @click="locateSelectedPath()" :title="$t('msgs.locate_translate_pa')">
      ⨁
    </button>

    <input
      class="vp-input font-code"
      style="flex: 1; line-height: 1"
      v-model="toolboxFilterKey"
      :placeholder="$t('msgs.locate_translate_pa')"
      @keyup.enter="toolboxFilterKeyChange"
      @keyup.esc="toolboxFilterKey = ''"
    />
    <template v-if="toolboxFilterEls.length">{{
      `${toolboxFilterIndex}/${toolboxFilterEls.length}`
    }}</template>

    <!-- {{ i18nMainStore.filePathArr.join('/') }}-->

    <ViewPortWindow
      :visible="!!analyseMessage"
      @update:visible="() => (analyseMessage = '')"
      :init-win-options="{
        width: '500px',
        height: '500px',
      }"
    >
      <template #titleBarLeft>{{ $t('msgs.fen_xi_fan_yi_shu') }}</template>
      <textarea class="analyse-textarea vp-input font-code" :value="analyseMessage" readonly />
    </ViewPortWindow>
  </div>
</template>

<style lang="scss" scoped>
.action-row {
  font-size: 12px;
  border: none;
  border-bottom: 1px solid $color_border;
  position: relative;
  z-index: 1;
  gap: 4px;
  padding: 4px 10px;
  display: flex;
  .vp-button,
  .vp-input {
    font-size: 12px;
    padding: 2px 4px;
    height: auto;
  }

  .analyse-textarea {
    width: 100%;
    box-sizing: border-box;
    font-size: 12px;
    height: 100%;
    line-height: 1.8;
  }
}
</style>
