import iconArrow from '../assets/textures/arrow.png?url'
import ironSword from '../assets/textures/iron_sword.png?url'

export interface BlockItem {
  tag: string | null
  icon?: string
  innerText?: string
  className?: string
}

export const blockDiv: BlockItem = {tag: 'div'}

export const blockList: BlockItem[] = [
  {tag: null, icon: ironSword},
  blockDiv,
  {tag: 'span'},
  {tag: 'br'},
  {tag: 'button'},
  {tag: 'input'},
  {tag: 'a'},
  {tag: 'p'},
  {tag: 'h1'},
  {tag: 'h2'},
  {tag: 'h3'},
  {tag: 'h4'},
  {tag: 'h5'},
  {tag: 'h6'},
]
