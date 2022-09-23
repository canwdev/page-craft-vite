<script lang="ts">
import {GlobalThemeOverrides, darkTheme} from 'naive-ui'
import AppContent from '@/AppContent.vue'
import {useGlobalTheme} from '@/hooks/use-global-theme'

export default defineComponent({
  components: {
    AppContent,
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
    :theme="isAppDarkMode ? darkTheme : null"
    class="page-craft-root"
    :class="{_dark: isAppDarkMode}"
    :theme-overrides="themeOverrides"
  >
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-message-provider placement="top-right">
          <n-dialog-provider>
            <AppContent />
          </n-dialog-provider>
        </n-message-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.page-craft-root {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: aliceblue;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  //background-image: url('https://api.dujin.org/bing/1920.php');
  background-image: url('@/assets/bg/day.png');

  &._dark {
    background-image: url('@/assets/bg/twlight.png');
  }
}
</style>
