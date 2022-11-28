import {ActionType, BlockItem, BlockType} from '@/enum/page-craft/block'
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

export const tagsHasSrcAttr = [
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

// block.blockType === BlockType.HTML_ELEMENT
export const createBlockElement = (block: BlockItem, craftStore?) => {
  const text = craftStore?.innerText || ''
  const tag = block.data.tag
  const addEl: any = document.createElement(tag)
  if (tagsHasSrcAttr.includes(tag)) {
    if (['audio', 'video'].includes(tag)) {
      addEl.controls = true
    }
    addEl.src = text
  } else if (tag === 'input') {
    addEl.value = text
  } else if (!['br', 'hr'].includes(tag)) {
    addEl.innerHTML = text
  }
  if (craftStore?.className) {
    addEl.className = craftStore.className
  }
  return addEl
}

export const appendCustomBlock = async (block: BlockItem, event, craftStore, mainCanvasRef) => {
  let targetEl
  if (event.target) {
    targetEl = event.target
  } else {
    targetEl = mainCanvasRef.value
  }

  if (block.blockType === BlockType.ACTIONS) {
    if (block.actionType === ActionType.PASTE_REPLACE) {
      targetEl.innerHTML = await navigator.clipboard.readText()
      return
    }
    if (block.actionType === ActionType.DEBUG) {
      console.log('[event]', event)
      console.log('[targetEl]', targetEl)

      return
    }
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
    const addEl = createBlockElement(block, craftStore)
    // console.log('[addEl]', addEl)
    targetEl.appendChild(addEl)
  }
}

export const autoSetAttr = (el, attr, value) => {
  if (value) {
    if (el.getAttribute(attr) !== value) {
      el.setAttribute(attr, value)
    }
  } else {
    el.removeAttribute(attr)
  }
}
