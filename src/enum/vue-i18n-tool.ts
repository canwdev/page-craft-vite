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
  namespace: string
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
  // console.log(tree)
  return tree
}

export const I18N_JSON_OBJ_ROOT_KEY_NAME = '__root__'
export const I18nJsonObjUtils = {
  // add a root node for editing
  parseWithRoot: (obj = {}) => {
    return parseI18nJsonObj({
      [I18N_JSON_OBJ_ROOT_KEY_NAME]: obj,
    })
  },
  isRoot(obj: ITranslateTreeItem) {
    if (!obj) {
      return false
    }
    return obj.namespace === I18N_JSON_OBJ_ROOT_KEY_NAME
  },
}

export const exportI18nTreeJsonObj = (tree: ITranslateTreeItem[], obj: any = {}) => {
  if (typeof tree === 'object' && !Array.isArray(tree)) {
    tree = [tree]
  }
  // unwrap root item
  if (I18nJsonObjUtils.isRoot(tree[0])) {
    const root = tree[0]
    root.translates.forEach((t) => {
      obj[t.key] = t.value
    })
    tree = root.children
  }
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

export const formatI18nKey = (str: string): string => {
  if (!str) {
    return ''
  }
  str = str.toLowerCase()
  str = str.replace(/[^a-zA-Z0-9\s]+/g, '')
  str = str.replace(/\s/gi, '_')
  str = str.slice(0, 20)
  str = str.replace(/_$|^_/g, '')
  return str
}

export type DirTreeItem = {
  key: string
  kind: 'directory' | 'file'
  label: string
  entry: FileSystemDirectoryHandle | FileSystemFileHandle
  parentDirs: string[]
  children: DirTreeItem[] | null
}
