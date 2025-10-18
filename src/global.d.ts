import type { ElNotification, Message } from 'element-plus'
import type { SFCInstallWithContext } from 'element-plus/es/utils'
import type VueRouter from 'vue-router'

declare global {
  interface Window {
    showOpenFilePicker: any

    $message: SFCInstallWithContext<Message>
    $notification: SFCInstallWithContext<ElNotification>
    $dialog: SFCInstallWithContext<ElMessageBox>

    $appList: ShortcutItem[]

    Sass: any
    stylusSupermacyFormat: any
    $juice: any
    XLSX: any

    isTauri: boolean

    // 拖拽组件到画布
    $draggingComponentExportData: any

    $mcUtils: any
    $qlUtils: any
    BrowserFS: any

    // https://www.npmjs.com/package/js-beautify
    js_beautify: any
    html_beautify: any
    css_beautify: any
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
  }
}
