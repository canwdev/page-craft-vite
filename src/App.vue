<script lang="ts">
import {darkTheme, GlobalThemeOverrides} from 'naive-ui'
import {useGlobalTheme} from '@/hooks/use-global-theme'
import AppSub from '@/AppSub.vue'
import {CustomThemeType} from '@/enum/settings'
import {useSettingsStore} from '@/store/settings'
export default defineComponent({
  components: {
    AppSub,
  },
  setup() {
    const settingsStore = useSettingsStore()

    const {isAppDarkMode, isRect, isAero, themeOverrides} = useGlobalTheme()

    return {
      isAppDarkMode,
      themeOverrides,
      darkTheme,
      settingsStore,
      isAero,
      isRect,
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
        '_mc-bg': false,
      },
      settingsStore.customTheme,
    ]"
    :theme="isAppDarkMode ? darkTheme : null"
    :theme-overrides="themeOverrides"
    class="page-craft-root _line-grid"
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
    background-image: linear-gradient(#434343, #282828);
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

  //&._mc-bg {
  //  background-repeat: no-repeat;
  //  background-size: cover;
  //  background-position: center;
  //  background-image: url('@/assets/bg/day.png');
  //
  //  &._dark {
  //    background-image: url('@/assets/bg/twlight.png');
  //  }
  //}
}
</style>
