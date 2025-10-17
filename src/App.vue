<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import AppSub from '@/AppSub.vue'
import { useUpdater } from '@/components/OS/SettingsApp/use-updater'
import { useCssStyleTag } from '@/components/StyleEditor/utils/css-store'
import { isDev } from '@/enum'
import { useFocusAutoAction } from '@/hooks/use-focus-auto-action'
import { useGlobalTheme } from '@/hooks/use-global-theme'
import { useMainStore } from '@/store/main'
import { useSettingsStore } from '@/store/settings'

const settingsStore = useSettingsStore()
const mainStore = useMainStore()

const { isAppDarkMode } = useGlobalTheme()
provide('darkMode', { isAppDarkMode })

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
  }
  else if (event.altKey && key === 'q') {
    mainStore.isShowQuickLaunch = !mainStore.isShowQuickLaunch
  }
  else if (event.altKey && key === 'i') {
    mainStore.isShowIframeBrowser = !mainStore.isShowIframeBrowser
  }
})

useFocusAutoAction()
useUpdater('canwdev', 'page-craft-vite')
useCssStyleTag()
</script>

<template>
  <div class="page-craft-root" :style="bgStyle">
    <AppSub />
  </div>
</template>

<style lang="scss">
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

.dark {
  color: white;
  .page-craft-root {
    background-color: #181818;
  }

  .mdi {
    font-size: 18px;
  }
}
</style>
