export type QuickOptionItem = {
  label: string
  // 搜索过滤用
  search?: string
  html?: string
  children?: QuickOptionItem[]
  props?: {
    onClick?: any
  }
}
