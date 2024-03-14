import {Ref} from 'vue'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {copy} from '../utils'
import DynamicValueDisplay from '../DynamicValueDisplay.vue'
import * as changeCase from 'change-case'

export const qLogicSystemFonts = (valRef: Ref<string>): QuickOptionItem => {
  return {
    label: 'System Fonts',
    children: async () => {
      const fonts = await window.queryLocalFonts()

      return [
        ...fonts.map((v) => {
          return {
            label: v.fullName,
            props: {
              onClick: () => {
                copy(v.fullName, true)
              },
              style: {fontFamily: v.fullName},
            },
          }
        }),
      ]
    },
  }
}
