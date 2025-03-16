# Release Notes

## v1.7.8

- TBD: 重构多语言编辑器
- add: Vue SFC组件多语言提取工具，基于 AST(抽象语法树) 实现
- remove: 删除不需要的功能

## v1.7.7

- refactor: 重构窗口系统
- AI
  - 增加 OpenAI 兼容模型
  - 代码块支持直接下载
  - 优化了生成中的滚动逻辑
  - 支持切换代码块的明暗主题
- add: 支持二维码图片扫描，图像信息工具
- fix: 修复部分bug

## v1.7.6

- AI: 支持 Anthropic/Claude 模型
- AI: 支持 GPT o1 模型
- AI: 优化图片发送
- AI: 支持导出聊天为 PDF/HTML
- add: 支持展示 Release Notes
- add: 支持导入/导出全部设置
- add: Material Design Icons Viewer
- add: Vue 3 SFC Loader
- add: Stock Tracker / Fire Calc
- optimize: UI 交互优化

## v1.7.5

- refactor: 重构组件库，将 Naive UI 替换为 Element Plus
- refactor: 整合内置组件库为 CanUI
- refactor: 重构图标 [xicons](https://www.xicons.org/#/) 为 [Font Awesome Icons](https://fontawesome.com/v4/icons/)
- optimize: 优化 ChatGPT 交互，支持停止生成，允许在生成时滚动
- optimize: 优化多语言工具
- optimize: 优化主题UI
- optimize: 显示更新内容

## v1.7.1

- fix: element edit
- optimize: 优化AI使用体验
- optimize: 交互细节优化

## v1.7.0

- add: AI 整合 ChatGPT
- add: 表单生成组件(Naive UI)
- add: 多语言(json)文件夹编辑器 新增重构key功能
- add: QuickOptions 显示当前菜单的标题
- optimize: 多语言(json)文件夹编辑器 键名定位功能优化
- optimize: 部分窗口初始化尺寸优化
- optimize: 标签属性编辑优化
- optimize: 多语言文案更新

## v1.6.7

- fix: 自定义Plugin刷新时清除之前的自定义插件 bug
- optimize: 插件系统、UI细节优化
- fix: PageCraft 导出组件为HTML时如果有scss变量会报错
- fix: PageCraft 创建组件后不自动高亮组件卡片

## v1.6.6

- fix: 修复一些 bug
- fix: 修复 PageCraft 主画布右键根元素编辑、粘贴
- add: PageCraft Playground 页面增加撤销、避免加载不需要的组件
- add: PageCraft 组件新增导入/导出文件夹功能
- fix: 修复 多语言文件夹编辑器 JSON>TEXT，重新支持使用 Monaco Editor
- add: 新增 TinyMCE 富文本编辑器工具
- optimize: 插件系统优化
