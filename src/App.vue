<script lang="ts">
import {GlobalThemeOverrides, darkTheme} from 'naive-ui'
import AppContent from '@/AppContent.vue'

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

    return {
      themeOverrides,
      darkTheme,
    }
  },
})
</script>

<template>
  <n-config-provider :theme="darkTheme" class="page-craft-root" :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-message-provider>
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
  /*background-image: url("https://api.dujin.org/bing/1920.php");*/
  background-image: url('@/assets/bg/night.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}
</style>
