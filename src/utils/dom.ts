import {ActionType, BlockItem, BlockType} from '@/enum/block'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'

export const createOrFindStyleNode = (id, cssText?) => {
  const find = document.querySelector(id)
  if (find) {
    return find
  }
  const styleNode = document.createElement('style')
  styleNode.id = id

  if (cssText) {
    styleNode.innerHTML = cssText
  }

  document.head.appendChild(styleNode)
  return styleNode
}

const srcTags = [
  'img',
  'iframe',
  'video',
  'audio',
  'source',
  'track',
  'embed',
  'object',
  'picture',
  'script',
  'link',
]

export const appendCustomBlock = (block: BlockItem, targetEl, craftStore, mainCanvasRef) => {
  if (block.blockType === BlockType.ACTIONS) {
    if (block.actionType === ActionType.DELETE) {
      if (targetEl === mainCanvasRef.value) {
        return
      }
      targetEl.parentNode.removeChild(targetEl)
    } else if (block.actionType === ActionType.SELECTION) {
      globalEventBus.emit(GlobalEvents.ON_NODE_SELECT, targetEl)
      return
    }
  } else if (block.blockType === BlockType.HTML_ELEMENT) {
    const tag = block.data.tag
    const addEl: any = document.createElement(tag)
    if (srcTags.includes(tag)) {
      if (['audio', 'video'].includes(tag)) {
        addEl.controls = true
      }
      addEl.src = craftStore.innerText || ''
    } else if (tag === 'input') {
      addEl.value = craftStore.innerText || ''
    } else if (['br', 'hr'].includes(tag)) {
      addEl.innerHTML = craftStore.innerText || ''
    }
    if (craftStore.className) {
      addEl.className = craftStore.className
    }
    targetEl.appendChild(addEl)
    // console.log('[addEl]', addEl)
  }
}
