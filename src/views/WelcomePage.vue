<script lang="ts">
import {defineComponent} from 'vue'
import {useMainStore} from '@/store/main'

export default defineComponent({
  name: 'WelcomePage',
  setup() {
    const mainStore = useMainStore()
    onMounted(() => {
      mainStore.isShowQuickLaunch = true
    })
  },
})
</script>

<template>
  <div class="mc-welcome-page"></div>
</template>

<style lang="scss">
.mc-welcome-page {
  height: 100%;
  width: 100%;
}
</style>
