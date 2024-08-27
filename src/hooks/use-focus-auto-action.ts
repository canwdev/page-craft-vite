import {useAnimate, useEventListener, useWindowFocus} from '@vueuse/core'
import {useSettingsStore} from '@/store/settings'
import {isDev} from '@/enum'
import {useI18n} from 'vue-i18n'

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect()
  if (rect.height === 0 || rect.width === 0) {
    return false
  }
  const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
  console.log(rect)
  return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
}

export const useFocusAutoAction = () => {
  const {t: $t} = useI18n()
  const settingsStore = useSettingsStore()
  // 视口聚焦后自动操作
  const lastClickedEl = shallowRef<any>(null)
  const isFocus = useWindowFocus()
  watch(isFocus, (val) => {
    if (settingsStore.enableFocusAutoAction && val) {
      const el = lastClickedEl.value
      if (el && isElementInViewport(el)) {
        // window.$message.success({
        //   message: `[Auto] Clicked`,
        //   duration: 500,
        // })
        // console.log('[视口聚焦后自动操作]', {el})
        el.click()
        el.scrollIntoView({behavior: 'smooth', block: 'center'})
        useAnimate(
          el,
          [{transform: 'scale(1)'}, {transform: 'scale(0.8)'}, {transform: 'scale(1)'}],
          500,
        )
      }
    }
  })
  watch(
    () => settingsStore.enableFocusAutoAction,
    (val) => {
      if (!val) {
        lastClickedEl.value = null
      }
      window.$message.success(`${$t('msgs.focus_auto_action')}: ${val ? 'ON ⚡' : 'OFF ✖️'}`)
      if (val && !lastClickedEl.value) {
        window.$message.info({
          message: $t('msgs.focus_auto_action_tip'),
          duration: 5000,
          showClose: true,
        })
      }
    },
  )
  useEventListener(document, 'keydown', (event) => {
    const key = event.key.toLowerCase()
    if (event.ctrlKey && key === 'a' && event.ctrlKey && event.altKey) {
      settingsStore.enableFocusAutoAction = !settingsStore.enableFocusAutoAction
    }
  })

  useEventListener(document, 'click', (evt) => {
    if (settingsStore.enableFocusAutoAction) {
      // 必须匹配此类才会记录，否则可能造成误操作
      const el = evt.target?.closest('.js_focus_auto_action')
      if (el && el !== lastClickedEl.value) {
        // console.log('record', {el})
        lastClickedEl.value = el
      }
    }
  })
}
