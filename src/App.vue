<script lang="ts">
import {darkTheme, GlobalThemeOverrides} from 'naive-ui'
import {useGlobalTheme} from '@/hooks/use-global-theme'
import AppSub from '@/AppSub.vue'
import {useSettingsStore} from '@/store/settings'
import {isDev} from '@/enum'
import {useMainStore} from '@/store/main'
import {useEventListener} from '@vueuse/core'
import {useFocusAutoAction} from '@/hooks/use-focus-auto-action'

export default defineComponent({
  components: {
    AppSub,
  },
  setup() {
    const settingsStore = useSettingsStore()
    const mainStore = useMainStore()

    const {isAppDarkMode, isRect, isAero, themeOverrides} = useGlobalTheme()

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
      } else if (event.altKey && key === 'r') {
        mainStore.isShowQuickLaunch = !mainStore.isShowQuickLaunch
      } else if (event.altKey && key === 'i') {
        settingsStore.isShowIframeBrowser = !settingsStore.isShowIframeBrowser
      }
    })

    useFocusAutoAction()

    return {
      isAppDarkMode,
      themeOverrides,
      darkTheme,
      settingsStore,
      isAero,
      isRect,
      bgStyle,
    }
  },
})
</script>

<template>
  <n-config-provider
    :class="[
      {
        _dark: isAppDarkMode,
        _aero: isAero,
        _rect: isRect,
        _rounded: !isRect,
      },
      settingsStore.customTheme,
    ]"
    :theme="isAppDarkMode ? darkTheme : null"
    :theme-overrides="themeOverrides"
    class="page-craft-root _line-grid"
    :style="bgStyle"
  >
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-message-provider placement="top">
          <n-dialog-provider>
            <RouterView />
            <AppSub />
          </n-dialog-provider>
        </n-message-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
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

  //&::before {
  //  content: '';
  //  position: absolute;
  //  top: 0;
  //  left: 0;
  //  right: 0;
  //  bottom: 0;
  //  pointer-events: none;
  //  background-image: url('@/assets/bg/grid-light.png');
  //  background-size: 100px;
  //  opacity: 0.4;
  //}
  &._dark {
    background-color: #181818;
    //background-color: #5480d3;
    //background-image: linear-gradient(#5480d3, #3256a7);
    //&::before {
    //  background-image: url('@/assets/bg/grid.png');
    //}
    &::after {
      color: white;
      text-shadow: 0 0 2px #000;
    }
  }
}
</style>
