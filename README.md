# PageCraft

- 在线版：[PageCraft](https://canwdev.github.io/page-craft-vite/#/)
- 现已支持客户端，完全离线，使用Tauri技术构建，[去Release页面下载](https://github.com/canwdev/page-craft-vite/releases)
- [更新说明](./release-notes.md)
- [English Version](./README-en.md)

PageCraft 是一个网页快速生成工具，可以帮助您快速创建页面的 DOM 结构，并使用集成了 Monaco Editor 的 SCSS 编辑器直接在页面上修改样式。通过此工具，您可以快速实现静态内容。此外，它还包含了许多提升效率的小工具，比如文本转换器、多语言 JSON 文件批量编辑器等。让 PageCraft 成为您构建网页的得力助手！

![img](./screenshot.png)

## 功能

- **HTML 元素编辑**：创建、插入、删除和拖放 HTML 元素。
- **组件管理**：
  - 导入和导出所有组件为 JSON 格式。
  - 为方便访问，给组件加星标。
  - 对组件截图。
  - 预览组件。
  - 将组件作为模板拖放到画布上。
- **导入和导出**：
  - 导出为 HTML/邮件适用的 HTML。
  - 导出为 Vue 2/3 的单文件组件文件。
- **工具**：
  - Stylus 格式化工具。
  - Excel 复制工具。
  - 文本转换器。
  - Vue-i18n JSON 编辑器。
  - Vue-i18n 多语言文件夹批量处理工具。

## 提示

避免像 `<h1>TestH1<h2>TestH2</h2></h1>` 这样嵌套 HTML 元素。虽然可以在编辑器中插入，但它不符合 HTML 规范，导入后也无法复原。

## 参考

- [Minecraft Assets](https://mcasset.cloud/)
- [Live editor for CSS, Less & Sass - Magic CSS](https://chrome.google.com/webstore/detail/live-editor-for-css-less/ifhikkcafabcgolfjegfcgloomalapol/related?utm_source=chrome-ntp-icon)
- [Stylus Supermacy](https://thisismanta.github.io/stylus-supremacy/#demo)
- [Juice](https://github.com/Automattic/juice)
