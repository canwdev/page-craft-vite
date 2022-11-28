export interface ITranslateItem {
  key: string
  value: string
}
export const formatTranslateItem = (data: any = {}): ITranslateItem => {
  return {
    key: data.key || '',
    value: data.value || '',
  }
}

export interface ITranslateTreeItem {
  namespace: ''
  children: ITranslateTreeItem[]
  translates: ITranslateItem[]
  parent?: ITranslateTreeItem | null
}

export const formatTranslateTreeItem = (data: any = {}): ITranslateTreeItem => {
  return {
    namespace: data.namespace || '',
    children: data.children || [],
    translates: data.translates || [],
    parent: data.parent || null,
  }
}

export const parseI18nJsonObj = (
  obj: any = {},
  tree: ITranslateTreeItem[] = [],
  parent: ITranslateTreeItem | null = null
): ITranslateTreeItem[] => {
  if (!obj) {
    return []
  }
  if (!Array.isArray(obj) && typeof obj === 'object') {
    for (let key in obj) {
      const o = obj[key]
      let children: ITranslateTreeItem[] = []
      const translates: ITranslateItem[] = []
      if (o && !Array.isArray(o) && typeof o === 'object') {
        // console.log(`[${key}] is object`, o)

        const nItem = formatTranslateTreeItem({
          namespace: key,
          translates,
          parent: parent,
        })
        nItem.children = parseI18nJsonObj(o, [], nItem)
        // console.warn(nItem)
        tree.push(nItem)
      } else {
        // console.log(`[${key}] is str`, o)
        if (parent && parent.translates) {
          parent.translates.push(formatTranslateItem({key, value: o}))
        }
      }
    }
  }
  console.log(tree)
  return tree
}

export const exportI18nTreeJsonObj = (tree: ITranslateTreeItem[], obj: any = {}) => {
  tree.forEach((item) => {
    const o = {}

    item.translates.forEach((t) => {
      o[t.key] = t.value
    })

    exportI18nTreeJsonObj(item.children, o)

    obj[item.namespace] = o
  })

  // console.log(obj)

  return obj
}
