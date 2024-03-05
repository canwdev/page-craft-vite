export type QuickOptionItem = {
  label: string
  children: QuickOptionItem[] | null
  props?: {
    onClick?: any
  }
}
