# PageCraft

Web page rapid generation tool, through this tool you can quickly create the DOM structure of the page, support to modify the style directly on the page, with Chrome DevTools can quickly achieve static content.

网页快速生成工具，通过这个工具你可以快速创建页面的DOM结构，支持直接在页面上修改样式，配合 Chrome DevTools 可以快速实现静态内容。

![img](./screenshot.png)

## Features

- [x] HTML 元素编辑、插入、删除、拖拽
- [x] 组件管理
  - [x] 导入导出所有组件json
  - [x] 组件加星标
  - [x] 组件截图
  - [x] 组件预览
  - [x] 组件作为模板拖拽进画布
- [x] 导入/导出功能
  - [x] 导出为 HTML/邮件专用HTML
  - [x] 导出为 Vue2/3 单文件组件文件
- 小工具
    - [x] stylus 格式化工具
    - [x] Excel 复制工具
    - [x] vue-i18n json 编辑器
    - [x] vue-i18n 多语言文件夹批量处理工具

## Tips

Do not do nesting like `<h1>TestH1<h2>TestH2</h2></h1>`. Although it can be inserted in the editor, it does not conform to the HTML specification and cannot be restored after importing.

请勿做类似 `<h1>TestH1<h2>TestH2</h2></h1>` 这样的嵌套，虽然在编辑器中可以插入，但是这样不符合 HTML 规范，导入后也无法复原。

## Reference

- [Minecraft Assets](https://mcasset.cloud/)
- [Live editor for CSS, Less & Sass - Magic CSS](https://chrome.google.com/webstore/detail/live-editor-for-css-less/ifhikkcafabcgolfjegfcgloomalapol/related?utm_source=chrome-ntp-icon)
- [Stylus Supermacy](https://thisismanta.github.io/stylus-supremacy/#demo)
- [Juice](https://github.com/Automattic/juice)
