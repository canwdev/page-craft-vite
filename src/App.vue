<script lang="ts">
import {darkTheme, GlobalThemeOverrides} from 'naive-ui'
import {useGlobalTheme} from '@/hooks/use-global-theme'
import AppSub from '@/AppSub.vue'
export default defineComponent({
  components: {
    AppSub,
  },
  setup() {
    const themeOverrides: GlobalThemeOverrides = {
      common: {
        borderRadiusSmall: '0px',
        borderRadius: '0px',
      },
    }

    const {isAppDarkMode} = useGlobalTheme()

    return {
      isAppDarkMode,
      themeOverrides,
      darkTheme,
    }
  },
})
</script>

<template>
  <n-config-provider
    :class="{_dark: isAppDarkMode, '_mc-bg': false}"
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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background-image: url('@/assets/bg/grid-light.png');
    background-size: 100px;
    opacity: 0.4;
  }
  &._dark {
    background-color: #434343;
    background-image: linear-gradient(#434343, #282828);
    //background-color: #5480d3;
    //background-image: linear-gradient(#5480d3, #3256a7);
    &::before {
      background-image: url('@/assets/bg/grid.png');
    }
    &::after {
      color: white;
      text-shadow: 0 0 2px #000;
    }
  }

  &._mc-bg {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    background-image: url('@/assets/bg/day.png');

    &._dark {
      background-image: url('@/assets/bg/twlight.png');
    }
  }
}
</style>
