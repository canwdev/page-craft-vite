import {useRemoteOptions} from '@/components/CommonUI/QuickOptions/utils/use-remote-options'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {ISnippetItem, monacoStyleGlobal} from './use-monaco-helper'
import {useStorage} from '@vueuse/core'
import {StyleEditorKeys} from '@/components/StyleEditor/enum'

export const useSnippets = ({insertCode}) => {
  const customSnippets = useStorage<ISnippetItem[]>(StyleEditorKeys.CUSTOM_SNIPPETS, [])

  const updateCustomSnippetsSuggestion = () => {
    monacoStyleGlobal.$monacoScssSnippetsCustom = [...customSnippets.value]
  }
  onMounted(() => {
    updateCustomSnippetsSuggestion()
  })

  const getMenuItem = (item: ISnippetItem, addSnippetSuggestion) => {
    const r: QuickOptionItem = {
      label: item.label,
      props: {},
    }
    if (item.code || item.snippet) {
      addSnippetSuggestion(item)

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

  const traverseCustom = (list: any[] = [], result: QuickOptionItem[] = []) => {
    list.forEach((i: any) => {
      const r: QuickOptionItem = {
        children: i.children ? traverseCustom(i.children) : undefined,
        ...getMenuItem(i, (item) => {
          if (item.snippet) {
            // 只把snippet放入自动补全缓存，减少性能损耗
            monacoStyleGlobal.$monacoScssSnippetsCustom.push({
              label: item.label,
              snippet: item.snippet,
            })
          }
        }),
      }

      result.push(r)
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
      ...traverseCustom(customSnippets.value),
      {
        label: 'Manage',
        children: [
          {
            label: 'Add selection code to snippet',
            props: {
              onClick: () => {
                customSnippets.value.push({
                  label: 'custom123',
                  snippet: 'test',
                })
                updateCustomSnippetsSuggestion()
              },
            },
          },
          {
            label: 'Clear All',
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
