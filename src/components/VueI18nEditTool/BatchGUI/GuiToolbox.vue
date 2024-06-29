<script lang="ts" setup="">
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import {useI18n} from 'vue-i18n'
import {BatchListItem, useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {readClipboardData} from '@/utils'
import {ref} from 'vue'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {useDebounceFn} from '@vueuse/core'
import {b} from 'vite/dist/node/types.d-FdqQ54oU'
import {I18N_JSON_OBJ_ROOT_KEY_NAME, ITranslateTreeItem} from '@/enum/vue-i18n-tool'
import _get from 'lodash/get'
import {unicodeProgressBar} from '@/utils/unicode-progress-bar'
import {useGpt} from '@/components/AiTools/use-gpt'
import {ChatCompletion, GptMessage} from '@/components/AiTools/types/openai'
import {useGuiToolbox} from '@/components/VueI18nEditTool/BatchGUI/hooks/use-gui-toolbox'
import {blinkPanel} from '@/utils/anim'

const tiSelector = '.translate-item'
const {t: $t} = useI18n()
const i18nMainStore = useI18nMainStore()

const {getSubItems, getArrayFromRight, pasteJsonOverrideRight, handleGptTranslate} = useGuiToolbox()

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
    el.classList.add('t_selected')
    el.scrollIntoView({behavior: 'smooth', block: 'center'})
  }
}

// 打印所有数据
const printAllInfo = async () => {
  console.warn('====== [printAllInfo] Start ======')
  console.log('[dirTree]', i18nMainStore.dirTree)
  console.log('[translateTreeRoot]', i18nMainStore.translateTreeRoot)
  console.log('[translatePath]', i18nMainStore.translatePath)
  console.log('[filePathArr]', i18nMainStore.filePathArr)
  console.log('[batchList]', i18nMainStore.batchList)
  const items: any = await getSubItems()
  console.log('[getSubItems]', items)
  console.warn('====== [printAllInfo] End ======')
  return {items}
}

// 打印分析数据
const printAnalytics = () => {
  let log = ``
  const printLog = (...args) => {
    log += args.join(' ') + '\n'
    console.log(...args)
  }
  const recursiveAnalyzeTranslateTree = (
    tree: ITranslateTreeItem[],
    depth = 0,
    parents: string[] = [],
    path: string = ''
  ) => {
    if (!tree || !tree.length) {
      return
    }
    tree.forEach((t, tIdx) => {
      const spaces = '  '.repeat(depth)
      const nextParents = [...parents, t.namespace]
      printLog(`${spaces}[🟢] ${t.namespace}`)
      t.translates.forEach((i, idx) => {
        const symbolTable = idx === t.translates.length - 1 ? '└─' : '├─'

        // 统计翻译数量
        let count = 0
        // 忽略未创建的文件夹
        const filteredBatchList = i18nMainStore.batchList.filter(({json}) => {
          return !!json
        })
        const len = filteredBatchList.length
        const missingDirs: string[] = []
        filteredBatchList.forEach(({rootDir, json}) => {
          // 获取翻译key路径（去除虚拟根节点）
          let tPath = nextParents.join('.') + '.' + i.key
          const regex = new RegExp(I18N_JSON_OBJ_ROOT_KEY_NAME + '.', 'g')
          tPath = tPath.replace(regex, '')
          const tVal = _get(json, tPath)
          // console.debug(tPath, json, tVal)
          if (tVal) {
            count++
          } else {
            missingDirs.push(rootDir.label)
          }
        })

        const percent = (count / len) * 100
        const bar = unicodeProgressBar(percent)
        let tipText = `  ${spaces}${symbolTable}[${percent === 100 ? '✅' : '⚠️'}] ${
          i.key
        } ${bar} ${percent.toFixed(0)}% (${count}/${len})`
        if (missingDirs.length) {
          tipText += ` | ${missingDirs.join(',')}`
        }
        printLog(tipText)
        // console.debug(i, nextParents)
      })
      recursiveAnalyzeTranslateTree(t.children, depth + 1, nextParents)
    })

    return log
  }

  console.warn('====== [recursiveAnalyzeTranslateTree] Start ======')
  recursiveAnalyzeTranslateTree(i18nMainStore.translateTreeRoot)
  console.warn('====== [recursiveAnalyzeTranslateTree] End ======')
  return log
}

const handleAnalyse = async () => {
  const log = printAnalytics()
  window.$message.success('Open console to view results.')

  window.$dialog.info({
    title: $t('msgs.fen_xi_fan_yi_shu'),
    content: () =>
      h('textarea', {
        value: log,
        rows: 20,
        class: 'font-code vp-bg',
        style: `width: 100%;
box-sizing: border-box;
font-size: 12px;
scrollbar-width: thin;
height: 495px;`,
      }),
  })
  await printAllInfo()
}

const isShowToolboxMenu = ref(false)
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
      label: $t('msgs.locate_translate_pa'),
      disabled: !currentPath,
      props: {
        onClick: () => locateSelectedPath(),
      },
    },
    {
      label: 'GPT Translate',
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
  ]
})

// 过滤key
const toolboxFilterKey = ref('')
const toolboxFilterKeyChange = useDebounceFn(() => {
  const els = document.querySelectorAll(
    `${tiSelector}[data-translate-path*="${toolboxFilterKey.value.trim()}"]`
  )
  Array.from(els).forEach((el, index) => {
    const key = el.getAttribute('data-translate-path')
    if (index === 0) {
      el.scrollIntoView({behavior: 'smooth', block: 'center'})
    }

    // 高亮动画
    if (key !== i18nMainStore.translatePath) {
      blinkPanel(el as HTMLElement)
    }
  })
}, 500)
</script>

<template>
  <div class="vp-bg action-row">
    <button
      class="vp-button"
      @click="isShowToolboxMenu = !isShowToolboxMenu"
      @mouseover="isShowToolboxMenu = true"
    >
      {{ $t('common.tools') }}
    </button>

    <input
      class="vp-input font-code"
      style="flex: 1; line-height: 1"
      v-model="toolboxFilterKey"
      :placeholder="$t('msgs.locate_translate_pa')"
      @input="toolboxFilterKeyChange"
      @keyup.enter="toolboxFilterKeyChange"
      @keyup.esc="toolboxFilterKey = ''"
    />

    <!-- {{ i18nMainStore.filePathArr.join('/') }}-->
    <transition name="fade-scale">
      <QuickOptions
        style="top: 100%"
        v-model:visible="isShowToolboxMenu"
        :options="guiToolboxOptions"
        @mouseleave="isShowToolboxMenu = false"
      />
    </transition>
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
}
</style>
