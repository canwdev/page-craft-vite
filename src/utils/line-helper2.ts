/**
 * 参考：
 * https://github.com/sahadev/vue-component-creater-ui/blob/vue3/src/utils/lineHelper.js
 */
import {TOOL_CLASSES} from '@/enum/page-craft'

const TOP = 1,
  MIDDLE = 2,
  BOTTOM = 3

/**
 * 判断上还是下
 * @param {*} e
 * @param {*} x
 * @param {*} y
 * @returns
 */
function judgeTopOrBottom(e, x, y) {
  const position = e.getBoundingClientRect()

  const cutDistance = Math.round((position.bottom - position.top) / 3)

  return {
    top: y < position.top + cutDistance,
    middle: y >= position.top + cutDistance && y <= position.top + cutDistance * 2,
    bottom: y > position.top + cutDistance * 2,
  }
}

export class LineHelper2 {
  private currentPosition: null | number
  private currentTarget: HTMLElement | null
  private preSelectTarget: HTMLElement | null
  private targetElement: HTMLElement
  private crossX: HTMLElement

  constructor(targetElement) {
    this.currentPosition = null
    this.currentTarget = null
    this.preSelectTarget = null
    this.targetElement = targetElement
    const crossX = document.querySelector('.line-helper-x')
    if (!crossX) {
      throw new Error('crossX is not exist!')
    }
    this.crossX = crossX as HTMLElement
  }

  hideLine() {
    this.crossX.style.display = 'none'
  }

  clearTargetOutline() {
    if (this.preSelectTarget) {
      this.preSelectTarget.classList.remove(TOOL_CLASSES.CLASS_MOUSE_OVER)
    }
  }

  drawLine(event: MouseEvent) {
    const realTarget = event.target

    if (!realTarget) {
      return
    }

    const targetElement = this.targetElement
    const crossX = this.crossX

    // 2021年03月26日15:56:35 新的逻辑是：只有上下定位辅助线，不再计算左右辅助线
    const directionObj = judgeTopOrBottom(realTarget, event.clientX, event.clientY)
    const position = (realTarget as HTMLElement).getBoundingClientRect()

    // 如果鼠标点在目标的上部分则绘制上部分辅助线
    if (directionObj.top && targetElement !== realTarget) {
      if (this.currentPosition === TOP && this.currentTarget === realTarget) {
        return
      }
      this.currentPosition = TOP
      this.currentTarget = realTarget as HTMLElement

      this.clearTargetOutline()

      crossX.style.top = position.top + 'px'
      crossX.style.width = position.width + 'px'
      crossX.style.left = position.left + 'px'
      crossX.style.display = 'block'

      // currentPointer(realTarget.parentElement, findElementIndex(realTarget))
    } else if (directionObj.bottom && targetElement !== realTarget) {
      // 如果鼠标点在目标的下部分，则绘制下部分辅助线
      if (this.currentPosition === BOTTOM && this.currentTarget === realTarget) {
        return
      }
      this.currentPosition = BOTTOM
      this.currentTarget = realTarget as HTMLElement

      this.clearTargetOutline()

      crossX.style.top = position.bottom + 'px'
      crossX.style.width = position.width + 'px'
      crossX.style.left = position.left + 'px'
      crossX.style.display = 'block'

      // currentPointer(realTarget.parentElement, findElementIndex(realTarget) + 1)
    } else {
      this.currentPosition = MIDDLE
      this.currentTarget = realTarget as HTMLElement
      ;(realTarget as HTMLElement).classList.add(TOOL_CLASSES.CLASS_MOUSE_OVER)
      this.preSelectTarget = realTarget as HTMLElement

      this.hideLine()

      // currentPointer(realTarget, -1)
    }
  }
}
