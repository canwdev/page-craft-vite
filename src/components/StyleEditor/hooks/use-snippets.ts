import {useRemoteOptions} from '@/components/CommonUI/QuickOptions/utils/use-remote-options'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {ISnippetItem, monacoStyleGlobal} from './use-monaco-helper'
import {useStorage} from '@vueuse/core'
import {StyleEditorKeys} from '@/components/StyleEditor/enum'

export const useSnippets = ({insertCode, vueMonacoRef}) => {
  const customSnippets = useStorage<ISnippetItem[]>(StyleEditorKeys.CUSTOM_SNIPPETS, [])

  const updateCustomSnippetsSuggestion = () => {
    monacoStyleGlobal.$monacoScssSnippetsCustom = []
    traverseCustomOptionsWithSuggestions(customSnippets.value)
  }
  onMounted(() => {
    updateCustomSnippetsSuggestion()
  })

  const getMenuItem = (item: ISnippetItem, addSnippetSuggestion?) => {
    const r: QuickOptionItem = {
      label: item.label,
      props: {},
    }
    if (item.code || item.snippet) {
      addSnippetSuggestion && addSnippetSuggestion(item)

      const code = item.snippet || item.code
      r.props!.onClick = async () => {
        insertCode(code)
      }
      r.props!.onContextmenu = async () => {
        window.$qlUtils.copy(code)
      }
    }
    return r
  }

  const traverseCustomOptionsWithSuggestions = (
    list: ISnippetItem[] = [],
    result: QuickOptionItem[] = []
  ) => {
    list.forEach((i: any) => {
      result.push({
        children: i.children ? traverseCustomOptions(i.children) : undefined,
        ...getMenuItem(i, (item) => {
          if (item.snippet) {
            // 只把snippet放入自动补全缓存，减少性能损耗
            monacoStyleGlobal.$monacoScssSnippetsCustom.push({
              label: item.label,
              snippet: item.snippet,
            })
          }
        }),
      })
    })
    return result
  }

  const traverseCustomOptions = (list: ISnippetItem[] = [], result: QuickOptionItem[] = []) => {
    list.forEach((i: any) => {
      result.push({
        children: i.children ? traverseCustomOptions(i.children) : undefined,
        ...getMenuItem(i),
      })
    })
    return result
  }

  // scss代码片段自动补全缓存
  const {options: toolOptions} = useRemoteOptions({
    fetchFn: async () => {
      const res = await fetch('./scss-snippets.json')
      return await res.json()
    },
    mapFn: (i) =>
      getMenuItem(i, (item) => {
        if (item.snippet) {
          // 只把snippet放入自动补全缓存，减少性能损耗
          monacoStyleGlobal.$monacoScssSnippets.push({
            label: item.label,
            snippet: item.snippet,
          })
        }
      }),
  })

  const snippetsOptions = computed((): QuickOptionItem[] => {
    return [
      ...toolOptions.value,
      {
        label: 'Manage',
        children: [
          {
            label: 'Add selection code to snippet',
            props: {
              onClick: async () => {
                const editor = vueMonacoRef.value.getInstance()

                const selection = editor.getSelection()
                let snippet = editor.getModel().getValueInRange(selection).trim()
                if (!snippet) {
                  window.$message.error('Please select code first!')
                  return
                }
                // 使用正则表达式匹配类名
                let classRegex = /\.(\w|-)+/g
                let match = classRegex.exec(snippet) || []
                console.log(match)
                let label = await window.$mcUtils.showInputPrompt({
                  title: 'Input snippet label',
                  value: match[0] || '',
                })
                if (!label) {
                  window.$message.error('Please input label!')
                  return
                }

                customSnippets.value.push({
                  label,
                  snippet,
                })

                updateCustomSnippetsSuggestion()
              },
            },
          },
          {
            label: 'Import JSON...',
            props: {
              onClick: async () => {
                const list = await window.$mcUtils.handleImportJson()
                customSnippets.value = list || []
                window.$message.success('Import success!')
              },
            },
          },
          {
            label: 'Export JSON...',
            props: {
              onClick: async () => {
                window.$mcUtils.handleExportFile(
                  await window.$mcUtils.promptGetFileName('ScssSnippets'),
                  JSON.stringify(customSnippets.value, null, 2),
                  '.json'
                )
              },
            },
          },
          {
            label: 'Clear All...',
            children: [
              {
                label: 'Confirm Clear All? OK',
                props: {
                  onClick: () => {
                    customSnippets.value = []
                    updateCustomSnippetsSuggestion()
                  },
                },
              },
            ],
          },
        ],
      },
      ...traverseCustomOptions(customSnippets.value),
    ]
  })

  // 创建【全局、变量】编辑器的变量字段补全
  const updateEditorAutoComplete = (style) => {
    const set = new Set<string>()

    // 使用正则表达式匹配类名和 SCSS 变量名
    let classRegex = /\.(\w|-)+/g
    let variableRegex = /\$[\w-]+/g
    let match

    while ((match = classRegex.exec(style)) !== null) {
      set.add(match[0])
    }

    while ((match = variableRegex.exec(style)) !== null) {
      set.add(match[0])
    }

    monacoStyleGlobal.$monacoScssVariables = Array.from(set)
  }

  return {
    snippetsOptions,
    updateEditorAutoComplete,
  }
}
