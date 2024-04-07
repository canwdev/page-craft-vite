import {IEntry} from '@/components/FileManager/types/filesystem'
import {IComponentItem, regComponentV2} from '@/components/PageCraft/ComponentExplorer/enum'

const isNormalDir = (item: IComponentItem) => {
  return item.isDirectory && !regComponentV2.test(item.name)
}

export const nameSorter = (a: IEntry, b: IEntry) => {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

export const nameDescSorter = (a: IEntry, b: IEntry) => {
  return -a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

export const birthTimeSorter = (a: IComponentItem, b: IComponentItem) => {
  const aVal = isNormalDir(a) ? 1 : 2
  const bVal = isNormalDir(b) ? 1 : 2
  const typeDirection = aVal - bVal
  if (typeDirection !== 0) return typeDirection
  return (a.meta?.timeCreated || 0) - (b.meta?.timeCreated || 0)
}

export const birthTimeDescSorter = (a: IComponentItem, b: IComponentItem) => {
  const aVal = isNormalDir(a) ? 1 : 2
  const bVal = isNormalDir(b) ? 1 : 2
  const typeDirection = aVal - bVal
  if (typeDirection !== 0) return typeDirection
  return -(a.meta?.timeCreated || 0) - (b.meta?.timeCreated || 0)
}

export enum SortType {
  name = 'name',
  nameDesc = 'nameDesc',
  birthTime = 'birthTime',
  birthTimeDesc = 'birthTimeDesc',
}

export const sortMethodMap = {
  [SortType.name]: nameSorter,
  [SortType.nameDesc]: nameDescSorter,
  [SortType.birthTime]: birthTimeSorter,
  [SortType.birthTimeDesc]: birthTimeDescSorter,
}
