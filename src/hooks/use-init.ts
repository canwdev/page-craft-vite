import {useLocalStorageBoolean} from '@/hooks/use-local-storage'
import {LsKeys} from '@/enum/page-craft'
import {createComponentBlockItem} from '@/enum/page-craft/block'
import ExampleComponent from '@/enum/page-craft/example-component.json'
import {saveComponentHtml, saveComponentStyle} from '@/hooks/use-component-storage'

export const useInitComponents = (options) => {
  const {componentListRef, currentComponentNameRef} = options
  const isInitialized = useLocalStorageBoolean(LsKeys.IS_INITIALIZED, false)

  if (!isInitialized.value) {
    // create example component if not initialized
    if (!componentListRef.value.length) {
      const item: any = {...ExampleComponent}
      saveComponentHtml(item.name, item.html)
      saveComponentStyle(item.name, item.style)
      delete item.html
      delete item.style
      componentListRef.value = [createComponentBlockItem(item.name, item)]
      currentComponentNameRef.value = item.name
    }
    window.$message.success('Welcome to PageCraft!')
    isInitialized.value = true
  }
}
