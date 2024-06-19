import {FormRules} from 'naive-ui'

export type OptionItem = {
  value: string | number
  label: string
}

export enum AutoFormItemType {
  INPUT = 'input',
  ADVANCED_INPUT = 'advanced_input',
  MONACO_EDITOR = 'monaco_editor',
  INPUT_NUMBER = 'input_number',
  SELECT = 'select',
  COLOR_PICKER = 'color_picker',
  BUTTON = 'button',
  DATE_PICKER = 'date_picker',
  CHECKBOX_GROUP = 'checkbox_group',
  RADIO_GROUP = 'radio_group',
  SWITCH = 'switch',
  // 需要哪些类型请自行实现
}

export type AutoFormItem = {
  // 调试用原始数据
  _original?: any
  key: string
  label?: string
  // 表单控件类型
  type?: AutoFormItemType
  placeholder?: string
  // 表单控件的属性
  props?: any
  // 当前FormItem的规则
  rules?: any
  formItemProps?: any
  // SELECT下拉选项
  options?: OptionItem[]
  // 渲染函数 h('div', {}, null)
  render?: any
  // 按钮的点击执行函数
  clickHandler?: any
  // 类名
  cls?: any
  disabled?: boolean
  width?: string
}

// 自定义列数
export type AutoFormRow = {
  cols: number
  children: AutoFormItem[]
}

export type MixedFormItems = (AutoFormRow | AutoFormItem)[] | AutoFormItem | AutoFormRow

// 表单架构
export type AutoFormSchema = {
  formItems: MixedFormItems[]
  model: any
  rules?: FormRules
  props?: any
  actionButtons?: boolean
  labelWidth?: string
  labelPosition?: string
}
