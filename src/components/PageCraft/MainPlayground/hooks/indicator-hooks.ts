import {LsKeys, TOOL_CLASSES} from '@/enum/page-craft'
import {ActionType, BlockType} from '@/enum/page-craft/block'
import {useMainStore} from '@/store/main'
import {useI18n} from 'vue-i18n'
import {useSfxBass, useSfxPop} from '@/hooks/use-sfx'
import {useBroadcastMessage} from '@/hooks/use-broadcast-messae'

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
  const mainStore = useMainStore()
  const {play: playSfxPop} = useSfxPop()

  // 用来防止多窗口通信导致的死循环
  const isSelfUpdating = ref(false)
  // 处理多个窗口(iframe)间的状态同步
  const {channelRef} = useBroadcastMessage('indicatorUpdate', (event) => {
    isSelfUpdating.value = true
    Object.assign(indicatorOptions, event.data)
    nextTick(() => {
      isSelfUpdating.value = false
    })
  })

  const indicatorOptions = reactive<IndicatorOptions>(
    JSON.parse(localStorage.getItem(LsKeys.INDICATOR_OPTIONS) || 'null') || {
      enableDevHelpClass: true,
      enableExpand: true,
      enableSelection: true,
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
      if (isSelfUpdating.value) {
        console.warn('isSelfUpdating')
        return
      }
      const obj = {...indicatorOptions}
      localStorage.setItem(LsKeys.INDICATOR_OPTIONS, JSON.stringify(obj))

      // 如果开启了多个窗口（iframe)，发送同步状态
      channelRef.value?.postMessage(obj)
    },
    {deep: true}
  )

  const disableALinkClick = (event) => {
    event.preventDefault()
    window.$message.warning('Prevent link click')
  }

  watch(
    () => mainStore.currentBlock,
    (val) => {
      console.log(val.actionType)
      // 禁止a链接点击跳转事件
      const sl = `.${TOOL_CLASSES.CLASS_MAIN_CANVAS_ROOT} a`
      if (val.actionType !== ActionType.CURSOR) {
        document.querySelectorAll(sl).forEach((link) => {
          link.addEventListener('click', disableALinkClick)
        })
      } else {
        setTimeout(() => {
          document.querySelectorAll(sl).forEach((link) => {
            link.removeEventListener('click', disableALinkClick)
          })
        }, 500)
      }
    }
  )

  const mainCanvasClass = computed(() => {
    const currentBlock = mainStore.currentBlock
    return {
      'page-craft-mc--dev': indicatorOptions.enableDevHelpClass,
      'page-craft-mc--cursor-insert': currentBlock.blockType !== BlockType.ACTIONS,
      'page-craft-mc--cursor-pickaxe': currentBlock.actionType === ActionType.DELETE,
      // 选择元素
      'page-craft-mc--cursor-arrow': false,
      'page-craft-mc--cursor-sword': currentBlock.actionType === ActionType.DEBUG,
      'page-craft-mc--cursor-drag': currentBlock.actionType === ActionType.DRAG,
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
      desc: $t('msgs.add_1px_outline_per') + ' (alt+z)',
    },
    {
      flag: 'enableExpand',
      title: $t('common.padding'),
      desc: $t('msgs.pad_each_element_wit') + ' (alt+x)',
    },
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
