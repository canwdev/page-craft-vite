import {autoSetAttr, tagsHasSrcAttr} from '@/components/PageCraft/MainPlayground/utils/dom'
import {formatSelectOptions} from '@/utils'
import {AutoFormItemType, MixedFormItems} from '@/components/CommonUI/AutoFormNaive/enum'

// 元素编辑中的表单数据
export interface ElementEditData {
  tagName: string
  className: string
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

const srcProp: IElCustomProp = {
  getCustomProps: (el) => {
    return {
      src: el.getAttribute('src'),
      alt: el.getAttribute('alt'),
    }
  },
  customFormItems: [
    {
      label: 'src',
      key: 'src',
      type: AutoFormItemType.INPUT,
    },
    {
      label: 'alt',
      key: 'alt',
      type: AutoFormItemType.INPUT,
    },
  ],
  updateElement(el, formData) {
    autoSetAttr(el, 'src', formData.customProps.src)
    autoSetAttr(el, 'alt', formData.customProps.alt)
  },
}

const _inputProp: IElCustomProp = {
  getCustomProps: (el) => {
    return {
      type: el.getAttribute('type'),
      placeholder: el.getAttribute('placeholder'),
      disabled: el.hasAttribute('disabled'),
      readonly: el.hasAttribute('readonly'),
    }
  },
  customFormItems: [
    {
      label: 'type (for <input/> only)',
      key: 'type',
      type: AutoFormItemType.SELECT,
      options: formatSelectOptions([
        'text',
        'email',
        'number',
        'password',
        'tel',
        'button',
        'submit',
        'checkbox',
        'radio',
        'color',
        'date',
        'datetime',
        'time',
        'datetime-local',
        'month',
        'week',
        'file',
        'image',
        'range',
        'reset',
        'search',
        'url',
        'hidden',
        '',
      ]),
    },
    {
      label: 'placeholder',
      key: 'placeholder',
      type: AutoFormItemType.INPUT,
    },
    {
      label: 'disabled',
      key: 'disabled',
      type: AutoFormItemType.SWITCH,
    },
    {
      label: 'readonly',
      key: 'readonly',
      type: AutoFormItemType.SWITCH,
    },
  ],
  updateElement(el, formData: ElementEditData) {
    if (el.tagName === 'INPUT') {
      autoSetAttr(el, 'type', formData.customProps.type)
    }
    autoSetAttr(el, 'placeholder', formData.customProps.placeholder)
    autoSetAttr(el, 'disabled', formData.customProps.disabled)
    autoSetAttr(el, 'readonly', formData.customProps.readonly)
  },
}

// TODO: 重构
export const elementCustomPropsMap: IElCustomPropMap = {
  a: {
    getCustomProps: (el) => {
      return {
        href: el.getAttribute('href'),
        target: el.getAttribute('target'),
        rel: el.getAttribute('rel'),
      }
    },
    customFormItems: [
      {
        label: 'href',
        key: 'href',
        type: AutoFormItemType.INPUT,
      },
      {
        label: 'target',
        key: 'target',
        type: AutoFormItemType.SELECT,
        options: formatSelectOptions(['', '_blank', '_self', '_parent', '_top']),
      },
      {
        label: 'rel',
        key: 'rel',
        type: AutoFormItemType.SELECT,
        options: formatSelectOptions(['', 'nofollow noopener noreferrer']),
      },
    ],
    updateElement(el, formData: ElementEditData) {
      autoSetAttr(el, 'href', formData.customProps.href)
      autoSetAttr(el, 'target', formData.customProps.target)
      autoSetAttr(el, 'rel', formData.customProps.rel)
    },
  },
  input: _inputProp,
  textarea: _inputProp,
  video: {
    getCustomProps: (el) => {
      return {
        src: el.getAttribute('src'),
        poster: el.getAttribute('poster'),
      }
    },
    customFormItems: [
      {
        label: 'src',
        key: 'src',
        type: AutoFormItemType.INPUT,
      },
      {
        label: 'poster',
        key: 'poster',
        type: AutoFormItemType.INPUT,
      },
    ],
    updateElement(el, formData: ElementEditData) {
      autoSetAttr(el, 'src', formData.customProps.src)
      autoSetAttr(el, 'poster', formData.customProps.poster)
    },
  },
}

// 生成所有具有src属性的标签的自定义属性
tagsHasSrcAttr.forEach((tag) => {
  if (elementCustomPropsMap[tag]) {
    elementCustomPropsMap[tag] = {...elementCustomPropsMap[tag]}
  } else {
    elementCustomPropsMap[tag] = {...srcProp}
  }
})

export const formatForm = (el: HTMLElement | null): ElementEditData => {
  const options: any = el || {}
  const customProps = el && elementCustomPropsMap[el?.tagName.toLowerCase()]
  return {
    tagName: options.tagName || '',
    className: options.className || '',
    innerHTML: options.innerHTML || '',
    outerHTML: options.outerHTML || '',
    // get element specific custom props
    customProps: customProps && customProps.getCustomProps(el),
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
  const customProps = elementCustomPropsMap[el?.tagName.toLowerCase()]

  if (!customProps) {
    return []
  }

  return customProps.customFormItems
}

export const updateHtmlElement = (el, data) => {
  if (el.outerHTML !== data.outerHTML) {
    el.outerHTML = data.outerHTML
  } else if (el.innerHTML !== data.innerHTML) {
    el.innerHTML = data.innerHTML
  }
  if (el.className !== data.className) {
    el.className = data.className
  }
  const customProps = elementCustomPropsMap[el?.tagName.toLowerCase()]
  if (customProps) {
    customProps.updateElement(el, data)
  }
}
