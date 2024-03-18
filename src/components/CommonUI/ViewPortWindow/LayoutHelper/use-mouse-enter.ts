import {useEventListener} from '@vueuse/core'

export const useMouseEnter = (target, options: any = {}) => {
  const {timeout = 0, onEnter, onOut} = options
  let timer
  useEventListener(target, 'mouseenter', () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      onEnter && onEnter()
    }, timeout)
  })
  useEventListener(target, 'mouseout', () => {
    clearTimeout(timer)
    onOut && onOut()
  })
  useEventListener(target, 'click', () => {
    clearTimeout(timer)
  })
}
