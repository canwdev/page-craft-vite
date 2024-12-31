import VueRouter, {Route} from 'vue-router'
import {ElNotification, Message} from 'element-plus'
import {SFCInstallWithContext} from 'element-plus/es/utils'

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

    __TAURI__: any

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
