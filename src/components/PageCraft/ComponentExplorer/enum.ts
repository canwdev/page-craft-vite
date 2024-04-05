import {IEntry} from '@/components/FileManager/types/filesystem'

export const regComponentV2 = /\.comp$/i

export interface IComponentMeta {
  id: string
  timeCreated: number
  cover?: string
}

export interface IComponentItem extends IEntry {
  meta?: IComponentMeta
}

// 导出专用类型
export interface IComponentExportData {
  id?: string
  name: string
  timestamp: number
  html: string
  style: string
  cover?: string // base64编码的封面
}

// 用于保存在store里的组件状态（选中的组件）
export interface IComponentInStore {
  id: string
  // 组件的显示名称
  title: string
  // 在文件系统里的路径（包括组件文件夹的名字）
  path: string
}
