<script lang="ts">
import {defineComponent} from 'vue'
import MainPlayground from '@/components/PageCraft/MainPlayground/index.vue'
import {usePlaygroundStore} from '@/store/playground'
import {sassToCSS} from '@/components/PageCraft/StyleEditor/utils/css'
import {useCompStorage} from '@/hooks/use-component-storage'
import {StyleEditorKeys} from '@/components/PageCraft/StyleEditor/enum'

export default defineComponent({
  name: 'CraftPlayground',
  components: {MainPlayground},
  setup() {
    const playgroundStore = usePlaygroundStore()
    const {loadCurCompStyle} = useCompStorage()

    async function _sassToCSS(val) {
      try {
        return await sassToCSS(val)
      } catch (e) {
        console.error('[_sassToCSS]', e)
        return ''
      }
    }

    onMounted(async () => {
      const gloCss = localStorage.getItem(StyleEditorKeys.GLOBAL_STYLE) || ''
      playgroundStore.globalCSS = await _sassToCSS(gloCss)

      let curScss = localStorage.getItem(StyleEditorKeys.VARIABLES_STYLE) || ''
      curScss = curScss + '\n' + loadCurCompStyle()
      playgroundStore.currentCSS = await _sassToCSS(curScss)
    })
  },
})
</script>

<template>
  <MainPlayground style="height: 100%; overflow: auto" />
</template>
