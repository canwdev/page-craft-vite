<script lang="ts">
import {defineComponent} from 'vue'
import MainPlayground from '@/components/PageCraft/MainPlayground/index.vue'
import {useGlobalStyle} from '@/hooks/use-global-theme'
import {useSettingsStore} from '@/store/settings'
import {usePlaygroundStore} from '@/store/playground'
import {sassToCSS} from '@/utils/css'
import {LsKeys} from '@/enum/page-craft'
import {useCompStorage} from '@/hooks/use-component-storage'

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
      const gloCss = localStorage.getItem(LsKeys.GLOBAL_STYLE) || ''
      playgroundStore.globalCSS = await _sassToCSS(gloCss)

      let curScss = localStorage.getItem(LsKeys.VARIABLES_STYLE) || ''
      curScss = curScss + '\n' + loadCurCompStyle()
      playgroundStore.currentCSS = await _sassToCSS(curScss)
    })
  },
})
</script>

<template>
  <MainPlayground style="height: 100%; overflow: auto" />
</template>
