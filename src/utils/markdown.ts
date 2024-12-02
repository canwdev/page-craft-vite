import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import mathjax3 from 'markdown-it-mathjax3'
import 'highlight.js/styles/github-dark.css'

// 兼容不能识别的语言
const langMap = {
  vue: 'html',
}
const getLang = (lang: string) => {
  lang = lang.toLowerCase()
  return langMap[lang] || lang
}

const md = new MarkdownIt({
  linkify: true,
  breaks: true, // 启用换行
  highlight(code: string, lang: string) {
    let langDisplay = lang
    lang = getLang(lang)
    if (lang !== langDisplay) {
      langDisplay = `${langDisplay} (${lang})`
    }
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    const content = hljs.highlight(code, {language: language, ignoreIllegals: true}).value
    return `<pre class="hljs-code-container"><div class="hljs-code-header vp-panel"><span>${langDisplay}</span><button class="hljs-copy-button btn-no-style mdi mdi-content-copy" title="Copy"></button></div><code class="hljs language-${language}">${content}</code></pre>`
  },
})
md.use(mathjax3)
export default md
