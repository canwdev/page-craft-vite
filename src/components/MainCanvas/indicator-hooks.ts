import {LsKeys} from '@/enum'
import {ActionType, BlockType} from '@/enum/block'
import {useCraftStore} from '@/store/craft'

export type IndicatorOptions = {
  enableDevHelpClass: boolean
  enableExpand: boolean
  enableSelection: boolean
  fullWidth: boolean
  bgTransparent: boolean
  bgDark: boolean
  centeredElementsY: boolean
  centeredElementsX: boolean
  showStyleEditor: boolean
  contentEditable: boolean
  enableRightClick: boolean
}

export const useIndicator = () => {
  const craftStore = useCraftStore()

  const indicatorOptions = reactive<IndicatorOptions>(
    JSON.parse(localStorage.getItem(LsKeys.INDICATOR_OPTIONS) || 'null') || {
      enableDevHelpClass: true,
      enableExpand: true,
      enableSelection: false,
      fullWidth: false,
      bgTransparent: true,
      bgDark: false,
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
      'page-craft-mc--expand': indicatorOptions.enableExpand,
      'page-craft-mc--full-width': indicatorOptions.fullWidth,
      'page-craft-mc--transparent': indicatorOptions.bgTransparent,
      'page-craft-mc--centered-y': indicatorOptions.centeredElementsY,
      'page-craft-mc--centered-x': indicatorOptions.centeredElementsX,
      _dark: indicatorOptions.bgDark,
    }
  })

  const toggleList = [
    {
      flag: 'enableDevHelpClass',
      title: 'Outline',
      desc: 'Add 1px outline per element for better distinction',
    },
    {flag: 'enableExpand', title: 'Padding', desc: 'Pad each element with 10px for selection'},
    {
      flag: 'contentEditable',
      title: 'Content Editable',
      desc: 'Enable HTML contenteditable feature!',
    },
    {
      flag: 'enableSelection',
      title: 'Enable Hover',
      desc: 'Add cursor hover locate effect',
    },
    {flag: 'enableRightClick', title: 'Enable Right Click', desc: ''},
    {flag: 'centeredElementsY', title: 'Centered Y', desc: ''},
    {flag: 'centeredElementsX', title: 'Centered X', desc: ''},
    {flag: 'bgTransparent', title: 'Transparent BG', desc: ''},
    {flag: 'bgDark', title: 'Dark BG', desc: ''},
    {flag: 'fullWidth', title: 'Full Width', desc: ''},
  ]

  return {
    indicatorOptions,
    mainCanvasClass,
    toggleList,
  }
}
