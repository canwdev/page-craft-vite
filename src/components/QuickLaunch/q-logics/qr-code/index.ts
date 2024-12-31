import {Ref} from 'vue'
import {QuickOptionItem} from '@/components/CanUI/packages/QuickOptions/enum'
import QrCodeDisplay from './QrCodeDisplay.vue'
import QRScanner from './QRScanner.vue'

export const qLogicQrCode = (valRef: Ref<string>): QuickOptionItem => {
  return {
    label: 'QR Code',
    search: 'qrcode',
    iconClass: 'mdi mdi-qrcode',
    children: [
      {
        label: 'text to QR Code',
        render: h(QrCodeDisplay, {text: valRef}),
      },
      {
        label: 'Scan QR Code',
        render: h(QRScanner),
      },
    ],
  }
}
