<script lang="ts">
import {defineComponent} from 'vue'
import {useMainStore} from '@/store/main'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useSettingsStore} from '@/store/settings'

export default defineComponent({
  name: 'ClassNameInput',
  setup(props, {emit}) {
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()

    /*classname autocomplete start*/
    const autocompleteKeywordMap = ref({})
    const autocompleteOptions = computed(() => {
      const value = mainStore.className
      const list = Object.keys(autocompleteKeywordMap.value)
        .map((key) => {
          return {
            label: key,
            value: key,
          }
        })
        .filter((item) => {
          return item.value.includes(value)
        })

      if (!autocompleteKeywordMap.value[value] && list.length) {
        list.unshift({
          label: value,
          value: value,
        })
      }
      return list.filter((item) => {
        return item.value.includes(value)
      })
    })
    const handleInputClassNameBlur = () => {
      if (!mainStore.className) {
        return
      }
      autocompleteKeywordMap.value[mainStore.className] = true
    }
    const handleAddClassName = () => {
      const value = mainStore.className
      console.log(value)
      let sl = ''
      value.split(' ').forEach((c) => {
        sl += '.' + c
      })
      const code = `\n${sl} {\n}\n`
      globalEventBus.emit(GlobalEvents.ON_ADD_STYLE, {code, isAppend: false})

      autocompleteKeywordMap.value[value] = true

      mainStore.className = ''
    }
    /*classname autocomplete end*/

    return {
      settingsStore,
      mainStore,
      handleAddClassName,
      handleInputClassNameBlur,
      autocompleteOptions,
    }
  },
})
</script>

<template>
  <n-space size="small">
    <div class="field-row">
      <n-auto-complete
        v-model:value="mainStore.className"
        :options="autocompleteOptions"
        size="tiny"
        type="text"
        placeholder="CSS class"
        clearable
        class="font-code sl-css-class-input"
        title="focus shortcut: alt+1; 输入@开启自动提示; press enter to insert css class; input without dot(.)"
        :placement="settingsStore.enableTopLayout ? 'bottom' : 'top'"
        @blur="handleInputClassNameBlur"
        @keyup.enter="handleAddClassName()"
      />
    </div>

    <div class="field-row">
      <n-input
        size="tiny"
        type="text"
        v-model:value="mainStore.innerText"
        placeholder="innerHTML | src | value"
        title="focus shortcut: alt+2"
        class="sl-inner-html-input"
        clearable
      />
    </div>
  </n-space>
</template>
