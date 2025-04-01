import monaco from '@canwdev/vgo-ui/src/components/VueMonaco/monaco-helper'

interface IHistoryItem {
  label: string
  count: number
}
export interface ISnippetItem {
  label: string
  code?: string
  snippet?: string
  children?: ISnippetItem
}

interface IScssGlobal {
  $monacoClassNameHistory: IHistoryItem[]
  $monacoScssVariables: string[]
  $monacoScssSnippets: ISnippetItem[]
  $monacoScssSnippetsCustom: ISnippetItem[]
}

// monaco自动补全缓存
export const monacoStyleGlobal: IScssGlobal = {
  // Autocomplete输入框输入的类名历史记录
  $monacoClassNameHistory: [],
  // 其他编辑器的变量和类名
  $monacoScssVariables: [],
  // 预设Snippets
  $monacoScssSnippets: [],
  // 自定义Snippets
  $monacoScssSnippetsCustom: [],
}

// monaco编辑器:注册快捷自动补全提示
monaco.languages.registerCompletionItemProvider('scss', {
  // 提示：输入“`”可以展示Snippets
  triggerCharacters: ['.', '$', '`'],
  provideCompletionItems: (model, position) => {
    const getCommonOptions = () => ({
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: new monaco.Range(position.lineNumber, 1, position.lineNumber, position.column),
    })

    // scss 类名自动补全
    const getClassNameSuggestions = (arr: IHistoryItem[] = []) => {
      return (arr || []).map((item) => {
        let sl = ''
        item.label.split(' ').forEach((c) => {
          sl += '.' + c
        })
        return {
          ...getCommonOptions(),
          kind: monaco.languages.CompletionItemKind.Keyword,
          label: `${sl}`,
          insertText: `${sl} {
  \${1:}
}`,
        }
      })
    }

    // scss 代码片段自动补全
    const getScssSnippetSuggestions = (arr: ISnippetItem[] = []) => {
      return (arr || []).map((item) => {
        let label = item.label.toLowerCase()
        // 如果标题前面没有“.”，就添加“`”符号，避免高频词汇占用，输入“`”触发更加方便
        if (!/^\./g.test(label)) {
          label = '`' + label
        }
        return {
          ...getCommonOptions(),
          label: label,
          insertText: item.snippet,
          kind: monaco.languages.CompletionItemKind.Snippet,
        }
      })
    }

    // scss 变量自动补全
    const getScssVariablesSuggestions = (arr: string[] = []) => {
      return (arr || []).map((val) => {
        return {
          ...getCommonOptions(),
          label: val,
          insertText: val,
          kind: monaco.languages.CompletionItemKind.Variable,
        }
      })
    }

    return {
      suggestions: [
        ...getClassNameSuggestions(monacoStyleGlobal.$monacoClassNameHistory),
        ...getScssVariablesSuggestions(monacoStyleGlobal.$monacoScssVariables),
        ...getScssSnippetSuggestions(monacoStyleGlobal.$monacoScssSnippets),
        ...getScssSnippetSuggestions(monacoStyleGlobal.$monacoScssSnippetsCustom),
      ],
    }
  },
})
