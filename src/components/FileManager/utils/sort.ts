import {IEntry} from '../types/filesystem'

export const defaultSorter = (a: IEntry, b: IEntry) => {
  const aVal = a.isDirectory ? 1 : 2
  const bVal = b.isDirectory ? 1 : 2
  const typeDirection = aVal - bVal
  if (typeDirection !== 0) return typeDirection
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

export const nameSorter = (a: IEntry, b: IEntry) => {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

export const nameDescSorter = (a: IEntry, b: IEntry) => {
  return -a.name.toLowerCase().localeCompare(b.name.toLowerCase())
}

export const sizeSorter = (a: IEntry, b: IEntry) => {
  return (a.size || 0) - (b.size || 0)
}

export const sizeDescSorter = (a: IEntry, b: IEntry) => {
  return -((a.size || 0) - (b.size || 0))
}

export const extensionSorter = (a: IEntry, b: IEntry) => {
  return a.ext.toLowerCase().localeCompare(b.ext.toLowerCase())
}

export const extensionDescSorter = (a: IEntry, b: IEntry) => {
  return -a.ext.toLowerCase().localeCompare(b.ext.toLowerCase())
}

export const lastModifiedSorter = (a: IEntry, b: IEntry) => {
  return a.lastModified - b.lastModified
}

export const lastModifiedDescSorter = (a: IEntry, b: IEntry) => {
  return -(a.lastModified - b.lastModified)
}

export const birthTimeSorter = (a: IEntry, b: IEntry) => {
  return a.birthtime - b.birthtime
}

export const birthTimeDescSorter = (a: IEntry, b: IEntry) => {
  return -(a.birthtime - b.birthtime)
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

export const sortMethodMap = {
  [SortType.default]: defaultSorter,
  [SortType.name]: nameSorter,
  [SortType.nameDesc]: nameDescSorter,
  [SortType.size]: sizeSorter,
  [SortType.sizeDesc]: sizeDescSorter,
  [SortType.extension]: extensionSorter,
  [SortType.extensionDesc]: extensionDescSorter,
  [SortType.lastModified]: lastModifiedSorter,
  [SortType.lastModifiedDesc]: lastModifiedDescSorter,
  [SortType.birthTime]: birthTimeSorter,
  [SortType.birthTimeDesc]: birthTimeDescSorter,
}
