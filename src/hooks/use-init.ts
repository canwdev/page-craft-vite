import {createComponentBlockItem} from '@/enum/page-craft/block'
import ExampleComponent from '@/enum/page-craft/example-component.json'
import {saveComponentHtml, saveComponentStyle} from '@/hooks/use-component-storage'
import {useSettingsStore} from '@/store/settings'

export const useInitComponents = (options) => {
  const {componentListRef} = options
  const settingsStore = useSettingsStore()

  if (!settingsStore.isInitialized) {
    // create example component if not initialized
    if (!componentListRef.value.length) {
      const item: any = {...ExampleComponent}
      saveComponentHtml(item.name, item.html)
      saveComponentStyle(item.name, item.style)
      delete item.html
      delete item.style
      componentListRef.value = [createComponentBlockItem(item.name, item)]
      settingsStore.curCompoName = item.name
    }
    window.$message.success('Welcome to PageCraft!')
    settingsStore.isInitialized = true
  }
}
