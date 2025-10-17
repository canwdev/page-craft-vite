import type { IEntry } from '@/components/FileManager/types/filesystem'
import type { IComponentItem } from '@/components/PageCraft/ComponentExplorer/enum'
import { regComponentV2 } from '@/components/PageCraft/ComponentExplorer/enum'

function isNormalDir(item: IComponentItem) {
  return item.isDirectory && !regComponentV2.test(item.name)
}

export function nameSorter(a: IEntry, b: IEntry) {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

export function nameDescSorter(a: IEntry, b: IEntry) {
  return -a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

export function birthTimeSorter(a: IComponentItem, b: IComponentItem) {
  const aVal = isNormalDir(a) ? 1 : 2
  const bVal = isNormalDir(b) ? 1 : 2
  const typeDirection = aVal - bVal
  if (typeDirection !== 0)
    return typeDirection
  return (a.meta?.timeCreated || 0) - (b.meta?.timeCreated || 0)
}

export function birthTimeDescSorter(a: IComponentItem, b: IComponentItem) {
  const aVal = isNormalDir(a) ? 1 : 2
  const bVal = isNormalDir(b) ? 1 : 2
  const typeDirection = aVal - bVal
  if (typeDirection !== 0)
    return typeDirection

  return (b.meta?.timeCreated || 0) - (a.meta?.timeCreated || 0)
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
