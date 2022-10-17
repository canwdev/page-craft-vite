import {tagsHasSrcAttr} from '@/utils/dom'

export type CustomFormItem = {
  label: string
  key: string
}

export type ElementEditForm = {
  tagName: string
  className: string
  innerHTML: string
  customProps: any
}

const srcProp = {
  // 获取表单自定义属性，放置于 `customProps` 对象内
  getCustomProps: (el) => {
    return {
      src: el.getAttribute('src'),
    }
  },
  // 表单UI属性
  customFormItems: [
    {
      label: 'src',
      key: 'src',
    },
  ],
  // 更新元素的函数
  updateElement(el, formData: ElementEditForm) {
    el.setAttribute('src', formData.customProps.src)
  },
}

export const elementCustomPropsMap = {
  img: srcProp,
}

// 生成所有具有src属性的标签的自定义属性
tagsHasSrcAttr.forEach((tag) => {
  elementCustomPropsMap[tag] = srcProp
})

export const formatForm = (el: HTMLElement | null): ElementEditForm => {
  const options: any = el || {}
  const customProps = el && elementCustomPropsMap[el?.tagName.toLowerCase()]
  return {
    tagName: options.tagName || '',
    className: options.className || '',
    innerHTML: options.innerHTML || '',
    // get element specific custom props
    customProps: customProps && customProps.getCustomProps(el),
  }
}

// get element specific form items
export const getCustomFormItems = (el: HTMLElement | null): CustomFormItem[] => {
  if (!el) {
    return []
  }
  const customProps = elementCustomPropsMap[el?.tagName.toLowerCase()]

  if (!customProps) {
    return []
  }

  return customProps.customFormItems
}
