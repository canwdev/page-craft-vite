/*monaco config start*/
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}
/*monaco config end*/

import * as monaco from 'monaco-editor'

import {emmetCSS, registerCustomSnippets} from 'emmet-monaco-es'
emmetCSS(monaco, ['css', 'scss'])

registerCustomSnippets('css', {
  // 自定义emmet
  mdm: `@media screen and (max-width: $mq_mobile_width) {
  \${1:}
}`,
  rtl: `&:dir(rtl) {
  \${1:}
}`,
})

// 编辑器:注册快捷自动补全提示
monaco.languages.registerCompletionItemProvider('scss', {
  // triggerCharacters: ['.', '$'],
  triggerCharacters: ['$'],
  provideCompletionItems: (model, position) => {
    const getCommonOptions = () => ({
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: new monaco.Range(position.lineNumber, 1, position.lineNumber, position.column),
    })

    // 类名自动补全
    const classNameSuggestions = (window.$monacoClassNameHistory || []).map((item) => {
      let sl = ''
      item.label.split(' ').forEach((c) => {
        sl += '.' + c
      })
      return {
        ...getCommonOptions(),
        kind: monaco.languages.CompletionItemKind.Keyword,
        label: sl,
        insertText: `${sl} {
  \${1:}
}`,
      }
    })

    // scss 代码片段自动补全
    const scssSnippetsSuggestions = (window.$monacoScssSnippets || []).map((item) => {
      return {
        ...getCommonOptions(),
        label: item.label.toLowerCase(),
        insertText: item.code,
        kind: monaco.languages.CompletionItemKind.Snippet,
      }
    })

    // scss 变量自动补全
    const scssVariablesSuggestions = (window.$monacoScssVariables || []).map((val) => {
      return {
        ...getCommonOptions(),
        label: val,
        insertText: val,
        kind: monaco.languages.CompletionItemKind.Variable,
      }
    })

    return {
      suggestions: [
        ...classNameSuggestions,
        ...scssVariablesSuggestions,
        ...scssSnippetsSuggestions,
      ],
    }
  },
})

export default monaco
