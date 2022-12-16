import {throttle} from 'throttle-debounce'

type DraggableOptions = {
  dragHandleEl: HTMLElement // 被鼠标按下的 handle 元素
  dragTargetEl: HTMLElement // 窗体元素
  allowOut?: boolean // 是否允许将窗体移动到视口之外
  opacify?: number // 移动时是否让窗体透明，如：0.8
  onMove?: Function // 移动中回调函数
  preventNode?: HTMLElement // 包含在这个元素下面的子元素将不会触发移动
  autoPosOnResize?: boolean // 调整窗口大小时始终让内容显示在视口内
  isDebug?: boolean
}

export class DraggableWindow {
  private docEl: HTMLElement
  private deltaX: number
  private deltaY: number
  private options: DraggableOptions
  private handleResizeDebounced: any

  constructor(options: DraggableOptions) {
    const {dragHandleEl, dragTargetEl, onMove, autoPosOnResize} = options

    this.options = options

    this.docEl = document.documentElement
    this.deltaX = 0
    this.deltaY = 0

    this.handleStart = this.handleStart.bind(this)
    this.handleMove = this.handleMove.bind(this)
    this.handleStop = this.handleStop.bind(this)
    this.handleResizeDebounced = throttle(500, false, () => {
      if (this.isHidden()) {
        return
      }
      const {left, top} = this.setInScreenPosition({
        x: dragTargetEl.offsetLeft,
        y: dragTargetEl.offsetTop,
      })
      this.debugLog('handleResizeDebounced', {left, top})

      if (typeof onMove === 'function') {
        onMove({top, left})
      }
    })

    if (autoPosOnResize) {
      window.addEventListener('resize', this.handleResizeDebounced)
      this.handleResizeDebounced()
    }

    dragHandleEl.addEventListener('mousedown', this.handleStart)

    this.debugLog('initialized', this)
  }

  handleStart(event: MouseEvent) {
    const {docEl} = this

    const {preventNode, dragTargetEl} = this.options

    if (preventNode) {
      // console.log(preventNode, event.target)
      if (preventNode.contains(event.target as Node)) {
        return false
      }
    }

    this.deltaX = event.clientX - dragTargetEl.getBoundingClientRect().left
    this.deltaY = event.clientY - dragTargetEl.getBoundingClientRect().top

    docEl.addEventListener('mousemove', this.handleMove)
    docEl.addEventListener('mouseup', this.handleStop)

    // 防止拖动图片
    return false
  }

  handleMove(event: MouseEvent) {
    const {deltaX, deltaY} = this
    const {dragTargetEl, onMove, opacify} = this.options

    const x = event.clientX - deltaX
    const y = event.clientY - deltaY

    let left, top
    if (!this.options.allowOut) {
      const pos = this.setInScreenPosition({x, y})
      left = pos.left
      top = pos.top
    } else {
      const {scaleX, scaleY} = this.fixZoom()
      left = dragTargetEl.style.left = Math.round(x) * scaleX + 'px'
      top = dragTargetEl.style.top = Math.round(y) * scaleY + 'px'
    }

    if (typeof onMove === 'function') {
      onMove({top, left})
    }

    if (opacify) {
      dragTargetEl.style.opacity = String(opacify)
    }

    // return false;
  }

  handleStop(event: MouseEvent) {
    const {docEl} = this
    const {dragTargetEl, opacify} = this.options

    docEl.removeEventListener('mousemove', this.handleMove)
    docEl.removeEventListener('mouseup', this.handleStop)

    if (opacify) {
      dragTargetEl.style.opacity = '1'
    }
  }

  isHidden() {
    const {dragHandleEl} = this.options
    return dragHandleEl.offsetParent === null
  }

  fixZoom() {
    const {dragTargetEl} = this.options
    const rect = dragTargetEl.getBoundingClientRect()
    const scaleX = rect.width / dragTargetEl.offsetWidth
    const scaleY = rect.height / dragTargetEl.offsetHeight

    return {
      scaleX,
      scaleY,
    }
  }

  setInScreenPosition({x, y}) {
    const {docEl} = this
    const {dragTargetEl} = this.options
    const rect = dragTargetEl.getBoundingClientRect()
    const docWidth = docEl.clientWidth - rect.width
    const docHeight = docEl.clientHeight - rect.height

    const left = (dragTargetEl.style.left = Math.round(Math.min(docWidth, Math.max(0, x))) + 'px')
    const top = (dragTargetEl.style.top = Math.round(Math.min(docHeight, Math.max(0, y))) + 'px')

    return {left, top}
  }

  destroy() {
    const {dragHandleEl, autoPosOnResize} = this.options
    dragHandleEl.removeEventListener('mousedown', this.handleStart)
    if (autoPosOnResize) {
      window.addEventListener('resize', this.handleResizeDebounced)
    }
    this.debugLog('destroyed')
  }

  debugLog(message, ...args) {
    if (this.options.isDebug) {
      console.log(`[draggableWindow] ${message}`, ...args)
    }
  }
}
