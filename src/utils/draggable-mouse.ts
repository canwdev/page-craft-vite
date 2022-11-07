import {throttle} from 'throttle-debounce'

type DraggableOptions = {
  dragHandleEl: HTMLElement // 被鼠标按下的 handle 元素
  dragTargetEl: HTMLElement // 窗体元素
  allowOut?: boolean // 是否允许将窗体移动到视口之外
  opacify?: number // 移动时是否让窗体透明，如：0.8
  onMove?: Function // 移动中回调函数
  preventNode?: HTMLElement // 包含在这个元素下面的子元素将不会触发移动
  autoPosOnResize?: boolean // 调整窗口大小时始终让内容显示在视口内
}

export function setDraggableMouse(options: DraggableOptions) {
  const {
    dragHandleEl,
    dragTargetEl,
    allowOut = false,
    opacify,
    onMove,
    preventNode,
    autoPosOnResize = false,
  } = options
  const docEl = document.documentElement
  let deltaX = 0
  let deltaY = 0

  function isHidden(el = dragHandleEl) {
    return el.offsetParent === null
  }
  function setFixedPosition({x, y}) {
    const docWidth = docEl.clientWidth - dragTargetEl.clientWidth
    const docHeight = docEl.clientHeight - dragTargetEl.clientHeight
    const left = (dragTargetEl.style.left = Math.round(Math.min(docWidth, Math.max(0, x))) + 'px')
    const top = (dragTargetEl.style.top = Math.round(Math.min(docHeight, Math.max(0, y))) + 'px')

    return {left, top}
  }

  function handleStart(event: MouseEvent) {
    if (preventNode) {
      // console.log(preventNode, event.target)
      if (preventNode.contains(event.target as Node)) {
        return false
      }
    }

    deltaX = event.clientX - dragTargetEl.getBoundingClientRect().left
    deltaY = event.clientY - dragTargetEl.getBoundingClientRect().top

    docEl.addEventListener('mousemove', handleMove)
    docEl.addEventListener('mouseup', handleStop)

    // 防止拖动图片
    return false
  }

  function handleMove(event: MouseEvent) {
    const x = event.clientX - deltaX
    const y = event.clientY - deltaY

    let left, top
    if (!allowOut) {
      const pos = setFixedPosition({x, y})
      left = pos.left
      top = pos.top
    } else {
      left = dragTargetEl.style.left = Math.round(x) + 'px'
      top = dragTargetEl.style.top = Math.round(y) + 'px'
    }

    if (typeof onMove === 'function') {
      onMove({top, left})
    }

    if (opacify) {
      dragTargetEl.style.opacity = String(opacify)
    }

    // return false;
  }

  function handleStop(event: MouseEvent) {
    docEl.removeEventListener('mousemove', handleMove)
    docEl.removeEventListener('mouseup', handleStop)

    if (opacify) {
      dragTargetEl.style.opacity = '1'
    }
  }

  dragHandleEl.addEventListener('mousedown', handleStart)

  const handleResizeDebounced = throttle(500, false, () => {
    if (isHidden()) {
      return
    }
    const {left, top} = setFixedPosition({x: dragTargetEl.offsetLeft, y: dragTargetEl.offsetTop})

    if (typeof onMove === 'function') {
      onMove({top, left})
    }
  })

  if (autoPosOnResize) {
    window.addEventListener('resize', handleResizeDebounced)
    handleResizeDebounced()
  }

  return () => {
    dragHandleEl.removeEventListener('mousedown', handleStart)
    if (autoPosOnResize) {
      window.addEventListener('resize', handleResizeDebounced)
    }
  }
}
