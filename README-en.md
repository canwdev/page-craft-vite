# PageCraft

- Online version: [PageCraft](https://canwdev.github.io/page-craft-vite/#/)
- Now available for desktop app with Tauri technology, completely offline, [download from the Release page](https://github.com/canwdev/page-craft-vite/releases)
- [Release Notes](./release-notes.md)
- [中文版](./README.md)

PageCraft is a web page rapid generation tool that allows you to quickly create the DOM structure of a page and directly modify styles using the integrated SCSS editor with Monaco Editor. With this tool, you can quickly implement static content. Additionally, it includes many productivity-enhancing utilities, such as a text converter and a batch editor for multilingual JSON files. Let PageCraft be your powerful assistant in building web pages!

![img](./screenshot.png)

## Features

- **HTML Element Editing**: Create, insert, delete, and drag and drop HTML elements.
- **Component Management**:
    - Import and export all components in JSON format.
    - Star components for easy access.
    - Take screenshots of components.
    - Preview components.
    - Drag and drop components as templates onto the canvas.
- **Import and Export**:
    - Export as HTML/email-ready HTML.
    - Export as Vue 2/3 single-file component files.
- **Utilities**:
    - Stylus formatter.
    - Excel copy tool.
    - Vue-i18n JSON editor.
    - Vue-i18n folder batch processing tool.

## For Linux users

1. Install nginx: `apt install nginx`
2. Download [Releases](https://github.com/canwdev/page-craft-vite/releases) `dist.zip` and unzip its contents to `/var/www/html/page-craft-vite/`
3. Visit `http://localhost/page-craft-vite`

## Tips

Avoid nesting HTML elements like `<h1>TestH1<h2>TestH2</h2></h1>`. Although it can be inserted in the editor, it does not conform to the HTML specification and cannot be restored after importing.

## Reference

- [Minecraft Assets](https://mcasset.cloud/)
- [Live editor for CSS, Less & Sass - Magic CSS](https://chrome.google.com/webstore/detail/live-editor-for-css-less/ifhikkcafabcgolfjegfcgloomalapol/related?utm_source=chrome-ntp-icon)
- [Stylus Supermacy](https://thisismanta.github.io/stylus-supremacy/#demo)
- [Juice](https://github.com/Automattic/juice)
