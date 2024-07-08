import hljs from 'highlight.js'
import MarkdownIt from 'markdown-it'
import mathjax3 from 'markdown-it-mathjax3'
import 'highlight.js/styles/github-dark.css'

const md = new MarkdownIt({
  linkify: true,
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    const content = hljs.highlight(code, {language: language, ignoreIllegals: true}).value
    return `<pre class="hljs-code-container"><div class="hljs-code-header vp-panel"><span>${language}</span><button class="hljs-copy-button btn-no-style" title="Copy">📋</button></div><code class="hljs language-${language}">${content}</code></pre>`
  },
})
md.use(mathjax3)
export default md
