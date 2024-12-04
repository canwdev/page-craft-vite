<script lang="ts">
import {useGlobalTheme} from '@/hooks/use-global-theme'
import AppSub from '@/AppSub.vue'
import {useSettingsStore} from '@/store/settings'
import {isDev} from '@/enum'
import {useMainStore} from '@/store/main'
import {useEventListener} from '@vueuse/core'
import {useFocusAutoAction} from '@/hooks/use-focus-auto-action'
import {useUpdater} from '@/components/SystemSettings/use-updater'
import {useCssStyleTag} from '@/components/StyleEditor/utils/css-store'

export default defineComponent({
  components: {
    AppSub,
  },
  setup() {
    const settingsStore = useSettingsStore()
    const mainStore = useMainStore()

    const {isAppDarkMode} = useGlobalTheme()

    const bgStyle = computed(() => {
      const s: any = {}
      if (settingsStore.desktopWallpaper) {
        s.backgroundImage = `url(${settingsStore.desktopWallpaper})`
      }
      if (settingsStore.desktopBgColor) {
        s.backgroundColor = settingsStore.desktopBgColor
      }
      return s
    })

    useEventListener(document, 'keydown', (event) => {
      const key = event.key.toLowerCase()
      if (event.ctrlKey && key === 'r' && !event.shiftKey && !isDev) {
        event.preventDefault()
        window.$message.info('ctrl+r is disabled')
      } else if (event.altKey && key === 'q') {
        mainStore.isShowQuickLaunch = !mainStore.isShowQuickLaunch
      } else if (event.altKey && key === 'i') {
        mainStore.isShowIframeBrowser = !mainStore.isShowIframeBrowser
      } else if (event.altKey && key === 'g') {
        mainStore.isShowAiChat = !mainStore.isShowAiChat
      }
    })

    useFocusAutoAction()
    useUpdater('canwdev', 'page-craft-vite')
    useCssStyleTag()

    return {
      bgStyle,
    }
  },
})
</script>

<template>
  <div class="page-craft-root" :style="bgStyle">
    <transition name="fade" mode="out-in">
      <RouterView />
    </transition>
    <AppSub />
  </div>
</template>

<style lang="scss">
#app {
}
.page-craft-root {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f8f8f8;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

._dark {
  color: white;
  .page-craft-root {
    background-color: #181818;
  }

  .mdi {
    font-size: 18px;
  }
}
</style>
