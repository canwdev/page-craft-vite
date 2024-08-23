// 通用表单item模板

import {formatSelectOptions} from '@/utils'
import {autoSetAttr} from '@/components/PageCraft/MainPlayground/utils/dom'
import {IElCustomProp} from '@/components/PageCraft/MainPlayground/utils/element-edit'
import {
  AutoFormItem,
  AutoFormItemType,
  MixedFormItems,
} from '@/components/CanUI/packages/AutoFormElPlus/enum'

const genInputFormItem = (key: string, rows = 0) => {
  return {
    label: key,
    key: key,
    type: AutoFormItemType.INPUT,
    props: {
      clearable: true,
      type: rows > 0 ? 'textarea' : undefined,
      rows: rows,
    },
  }
}

const genSwitchFormItem = (key: string) => {
  return {
    label: key,
    key: key,
    type: AutoFormItemType.SWITCH,
    props: {
      checkedValue: 'true',
    },
  }
}

export const tplFormItem: {[key: string]: AutoFormItem} = {
  src: {
    label: 'src',
    key: 'src',
    type: AutoFormItemType.INPUT,
    props: {
      clearable: true,
    },
  },
  alt: genInputFormItem('alt'),
  href: {
    label: 'href',
    key: 'href',
    type: AutoFormItemType.INPUT,
    props: {
      clearable: true,
    },
  },
  target: {
    label: 'target',
    key: 'target',
    type: AutoFormItemType.SELECT,
    options: formatSelectOptions(['_blank', '_self', '_parent', '_top']),
    props: {
      clearable: true,
    },
  },
  rel: {
    label: 'rel',
    key: 'rel',
    type: AutoFormItemType.SELECT,
    options: formatSelectOptions(['nofollow noopener noreferrer', 'nofollow']),
    props: {
      clearable: true,
    },
  },
  poster: {
    label: 'poster',
    key: 'poster',
    type: AutoFormItemType.INPUT,
    props: {
      clearable: true,
    },
  },
  placeholder: genInputFormItem('placeholder', 1),
  name: genInputFormItem('name'),
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
  inputType: {
    label: 'type',
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
    ]),
    props: {
      filterable: true,
      clearable: true,
    },
  },
  frameborder: {
    label: 'frameborder',
    key: 'frameborder',
    type: AutoFormItemType.SELECT,
    options: formatSelectOptions(['0']),
    props: {
      clearable: true,
    },
  },
  srcdoc: genInputFormItem('srcdoc', 2),
  required: genSwitchFormItem('required'),
  disabled: genSwitchFormItem('disabled'),
  readonly: genSwitchFormItem('readonly'),
  /**
   * HTML 全局属性
   * https://www.runoob.com/tags/ref-standardattributes.html
   */
  title: genInputFormItem('title', 1),
  tabindex: {
    label: 'tabindex',
    key: 'tabindex',
    type: AutoFormItemType.INPUT_NUMBER,
  },
  id: genInputFormItem('id'),
  className: genInputFormItem('class'),
  dir: {
    label: 'dir',
    key: 'dir',
    type: AutoFormItemType.SELECT,
    options: formatSelectOptions(['ltr', 'rtl', 'auto']),
    props: {
      clearable: true,
    },
  },
  style: genInputFormItem('style', 1),
}

// 自动给key添加前缀
export const mapCustomPropsKeys = (item: MixedFormItems) => {
  if ('cols' in item) {
    item.children = item.children.map(mapCustomPropsKeys)
    return item
  }
  if (Array.isArray(item)) {
    item = item.map(mapCustomPropsKeys)
    return item
  }
  return {
    ...item,
    key: `customProps.${item.key}`,
  }
}

// 根据表单数据生成 IElCustomProp
export const genProp = (items: MixedFormItems[] = []): IElCustomProp => {
  // console.log('[genProp]', items)
  items = [
    tplFormItem.className,
    ...items,
    // 添加通用属性
    [tplFormItem.title, tplFormItem.id, tplFormItem.dir],
    tplFormItem.style,
  ]
  const attrKeys: string[] = []
  const traverseItem = (item: MixedFormItems) => {
    if ('cols' in item) {
      item.children.forEach((i) => traverseItem(i))
    } else if (Array.isArray(item)) {
      item.forEach((i) => traverseItem(i))
    } else {
      attrKeys.push(item.key)
    }
  }
  items.forEach(traverseItem)
  // console.log(attrKeys)
  return {
    getCustomProps: (el) => {
      const obj = {}
      attrKeys.forEach((key) => {
        obj[key] = el.getAttribute(key)
      })
      return obj
    },
    updateElement(el, formData) {
      attrKeys.forEach((key) => {
        autoSetAttr(el, key, formData.customProps[key])
      })
    },
    customFormItems: items,
  }
}
