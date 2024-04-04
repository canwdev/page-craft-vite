import {IEntry} from '@/components/FileManager/types/filesystem'

export const regComponentV2 = /\.comp$/i

export interface IComponentMeta {
  id: string
  timeCreated: number
  timeUpdated: number
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
  timestampUpdated?: number
  html: string
  style: string
  cover?: string // base64编码的封面
}
