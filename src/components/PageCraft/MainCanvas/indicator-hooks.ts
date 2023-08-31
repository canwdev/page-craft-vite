import {LsKeys} from '@/enum/page-craft'
import {ActionType, BlockType} from '@/enum/page-craft/block'
import {useCraftStore} from '@/store/craft'
import {useI18n} from 'vue-i18n'

export type IndicatorOptions = {
  enableDevHelpClass: boolean
  enableExpand: boolean
  enableSelection: boolean
  fullWidth: boolean
  bgTransparentPercent: number
  bgDark: boolean
  centeredElementsY: boolean
  centeredElementsX: boolean
  showStyleEditor: boolean
  contentEditable: boolean
  enableRightClick: boolean
}

export const useIndicator = () => {
  const {t: $t} = useI18n()
  const craftStore = useCraftStore()

  const indicatorOptions = reactive<IndicatorOptions>(
    JSON.parse(localStorage.getItem(LsKeys.INDICATOR_OPTIONS) || 'null') || {
      enableDevHelpClass: true,
      enableExpand: true,
      enableSelection: false,
      fullWidth: false,
      bgDark: false,
      bgTransparentPercent: 100,
      centeredElementsY: false,
      centeredElementsX: false,
      showStyleEditor: false,
      contentEditable: false,
      enableRightClick: true,
    }
  )
  watch(
    indicatorOptions,
    () => {
      localStorage.setItem(LsKeys.INDICATOR_OPTIONS, JSON.stringify({...indicatorOptions}))
    },
    {deep: true}
  )

  const mainCanvasClass = computed(() => {
    const currentBlock = craftStore.currentBlock
    return {
      'page-craft-mc--dev': indicatorOptions.enableDevHelpClass,
      'page-craft-mc--cursor-insert': currentBlock.blockType !== BlockType.ACTIONS,
      'page-craft-mc--cursor-pickaxe': currentBlock.actionType === ActionType.DELETE,
      'page-craft-mc--cursor-arrow': currentBlock.actionType === ActionType.SELECTION,
      'page-craft-mc--cursor-sword': currentBlock.actionType === ActionType.DEBUG,
      'page-craft-mc--cursor-oaksign': currentBlock.actionType === ActionType.PASTE_REPLACE,
      'page-craft-mc--expand': indicatorOptions.enableExpand,
      'page-craft-mc--full-width': indicatorOptions.fullWidth,
      'page-craft-mc--centered-y': indicatorOptions.centeredElementsY,
      'page-craft-mc--centered-x': indicatorOptions.centeredElementsX,
      _dark: indicatorOptions.bgDark,
    }
  })

  const toggleList = [
    {
      flag: 'enableDevHelpClass',
      title: $t('common.outline'),
      desc: $t('msgs.add_1px_outline_per'),
    },
    {flag: 'enableExpand', title: $t('common.padding'), desc: $t('msgs.pad_each_element_wit')},
    {
      flag: 'contentEditable',
      title: $t('msgs.content_editable'),
      desc: $t('msgs.enable_html_contente'),
    },
    {
      flag: 'enableSelection',
      title: $t('msgs.enable_hover'),
      desc: $t('msgs.add_cursor_hover_loc'),
    },
    {flag: 'enableRightClick', title: $t('msgs.enable_right_click'), desc: ''},
    {flag: 'centeredElementsY', title: $t('msgs.centered') + ' Y', desc: ''},
    {flag: 'centeredElementsX', title: $t('msgs.centered') + ' X', desc: ''},
    {flag: 'fullWidth', title: $t('msgs.full_width'), desc: ''},
    {flag: 'bgDark', title: $t('msgs.dark_bg'), desc: ''},
  ]

  const backgroundStyle = computed(() => {
    if (indicatorOptions.bgDark) {
      return {
        backgroundColor: `rgba(30, 30, 30,${indicatorOptions.bgTransparentPercent / 100})`,
      }
    }
    return {
      backgroundColor: `rgba(255,255,255,${indicatorOptions.bgTransparentPercent / 100})`,
    }
  })

  return {
    indicatorOptions,
    mainCanvasClass,
    toggleList,
    backgroundStyle,
  }
}
