import {useAnimate, useEventListener, useWindowFocus} from '@vueuse/core'
import {useSettingsStore} from '@/store/settings'
import {isDev} from '@/enum'

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
  const settingsStore = useSettingsStore()
  // 视口聚焦后自动操作
  const lastClickedEl = shallowRef<any>(null)
  const isFocus = useWindowFocus()
  watch(isFocus, (val) => {
    if (settingsStore.enableFocusAutoAction && val) {
      const el = lastClickedEl.value
      if (el && isElementInViewport(el)) {
        // console.log('[视口聚焦后自动操作]', {el})
        el.click()
        useAnimate(
          el,
          [{transform: 'scale(1)'}, {transform: 'scale(0.8)'}, {transform: 'scale(1)'}],
          500
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
      window.$message.info(`视口聚焦后自动操作: ${val ? 'ON' : 'OFF'}`)
    }
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
      const el = evt.target?.closest('.focus-auto-action')
      if (el && el !== lastClickedEl.value) {
        // console.log('record', {el})
        lastClickedEl.value = el
      }
    }
  })
}
