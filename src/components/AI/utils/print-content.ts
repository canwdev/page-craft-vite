export const getChatContentHtml = async (el: Element, title) => {
  let html: string = ''
  html += `<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${title}</title>`

  // 添加样式
  const cssModule = await import('@/styles/markdown/github-markdown.css?raw')
  const markdownStyle = cssModule.default

  const hljsStyleModule = await import('highlight.js/styles/github.css?raw')
  const hljsStyle = hljsStyleModule.default

  html += `<style>body { font-family: Arial, sans-serif; }
* {box-sizing: border-box;}
${markdownStyle}
${hljsStyle}
.ai-chat-bubble-system {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #dddddd;
    font-size: 12px;
    color: #8a8a8a;
}
.btn-jump-wrap {
    display: none;
}
.chat-actions button {
    display: none;
}
.chat-date {
    margin-top: 10px;
    opacity: .5;
}
.chat-header {
    margin: -10px -10px 10px;
    padding: 4px 10px;
    background-color: #F6F8FA;
}
.chat-avatar {
    display: flex;
    align-items: center;
    height: 32px;
    gap: 10px;
}
.chat-avatar img {
    width: 32px;
    height: 32px;
}
.chat-username {
    font-weight: bold;
}
.ai-chat-bubble {
    border: 1px solid #dddddd;
    margin: 10px 0;
    padding: 10px;
}
._js-action-button {
    display: none;
}
pre.hljs-code-container {
    padding: 0;
}
.hljs-code-header {
    padding: 2px 10px;
    opacity: .5;
}
.markdown-body pre > code {
    white-space: pre-wrap;
    padding: 10px;
}
img {
    max-width: 100%;
}
</style>`

  html += `</head><body>`
  html += el.innerHTML
  html += `</body></html>`
  return html
}

export const printChatContent = async (el: Element, printTitle = '') => {
  // 获取要打印的元素

  // 创建一个 iframe
  const iframe = document.createElement('iframe')

  // 设置 iframe 样式使其不可见
  iframe.style.position = 'absolute'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = 'none'

  // 将 iframe 添加到文档中
  document.body.appendChild(iframe)

  // 获取 iframe 的 window 和 document
  const iframeWindow = iframe.contentWindow
  const iframeDocument = iframeWindow!.document

  // 写入 HTML 内容
  iframeDocument.open()
  iframeDocument.write(await getChatContentHtml(el, printTitle))
  iframeDocument.close()

  // 延迟打印，确保内容加载完成
  setTimeout(() => {
    const backupTitle = document.title
    document.title = printTitle

    iframeWindow!.print()
    // 打印后移除 iframe
    document.body.removeChild(iframe)

    document.title = backupTitle
  }, 500)
}

// export const getChatContentMarkdown = async (messages: IMessageItem[], title = '') => {
//   let md = `# ${title}`
// }
