<script lang="ts" setup="">
import type { QuickOptionItem } from '@canwdev/vgo-ui/src/components/QuickOptions/enum'
import DropdownMenu from '@canwdev/vgo-ui/src/components/QuickOptions/DropdownMenu.vue'
import ViewPortWindow from '@canwdev/vgo-ui/src/components/ViewPortWindow/index.vue'
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBatchTranslateAnalyser } from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-analyser'
import { useGuiToolbox } from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-gui-toolbox'
import { useBatchTranslateRefactor } from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-refactor'
import { useI18nMainStore } from '@/components/VueI18nEditTool/store/i18n-tool-main'

interface Props {
  isBatchMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  isBatchMode: false,
})
const emit = defineEmits(['reloadTranslates'])
const tiSelector = '.translate-item'
const { t: $t } = useI18n()
const i18nMainStore = useI18nMainStore()

const { getArrayFromRight, pasteJsonOverrideRight } = useGuiToolbox()

onMounted(() => {
  locateSelectedPath()
})

function locateSelectedPath() {
  const currentPath = i18nMainStore.translatePath
  if (!currentPath) {
    return
  }
  const el = document.querySelector(`${tiSelector}[data-translate-path="${currentPath}"]`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('t_selected')
  }
}

const { handleAnalyse, analyseMessage } = useBatchTranslateAnalyser()
const { handleDeleteKeys, handleRenameKeys, handleGptTranslate } = useBatchTranslateRefactor(emit)

const guiToolboxOptions = computed((): QuickOptionItem[] => {
  const currentPath = i18nMainStore.translatePath
  return [
    {
      label: `🔍 ${$t('i18n_tools.fen_xi_fan_yi_shu')}`,
      props: {
        onClick: () => handleAnalyse(),
      },
    },
    {
      label: `✨ ${$t('i18n_tools.a_i_translate')}`,
      disabled: !currentPath,
      props: {
        onClick: () => handleGptTranslate(),
      },
    },
    { split: true },
    {
      label: `📋 ${$t('msgs.copy_json_from_right')}`,
      disabled: !currentPath,
      props: {
        onClick: async () => {
          window.$mcUtils.copy(await getArrayFromRight())
        },
      },
    },
    {
      label: `📋 ${$t('msgs.paste_json_override_right')}`,
      disabled: !currentPath,
      props: {
        onClick: () => pasteJsonOverrideRight(),
      },
    },
    { split: true },
    {
      label: '❌ ' + `${$t('actions.refactor')}: ${$t('i18n_tools.delete_keys')}`,
      disabled: !currentPath,
      props: {
        onClick: () => handleDeleteKeys(),
      },
    },
    {
      label: '✏️ ' + `${$t('actions.refactor')}: ${$t('i18n_tools.rename_keys')}`,
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

function toolboxFilterKeyChange() {
  if (!toolboxFilterEls.value.length) {
    Array.from(document.querySelectorAll(tiSelector)).forEach((el) => {
      el.classList.remove('t_highlight')
      el.classList.remove('t_highlight_current')
    })
    toolboxFilterEls.value = Array.from(
      document.querySelectorAll(
        `${tiSelector}[data-translate-path*="${toolboxFilterKey.value.trim()}"]`,
      ),
    ) as HTMLElement[]
  }
  const els = toolboxFilterEls.value

  // 循环定位高亮项目
  if (toolboxFilterIndex.value >= els.length) {
    toolboxFilterIndex.value = 0
  }
  els.forEach((el, index) => {
    // const key = el.getAttribute('data-translate-path')
    if (index === toolboxFilterIndex.value) {
      // console.log('scrollIntoView', index, el)
      el.classList.add('t_highlight_current')
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    else {
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
  <div class="vgo-bg action-row">
    <template v-if="isBatchMode">
      <DropdownMenu :options="guiToolboxOptions">
        <button class="vgo-button" :title="$t('common.tools')">
          <span class="mdi mdi-tools" />
        </button>
      </DropdownMenu>
      <button
        v-if="i18nMainStore.translatePath"
        class="vgo-button"
        :title="$t('i18n_tools.locate_translate_pa')"
        @click="locateSelectedPath()"
      >
        <span class="mdi mdi-target" />
      </button>
    </template>

    <input
      v-model="toolboxFilterKey"
      class="vgo-input font-code"
      style="flex: 1; line-height: 1"
      :placeholder="$t('i18n_tools.filter_translate_ke')"
      @keyup.enter="toolboxFilterKeyChange"
      @keyup.esc="toolboxFilterKey = ''"
    >
    <template v-if="toolboxFilterEls.length">
      {{
        `${toolboxFilterIndex}/${toolboxFilterEls.length}`
      }}
    </template>

    <!-- {{ i18nMainStore.filePathArr.join('/') }} -->

    <ViewPortWindow
      :visible="!!analyseMessage"
      :init-win-options="{
        width: '500px',
        height: '500px',
      }"
      @update:visible="() => (analyseMessage = '')"
    >
      <template #titleBarLeft>
        {{ $t('i18n_tools.fen_xi_fan_yi_shu') }}
      </template>
      <textarea class="analyse-textarea vgo-input font-code" :value="analyseMessage" readonly />
    </ViewPortWindow>
  </div>
</template>

<style lang="scss" scoped>
.action-row {
  font-size: 12px;
  border: none;
  border-bottom: 1px solid var(--vgo-color-border);
  position: relative;
  z-index: 1;
  gap: 4px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  .vgo-button,
  .vgo-input {
    font-size: 12px;
    padding: 2px 4px;
    height: 26px;
  }

  .vgo-button {
    .mdi {
      font-size: 16px;
    }
  }

  .vgo-input {
    padding: 2px 8px;
    box-sizing: border-box;
    min-width: 50px;
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
