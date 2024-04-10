import {pinyin} from 'pinyin-pro'

export interface ITranslateItem {
  key: string
  value: string
}
export const formatTranslateItem = (data: any = {}): ITranslateItem => {
  let value
  if (typeof data.value === 'number') {
    value = data.value
  } else {
    value = data.value || ''
  }
  return {
    key: data.key || '',
    value,
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

function containsChinese(text: string) {
  const pattern = /[\u4e00-\u9fa5]/
  return pattern.test(text)
}

export const formatI18nKey = (
  val: number | string,
  replace: string = '_',
  limitLength: number = 20
): string => {
  if (typeof val === 'number') {
    return `n${replace}${val}`
  }
  if (!val) {
    return ''
  }
  let str = String(val)
  // 中文转换拼音
  if (containsChinese(str)) {
    try {
      str = pinyin(str, {toneType: 'none', nonZh: 'consecutive'})
    } catch (e) {
      console.warn(e)
    }
  }
  // 移除非字母和数字字符
  str = str.replace(/[^a-zA-Z0-9_\s]+/g, '')
  // 大驼峰转换 AbCd -> _ab_cd
  str = str.replace(/([A-Z])/g, `${replace}$1`)
  // 转换成小写
  str = str.toLowerCase()
  // 替换空白为 "_"
  str = str.replace(/\s/gi, replace)
  // 移除重复的 "_"
  str = str.replace(new RegExp(`${replace}{1,}`, 'gi'), replace)
  str = str.slice(0, limitLength)
  // 移除首尾的 "_"
  str = str.replace(new RegExp(`${replace}$|^${replace}`, 'g'), '')
  return str
}

export type DirTreeItem = {
  key: string
  kind: 'directory' | 'file'
  label: string
  entry: FileSystemDirectoryHandle | FileSystemFileHandle
  parentDirs: string[]
  children: DirTreeItem[] | null
  prefix?: any
}

// 一键复制模式枚举
export enum CopyMode {
  ORIGINAL = 'original',
  TEMPLATE = 'template',
  VHTML = 'vhtml',
  DOLLART = 'dollart',
}

export const copyModeOptions = [
  {label: '$()', value: CopyMode.ORIGINAL, desc: "Copy $('')"},
  {label: '{{}}', value: CopyMode.TEMPLATE, desc: 'Copy HTML template'},
  {label: 'v-html', value: CopyMode.VHTML, desc: 'Copy v-html template'},
  {label: 'this.$t', value: CopyMode.DOLLART, desc: 'Copy JavaScript this.$t()'},
]
