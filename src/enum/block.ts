import iconArrow from '../assets/textures/arrow.png?url'
import ironSword from '../assets/textures/iron_sword.png?url'
import ironPickaxe from '../assets/textures/iron_pickaxe.png?url'


export const BlockManualType = {
  CURSOR: 'CURSOR',
  DELETE: 'DELETE',
}

export interface BlockItem {
  tag: string | null
  manualType?: string
  icon?: string
  innerText?: string
  className?: string
}

export const blockDiv: BlockItem = {tag: 'div'}

export const blockList: BlockItem[] = [
  {tag: null, manualType: BlockManualType.CURSOR, icon: ironSword},
  {tag: null, manualType: BlockManualType.DELETE, icon: ironPickaxe},
  blockDiv,
  {tag: 'span'},
  {tag: 'br'},
  {tag: 'button'},
  {tag: 'input'},
  {tag: 'img'},
  {tag: 'a'},
  {tag: 'p'},
  {tag: 'h1'},
  {tag: 'h2'},
  {tag: 'h3'},
  {tag: 'h4'},
  {tag: 'h5'},
  {tag: 'h6'},
]
