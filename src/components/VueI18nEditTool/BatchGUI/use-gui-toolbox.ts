import {useI18nMainStore} from '@/store/i18n-tool-main'

const tiSelector = '.translate-item'
export const useGuiToolbox = () => {
  const i18nMainStore = useI18nMainStore()

  const removeSelectedClass = () => {
    const els = Array.from(document.querySelectorAll(tiSelector))
    els.forEach((el) => {
      el.classList.remove('t_selected')
    })
  }

  // 处理字段key点击的高亮效果
  const handleKeyClick = (str, event) => {
    // console.log(str, event)
    i18nMainStore.translatePath = str
    removeSelectedClass()
    event.target.closest(tiSelector).classList.add('t_selected')
  }

  return {
    removeSelectedClass,
    handleKeyClick,
  }
}
