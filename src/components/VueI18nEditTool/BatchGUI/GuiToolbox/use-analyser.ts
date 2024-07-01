import {I18N_JSON_OBJ_ROOT_KEY_NAME, ITranslateTreeItem} from '@/enum/vue-i18n-tool'
import _get from 'lodash/get'
import {unicodeProgressBar} from '@/utils/unicode-progress-bar'
import {useI18n} from 'vue-i18n'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import {useGuiToolbox} from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-gui-toolbox'

export const useBatchTranslateAnalyser = () => {
  const {t: $t} = useI18n()
  const i18nMainStore = useI18nMainStore()
  const {getSubItems} = useGuiToolbox()

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
      // console.log(...args)
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
          let tipText = `  ${spaces}${symbolTable}[${
            percent === 100 ? '✅' : '⚠️'
          }] ${bar} (${count}/${len}) ${i.key}`
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

    // console.warn('====== [recursiveAnalyzeTranslateTree] Start ======')
    recursiveAnalyzeTranslateTree(i18nMainStore.translateTreeRoot)
    // console.warn('====== [recursiveAnalyzeTranslateTree] End ======')
    return log
  }

  const analyseMessage = ref('')

  const handleAnalyse = async () => {
    analyseMessage.value = printAnalytics()
    window.$message.success('Open console to view results.')
    await printAllInfo()
  }

  return {
    handleAnalyse,
    analyseMessage,
  }
}
