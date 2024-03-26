<script lang="ts">
import {defineComponent} from 'vue'
import {useMainStore} from '@/store/main'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useSettingsStore} from '@/store/settings'
import InputAutoTips from '@/components/CommonUI/InputAutoTips.vue'

export default defineComponent({
  name: 'ClassNameInput',
  components: {InputAutoTips},
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
  <InputAutoTips
    v-model="mainStore.className"
    class="sl-css-class-input font-code"
    :title="`Focus shortcut: alt+1\nPress enter to insert css class\nInput without dot(.)`"
    hid="class"
    @keyup.enter="handleAddClassName"
  />

  <input
    type="text"
    v-model="mainStore.innerText"
    placeholder="innerHTML | src | value"
    :title="`Focus shortcut: alt+2\nPress esc to clear`"
    class="vp-input sl-inner-html-input font-code"
    @keyup.esc="mainStore.innerText = ''"
  />
</template>
