type DraggableOptions = {
  dragHandleEl: HTMLElement
  dragTargetEl: HTMLElement
  allowOut?: boolean
  opacify?: boolean
}

export function setDraggableMouse(options: DraggableOptions) {
  const {dragHandleEl, dragTargetEl, allowOut = false, opacify = false} = options
  const docEl = document.documentElement
  let deltaX = 0
  let deltaY = 0

  function onStart(event: MouseEvent) {
    deltaX = event.clientX - dragTargetEl.getBoundingClientRect().left
    deltaY = event.clientY - dragTargetEl.getBoundingClientRect().top

    docEl.addEventListener('mousemove', onMove)
    docEl.addEventListener('mouseup', onStop)

    // 防止拖动图片
    return false
  }

  function onMove(event: MouseEvent) {
    const x = event.clientX - deltaX
    const y = event.clientY - deltaY

    let docWidth = docEl.clientWidth
    let docHeight = docEl.clientHeight
    if (!allowOut) {
      docWidth = docEl.clientWidth - dragTargetEl.clientWidth
      docHeight = docEl.clientHeight - dragTargetEl.clientHeight
    }

    dragTargetEl.style.left = Math.min(docWidth, Math.max(0, x)) + 'px'
    dragTargetEl.style.top = Math.min(docHeight, Math.max(0, y)) + 'px'

    if (opacify) {
      dragTargetEl.style.opacity = '0.8'
    }

    // return false;
  }

  function onStop(event: MouseEvent) {
    docEl.removeEventListener('mousemove', onMove)
    docEl.removeEventListener('mouseup', onStop)

    if (opacify) {
      dragTargetEl.style.opacity = '1'
    }
  }

  dragHandleEl.addEventListener('mousedown', onStart)

  return () => {
    dragHandleEl.removeEventListener('mousedown', onStart)
  }
}
