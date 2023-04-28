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
export const createBlockElement = (block: BlockItem, addOptions?) => {
  const {innerText = '', className = ''} = addOptions || {}

  const text = innerText || ''

  const tag = block.data.tag
  const addEl: any = document.createElement(tag)
  if (tagsHasSrcAttr.includes(tag)) {
    if (['audio', 'video'].includes(tag)) {
      addEl.controls = true
    }
    addEl.src = text
  } else if (tag === 'input') {
    addEl.setAttribute('placeholder', text)
  } else if (!['br', 'hr'].includes(tag)) {
    addEl.innerHTML = text
  }
  if (className) {
    addEl.className = className
  }
  return addEl
}

export const appendCustomBlock = async (block: BlockItem, event, addOptions, mainCanvasRef) => {
  let targetEl = event.target || mainCanvasRef.value

  if (block.blockType === BlockType.ACTIONS) {
    if (block.actionType === ActionType.PASTE_REPLACE) {
      targetEl.innerHTML = await navigator.clipboard.readText()
      return
    }
    if (block.actionType === ActionType.DEBUG) {
      console.log('[event]', event)

      const target = event.target
      var sibling1 = target.previousSibling // 获取前一个兄弟元素
      while (sibling1 && sibling1.nodeType !== 1) {
        // 确保是元素节点
        sibling1 = sibling1.previousSibling
      }
      var sibling2 = target.nextSibling // 获取后一个兄弟元素
      while (sibling2 && sibling2.nodeType !== 1) {
        // 确保是元素节点
        sibling2 = sibling2.nextSibling
      }

      console.log({sibling1, sibling2}) // 上一个元素

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
    const addEl = createBlockElement(block, addOptions)
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
