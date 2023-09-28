import {ComponentData, ComponentExportData, createComponentBlockItem} from '@/enum/page-craft/block'
import ExampleComponent from '@/enum/page-craft/example-component.json'
import {saveCompStorage} from '@/hooks/use-component-storage'
import {useSettingsStore} from '@/store/settings'
import {LsKeys} from '@/enum/page-craft'

export const useInitComponents = (options) => {
  const {componentListRef} = options
  const settingsStore = useSettingsStore()

  if (!settingsStore.isInitialized) {
    // create example component if not initialized
    if (!componentListRef.value.length) {
      const item: ComponentExportData = {...ExampleComponent}
      saveCompStorage(LsKeys.COMP_HTML, item.name, item.html)
      saveCompStorage(LsKeys.COMP_STYLE, item.name, item.style)
      saveCompStorage(LsKeys.COMP_META, item.name, JSON.stringify(new ComponentData(item)))

      componentListRef.value = [createComponentBlockItem(item.name, item)]
      settingsStore.curCompoName = item.name
    }
    window.$message.success('Welcome to PageCraft!')
    settingsStore.isInitialized = true
  }
}
