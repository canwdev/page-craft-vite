import {MessageApiInjection} from 'naive-ui/es/message/src/MessageProvider'
import {DialogApiInjection} from 'naive-ui/es/dialog/src/DialogProvider'
import {NotificationApiInjection} from 'naive-ui/es/notification/src/NotificationProvider'

declare global {
  interface Window {
    $message: MessageApiInjection
    $notification: NotificationApiInjection
    $dialog: DialogApiInjection
    $loadingBar: LoadingBarApiInjection
    Sass: any
    stylusSupermacyFormat: any
    $juice: any
  }
}
