import {LsKeys} from '@/enum/page-craft'
import {useSettingsStore} from '@/store/settings'

const SPLIT_SIGN = '__'

const renameLsKey = (key: string, newKey: string) => {
  const value = localStorage.getItem(key) || ''
  localStorage.setItem(newKey, value)
  localStorage.removeItem(key)
}

const copyLsKey = (key: string, newKey: string) => {
  const value = localStorage.getItem(key) || ''
  localStorage.setItem(newKey, value)
}

// 读写组件存储
export const loadCompStorage = (lsKey: LsKeys, name: string) => {
  return localStorage.getItem(lsKey + SPLIT_SIGN + name) || ''
}
export const saveCompStorage = (lsKey: LsKeys, name: string, value: string) => {
  return localStorage.setItem(lsKey + SPLIT_SIGN + name, value)
}
