export interface BlockItem {
  tag: string
  innerText?: string
  className?: string
}

export const blockDiv: BlockItem = {tag: 'div'}

export const blockList: BlockItem[] = [
  blockDiv,
  {tag: 'span'},
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
