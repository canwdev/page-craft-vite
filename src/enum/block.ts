import iconArrow from '../assets/textures/arrow.png?url'
import ironSword from '../assets/textures/iron_sword.png?url'
import ironPickaxe from '../assets/textures/iron_pickaxe.png?url'

export enum ActionType {
  CURSOR = 'CURSOR',
  SELECTION = 'SELECTION',
  DELETE = 'DELETE',
}
export enum BlockType {
  HTML_ELEMENT = 'HTML_ELEMENT',
  ACTIONS = 'ACTIONS',
  COMPONENT = 'COMPONENT',
}

export interface HtmlBlockItem {
  tag: string
  // className?: string
  // innerText?: string
}

export class HtmlBlockItem {
  constructor(prop: any = {}) {
    if (!prop.tag) {
      throw new Error('tag is required')
    }
    this.tag = prop.tag
    // this.className = prop.className || ''
    // this.innerText = prop.innerText || ''
  }
}

export interface ComponentBlockItem {
  html: string
  style: string
  styleLang: string
  timestamp: number
}

export class ComponentBlockItem {
  constructor(prop: any = {}) {
    this.html = prop.html || ''
    this.style = prop.style || ''
    this.styleLang = prop.styleLang || 'scss'
    this.timestamp = prop.timestamp || Date.now()
  }
}

export interface BlockItem {
  id: string
  blockType: BlockType
  title?: string
  icon?: string
  data: HtmlBlockItem
  actionType?: ActionType
  hidden: boolean
}

export class BlockItem {
  constructor(prop: any = {}) {
    if (!prop.blockType) {
      throw new Error('blockType is required')
    }
    this.id = prop.blockType === BlockType.HTML_ELEMENT ? prop.data.tag : prop.actionType
    this.blockType = prop.blockType
    this.actionType = prop.actionType
    this.title = prop.title || prop?.data?.tag
    this.icon = prop.icon || ''
    this.data = prop.data || {}
    this.hidden = prop.hidden || false
  }
}

const presetHtmlTags = 'div,span,br,button,input,img,a,p,h1,h2,h3,h4,h5,ul,ol,li'.split(',')

export const ActionBlockItems = {
  SELECTION: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: 'Selection',
    icon: iconArrow,
    actionType: ActionType.SELECTION,
    hidden: true,
  }),
  CURSOR: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: 'Cursor',
    icon: ironSword,
    actionType: ActionType.CURSOR,
  }),
  DELETE: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: 'Delete',
    icon: ironPickaxe,
    actionType: ActionType.DELETE,
  }),
}

export const getHtmlBlockItem = (tag) =>
  new BlockItem({
    blockType: BlockType.HTML_ELEMENT,
    data: new HtmlBlockItem({tag}),
  })

export const actionBlockItemList = Object.values(ActionBlockItems).filter((item) => !item.hidden)

export const blockList: BlockItem[] = [
  ...actionBlockItemList,
  ...presetHtmlTags.map((tag) => getHtmlBlockItem(tag)),
]
