import iconArrow from '../assets/textures/arrow.png?url'
import iconIronPickaxe from '../assets/textures/iron_pickaxe.png?url'
import iconIronSword from '../assets/textures/iron_sword.png?url'
import iconOakSign from '../assets/textures/oak_sign.png?url'
import iconRedStone from '../assets/textures/redstone.png?url'

export enum ActionType {
  CURSOR = 'CURSOR',
  SELECTION = 'SELECTION',
  DELETE = 'DELETE',
  ADD_COMPONENT = 'ADD_COMPONENT',
  DEBUG = 'DEBUG',
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

export interface ExportItem {
  name: string
  html: string
  style: string
  styleLang: string
  timestamp: number
}

export class ExportItem {
  constructor(prop: any = {}) {
    this.name = prop.name || ''
    this.html = prop.html || ''
    this.style = prop.style || ''
    this.styleLang = prop.styleLang || 'scss'
    this.timestamp = prop.timestamp || Date.now()
  }
}

export interface BlockItem {
  id: string
  blockType: BlockType
  title: string
  icon?: string
  data: HtmlBlockItem | ExportItem | any
  actionType?: ActionType
  hidden: boolean
}

export class BlockItem {
  constructor(prop: any = {}) {
    if (!prop.blockType) {
      throw new Error('blockType is required')
    }
    if (prop.blockType === BlockType.HTML_ELEMENT) {
      this.id = prop.data.tag
    } else if (prop.blockType === BlockType.ACTIONS) {
      this.id = prop.actionType
    } else if (prop.blockType === BlockType.COMPONENT) {
      this.id = prop.title
    }
    this.blockType = prop.blockType
    this.actionType = prop.actionType
    this.title = prop.title || prop?.data?.tag || ''
    this.icon = prop.icon || ''
    this.data = prop.data || {}
    this.hidden = prop.hidden || false
  }
}

export const ActionBlockItems = {
  SELECTION: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: 'Selection',
    icon: iconArrow,
    actionType: ActionType.SELECTION,
    hidden: true,
  }),
  DEBUG: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: 'Debug',
    icon: iconIronSword,
    actionType: ActionType.DEBUG,
  }),
  DELETE: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: 'Delete',
    icon: iconIronPickaxe,
    actionType: ActionType.DELETE,
  }),
  EMPTY: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: '',
    actionType: ActionType.CURSOR,
  }),
  ADD_COMPONENT: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: 'AddComponent',
    icon: iconOakSign,
    actionType: ActionType.ADD_COMPONENT,
    hidden: true,
  }),
}

export const createHtmlBlockItem = (tag: string) =>
  new BlockItem({
    blockType: BlockType.HTML_ELEMENT,
    data: new HtmlBlockItem({tag}),
  })

export const actionBlockItemList = Object.values(ActionBlockItems).filter((item) => !item.hidden)

const presetHtmlTags = 'div,span,br,button,input,img,a,p,h1,h2,h3,ul,ol,li'.split(',')
export const initToolbarList: BlockItem[] = [
  ActionBlockItems.DEBUG,
  ActionBlockItems.DELETE,
  ActionBlockItems.EMPTY,
  ...presetHtmlTags.map((tag) => createHtmlBlockItem(tag)),
  ActionBlockItems.EMPTY,
  ActionBlockItems.EMPTY,
]

export const createComponentBlockItem = (name: string, data = {}) =>
  new BlockItem({
    blockType: BlockType.COMPONENT,
    title: name,
    data: new ExportItem(data),
  })
