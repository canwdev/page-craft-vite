import {MessageApiInjection} from 'naive-ui/es/message/src/MessageProvider'
import {DialogApiInjection} from 'naive-ui/es/dialog/src/DialogProvider'
import {NotificationApiInjection} from 'naive-ui/es/notification/src/NotificationProvider'
import VueRouter, {Route} from 'vue-router'
import {QuickLaunchPlugin} from '@/components/QuickLaunch/q-logics/plugins'

declare global {
  interface Window {
    $message: MessageApiInjection
    $notification: NotificationApiInjection
    $dialog: DialogApiInjection
    $loadingBar: LoadingBarApiInjection
    Sass: any
    stylusSupermacyFormat: any
    $juice: any
    XLSX: any
    pinyinUtil: any // https://github.com/sxei/pinyinjs/
    __TAURI__: any
    $mcUtils: any
    $qlUtils: any
    BrowserFS: any
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
  }
}
