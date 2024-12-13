# PageCraft - 网页开发效率工具

- 在线版：[PageCraft](https://canwdev.github.io/page-craft-vite/#/)
- 现已支持客户端，完全离线，使用Tauri技术构建，[去Release页面下载](https://github.com/canwdev/page-craft-vite/releases)
- [更新说明](./public/release-notes.md)
- [English Version](./README-en.md)

PageCraft 是一站式网页开发辅助工具，帮助开发者极速构建静态页面和组件，提升开发效率。

![img](./screenshot.png)

### 关键特性

- **完全开源**：完全开源，代码可审查，不收集任何用户信息
- **可视化 DOM 编辑**：拖拽式HTML元素构建，告别繁琐代码编写
- **实时样式编辑**：内置 Monaco Editor，实时预览 SCSS 样式变化
- **组件管理**：支持组件导入/导出、收藏、截图和模板复用
- **多格式导出**：一键导出 HTML、邮件模板、Vue 2/3 单文件组件
- **效率工具集**：
  - 文本转换器
  - Excel 数据处理
  - 多语言 JSON 编辑器
  - Stylus 转 SCSS 格式化
  - AI 聊天工具，纯前端发起请求，支持代理，支持 OpenAI/GPT 和 Anthropic/Claude 模型
  - 其他小工具，如 base64 转换，屏幕取色器，二维码生成等，插件系统支持自定义实现小工具

## 在 Linux/macOS/Web 下使用

> 也可以自行编译目标系统的 Tauri 程序

1. 安装 nginx，例：Ubuntu/Debian 运行 `apt install nginx`
2. 下载 [Releases](https://github.com/canwdev/page-craft-vite/releases) 文件 `dist.zip` 并解压到 `/var/www/html/page-craft-vite/`
3. 访问 `http://localhost/page-craft-vite`

## 提示

避免像 `<h1>TestH1<h2>TestH2</h2></h1>` 这样嵌套 HTML 元素。虽然可以在编辑器中插入，但它不符合 HTML 规范，导入后也无法复原。

## 参考

- [Minecraft Assets](https://mcasset.cloud/)
- [Live editor for CSS, Less & Sass - Magic CSS](https://chrome.google.com/webstore/detail/live-editor-for-css-less/ifhikkcafabcgolfjegfcgloomalapol/related?utm_source=chrome-ntp-icon)
- [Stylus Supermacy](https://thisismanta.github.io/stylus-supremacy/#demo)
- [Juice](https://github.com/Automattic/juice)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=canwdev/page-craft-vite&type=Date)](https://star-history.com/#canwdev/page-craft-vite&Date)
