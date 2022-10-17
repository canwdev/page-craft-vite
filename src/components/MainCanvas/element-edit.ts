import {autoSetAttr, tagsHasSrcAttr} from '@/utils/dom'
import {formatSelectOptions} from '@/utils'

export enum CustomFormInputType {
  TEXT = 'text',
  SWITCH = 'switch',
  SELECT = 'select',
}

export type CustomFormItem = {
  label: string
  key: string
  type: CustomFormInputType
  options?: []
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
      type: CustomFormInputType.TEXT,
    },
  ],
  // 更新元素的函数
  updateElement(el, formData: ElementEditForm) {
    autoSetAttr(el, 'src', formData.customProps.src)
  },
}

const _inputProp = {
  getCustomProps: (el) => {
    return {
      placeholder: el.getAttribute('placeholder'),
      disabled: el.hasAttribute('disabled'),
      readonly: el.hasAttribute('readonly'),
    }
  },
  customFormItems: [
    {
      label: 'placeholder',
      key: 'placeholder',
      type: CustomFormInputType.TEXT,
    },
    {
      label: 'disabled',
      key: 'disabled',
      type: CustomFormInputType.SWITCH,
    },
    {
      label: 'readonly',
      key: 'readonly',
      type: CustomFormInputType.SWITCH,
    },
  ],
  updateElement(el, formData: ElementEditForm) {
    autoSetAttr(el, 'placeholder', formData.customProps.placeholder)
    autoSetAttr(el, 'disabled', formData.customProps.disabled)
    autoSetAttr(el, 'readonly', formData.customProps.readonly)
  },
}

export const elementCustomPropsMap = {
  img: srcProp,
  a: {
    getCustomProps: (el) => {
      return {
        href: el.getAttribute('href'),
        target: el.getAttribute('target'),
      }
    },
    customFormItems: [
      {
        label: 'href',
        key: 'href',
        type: CustomFormInputType.TEXT,
      },
      {
        label: 'target',
        key: 'target',
        type: CustomFormInputType.SELECT,
        options: formatSelectOptions(['', '_blank', '_self']),
      },
    ],
    updateElement(el, formData: ElementEditForm) {
      autoSetAttr(el, 'href', formData.customProps.href)
      autoSetAttr(el, 'target', formData.customProps.target)
    },
  },
  input: _inputProp,
  textarea: _inputProp,
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
