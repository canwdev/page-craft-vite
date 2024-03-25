export interface IEntry {
  name: string
  ext: string
  isDirectory: boolean
  hidden: boolean
  lastModified: number
  birthtime: number
  size?: number
  error?: string
  mimeType?: string
}
export enum SortType {
  default = 'default',
  name = 'name',
  nameDesc = 'nameDesc',
  size = 'size',
  sizeDesc = 'sizeDesc',
  extension = 'extension',
  extensionDesc = 'extensionDesc',
  lastModified = 'lastModified',
  lastModifiedDesc = 'lastModifiedDesc',
  birthTime = 'birthTime',
  birthTimeDesc = 'birthTimeDesc',
}
