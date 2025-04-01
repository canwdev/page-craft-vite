import DropdownMenu from './DropdownMenu.vue'
import {QuickOptionItem} from '@/components/VgoUI/packages/QuickOptions/enum'

export const renderDropdownMenu = (options: QuickOptionItem[] = [], props?) => {
  return h(DropdownMenu, {options, props})
}
