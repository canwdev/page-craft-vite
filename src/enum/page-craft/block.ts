import iconArrow from '../../assets/textures/arrow.png?url'
import iconIronPickaxe from '../../assets/textures/iron_pickaxe.png?url'
import iconIronSword from '../../assets/textures/iron_sword.png?url'
import iconOakSign from '../../assets/textures/oak_sign.png?url'
import iconFishingRod from '../../assets/textures/fishing_rod.png?url'
import iconRedStone from '../../assets/textures/redstone.png?url'

export enum ActionType {
  CURSOR = 'CURSOR',
  SELECTION = 'SELECTION',
  DELETE = 'DELETE',
  DEBUG = 'DEBUG',
  PASTE_REPLACE = 'PASTE_REPLACE',
  DRAG = 'DRAG',
}
export enum BlockType {
  HTML_ELEMENT = 'HTML_ELEMENT',
  ACTIONS = 'ACTIONS',
  COMPONENT = 'COMPONENT',
}

export interface HtmlBlockData {
  tag: string
  // className?: string
  // innerText?: string
}

export class HtmlBlockData {
  constructor(prop: any = {}) {
    if (!prop.tag) {
      throw new Error('tag is required')
    }
    this.tag = prop.tag
    // this.className = prop.className || ''
    // this.innerText = prop.innerText || ''
  }
}

export interface ComponentData {
  timestamp: number
  stared: boolean // 是否为星标组件
  name?: string // 导出专用参数，其他情况内请勿使用
  html?: string // 导出专用参数，其他情况内请勿使用
  style?: string // 导出专用参数，其他情况内请勿使用
  cover?: string // base64编码的封面
}

export class ComponentData {
  constructor(prop: any = {}) {
    this.timestamp = prop.timestamp || Date.now()
    this.stared = prop.stared || false
    this.name = prop.name
    this.html = prop.html
    this.style = prop.style
    this.cover = prop.cover
  }
}

export interface BlockItem {
  id: string
  blockType: BlockType
  title: string
  icon?: string
  data: HtmlBlockData | ComponentData | any
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
  PASTE_REPLACE: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: 'Paste & Replace innerHTML 🎈',
    icon: iconOakSign,
    actionType: ActionType.PASTE_REPLACE,
  }),
  DRAG: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: 'Drag',
    icon: iconFishingRod,
    actionType: ActionType.DRAG,
  }),
  EMPTY: new BlockItem({
    blockType: BlockType.ACTIONS,
    title: '',
    actionType: ActionType.CURSOR,
  }),
}

export const createHtmlBlockItem = (tag: string) =>
  new BlockItem({
    blockType: BlockType.HTML_ELEMENT,
    data: new HtmlBlockData({tag}),
  })

export const actionBlockItemList = Object.values(ActionBlockItems).filter((item) => !item.hidden)

const presetHtmlTags = 'div,span,br,button,input,img,a,p,h1,h2,h3,ul,ol,li'.split(',')
export const initToolbarList: BlockItem[] = [
  ActionBlockItems.DELETE,
  ActionBlockItems.PASTE_REPLACE,
  ActionBlockItems.DRAG,
  ActionBlockItems.EMPTY,
  ...presetHtmlTags.map((tag) => createHtmlBlockItem(tag)),
  ActionBlockItems.EMPTY,
]

export const createComponentBlockItem = (name: string, data = {}) =>
  new BlockItem({
    blockType: BlockType.COMPONENT,
    title: name,
    data: new ComponentData(data),
  })
