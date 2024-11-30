import {Ref} from 'vue'
import {QuickOptionItem} from '@/components/CanUI/packages/QuickOptions/enum'
import QrCodeDisplay from './QrCodeDisplay.vue'

export const qLogicQrCode = (valRef: Ref<string>): QuickOptionItem => {
  return {
    label: 'QR Code Generator',
    search: 'qrcode',
    iconClass: 'mdi mdi-qrcode-edit',
    children: [
      {
        label: 'text to QR Code',
        render: h(QrCodeDisplay, {text: valRef}),
      },
    ],
  }
}
