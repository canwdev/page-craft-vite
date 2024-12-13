# PageCraft - Web Development Efficiency Tool

- Online Version: [PageCraft](https://canwdev.github.io/page-craft-vite/#/)
- Now supports client-side, fully offline, built with Tauri technology. [Download from Release page](https://github.com/canwdev/page-craft-vite/releases)
- [Release Notes](./public/release-notes.md)
- [Chinese Version](./README.md)

PageCraft is an all-in-one web development assistant tool designed to help developers quickly build static pages and components, enhancing development efficiency.

![img](./screenshot.png)

### Key Features

- **Fully Open Source**: Completely open source, code is auditable, no user information is collected.
- **Visual DOM Editing**: Drag-and-drop HTML element construction, saying goodbye to tedious code writing.
- **Real-time Style Editing**: Built-in Monaco Editor, preview SCSS style changes in real-time.
- **Component Management**: Supports component import/export, favorites, screenshots, and template reuse.
- **Multi-format Export**: One-click export to HTML, email templates, Vue 2/3 single-file components.
- **Efficiency Toolset**:
  - Text Converter
  - Excel Data Processing
  - Multi-language JSON Editor
  - Stylus to SCSS Formatter
  - AI Chat Tool, initiate requests purely in the front end, supports proxy, and supports OpenAI/GPT and Anthropic/Claude models.
  - Other small tools, such as base64 converter, screen color picker, QR code generator, etc. The plugin system supports custom implementations of small tools.

## Using on Linux/macOS/Web

> You can also compile the Tauri program for your target system yourself.

1. Install nginx, for example: Run `apt install nginx` on Ubuntu/Debian.
2. Download the `dist.zip` file from [Releases](https://github.com/canwdev/page-craft-vite/releases) and unzip it to `/var/www/html/page-craft-vite/`.
3. Access `http://localhost/page-craft-vite`.

## Tips

Avoid nesting HTML elements like `<h1>TestH1<h2>TestH2</h2></h1>`. Although it can be inserted in the editor, it does not conform to the HTML specification and cannot be restored after importing.

## Reference

- [Minecraft Assets](https://mcasset.cloud/)
- [Live editor for CSS, Less & Sass - Magic CSS](https://chrome.google.com/webstore/detail/live-editor-for-css-less/ifhikkcafabcgolfjegfcgloomalapol/related?utm_source=chrome-ntp-icon)
- [Stylus Supermacy](https://thisismanta.github.io/stylus-supremacy/#demo)
- [Juice](https://github.com/Automattic/juice)
- [Material Design Icons](https://pictogrammers.com/library/mdi/)
