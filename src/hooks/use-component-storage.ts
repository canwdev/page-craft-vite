import {useCraftStore} from '@/store/craft'
import {LsKeys} from '@/enum'

const splitter = '__'

const renameLocalStorageKey = (key: string, newKey: string) => {
  const value = localStorage.getItem(key) || ''
  localStorage.setItem(newKey, value)
  localStorage.removeItem(key)
}

export const useComponentStorage = () => {
  const craftStore = useCraftStore()

  const getKeyWithSuffix = (key: string, suffix = craftStore.currentComponentName) => {
    if (suffix) {
      return key + splitter + suffix
    } else {
      return key
    }
  }

  const loadStorageHtml = () => {
    return localStorage.getItem(getKeyWithSuffix(LsKeys.MAIN_HTML)) || ''
  }
  const saveStorageHtml = (text: string) => {
    localStorage.setItem(getKeyWithSuffix(LsKeys.MAIN_HTML), text)
  }

  const loadStorageStyle = () => {
    return localStorage.getItem(getKeyWithSuffix(LsKeys.MAIN_STYLE)) || ''
  }
  const saveStorageStyle = (text: string) => {
    localStorage.setItem(getKeyWithSuffix(LsKeys.MAIN_STYLE), text)
  }

  const clearComponentStorage = (name) => {
    localStorage.removeItem(getKeyWithSuffix(LsKeys.MAIN_HTML, name))
    localStorage.removeItem(getKeyWithSuffix(LsKeys.MAIN_STYLE, name))
  }

  const renameComponentStorage = (name, newName: string) => {
    renameLocalStorageKey(
      getKeyWithSuffix(LsKeys.MAIN_HTML, name),
      getKeyWithSuffix(LsKeys.MAIN_HTML, newName)
    )
    renameLocalStorageKey(
      getKeyWithSuffix(LsKeys.MAIN_STYLE, name),
      getKeyWithSuffix(LsKeys.MAIN_STYLE, newName)
    )
  }

  return {
    loadStorageHtml,
    saveStorageHtml,
    loadStorageStyle,
    saveStorageStyle,
    clearComponentStorage,
    renameComponentStorage,
  }
}
