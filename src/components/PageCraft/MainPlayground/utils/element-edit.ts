import {autoSetAttr, tagsHasSrcAttr} from '@/components/PageCraft/MainPlayground/utils/dom'
import {formatSelectOptions} from '@/utils'
import {
  AutoFormItem,
  AutoFormItemType,
  MixedFormItems,
} from '@/components/CommonUI/AutoFormNaive/enum'
import {
  genProp,
  mapCustomPropsKeys,
  tplFormItem,
} from '@/components/PageCraft/MainPlayground/utils/element-edit-tpl'

// 元素编辑中的表单数据
export interface ElementEditData {
  tagName: string
  innerHTML: string
  outerHTML: string
  customProps: any
}

export interface IElCustomProp {
  // 获取表单自定义属性，放置于 `customProps` 对象内
  getCustomProps: (el: HTMLElement) => any
  // 更新元素的函数
  updateElement: (el: HTMLElement, formData: ElementEditData) => any
  // 表单UI属性
  customFormItems: MixedFormItems[]
}

export interface IElCustomPropMap {
  [key: string]: IElCustomProp
}

export const elCustomPropsMap: IElCustomPropMap = {
  a: genProp([tplFormItem.href, [tplFormItem.target, tplFormItem.rel]]),
  input: genProp([
    tplFormItem.placeholder,
    [tplFormItem.inputType, tplFormItem.disabled, tplFormItem.readonly],
  ]),
  textarea: genProp([tplFormItem.placeholder, [tplFormItem.disabled, tplFormItem.readonly]]),
  button: genProp([[tplFormItem.disabled, tplFormItem.tabindex]]),
  video: genProp([tplFormItem.src, tplFormItem.poster]),
  img: genProp([tplFormItem.src, tplFormItem.alt]),
  iframe: genProp([tplFormItem.src, tplFormItem.frameborder]),
}

const defaultCustomProps = genProp()

tagsHasSrcAttr.forEach((tag) => {
  if (elCustomPropsMap[tag]) {
  } else {
    // 生成所有具有src属性的标签的自定义属性
    elCustomPropsMap[tag] = genProp([tplFormItem.src])
  }
})

export const formatForm = (el: HTMLElement | null): ElementEditData => {
  if (!el) {
    return {
      tagName: '',
      innerHTML: '',
      outerHTML: '',
      customProps: null,
    }
  }
  const customProps = elCustomPropsMap[el.tagName.toLowerCase()] || defaultCustomProps
  return {
    tagName: el.tagName || '',
    innerHTML: el.innerHTML || '',
    outerHTML: el.outerHTML || '',
    // get element specific custom props
    customProps: customProps.getCustomProps(el),
  }
}

/**
 * 获取元素对应的表单内容
 * @param el HTML DOM元素
 */
export const getCustomFormItems = (el: HTMLElement | null): MixedFormItems[] => {
  if (!el) {
    return []
  }
  const customProps = elCustomPropsMap[el?.tagName.toLowerCase()] || defaultCustomProps

  return (
    customProps.customFormItems
      // 必须添加key前缀
      .map(mapCustomPropsKeys)
  )
}

export const updateHtmlElement = (el: HTMLElement, data: ElementEditData) => {
  if (el.outerHTML !== data.outerHTML) {
    el.outerHTML = data.outerHTML
  } else if (el.innerHTML !== data.innerHTML) {
    el.innerHTML = data.innerHTML
  }
  const customProps = elCustomPropsMap[el?.tagName.toLowerCase()] || defaultCustomProps
  if (customProps) {
    customProps.updateElement(el, data)
  }
}
