<script lang="ts">
import {defineComponent} from 'vue'
import {useCommonTools} from '@/components/PageCraft/ToolBar/use-common-tools'
import {formatSiteTitle} from '@/router'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'
import {useMetaTitle} from '@/hooks/use-meta'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'

export default defineComponent({
  name: 'WelcomePage',
  components: {QuickOptions},
  setup() {
    const showWelcome = ref(true)
    const {t: $t} = useI18n()
    const {toolsMenuOptions} = useCommonTools()
    const router = useRouter()
    const mainStore = useMainStore()

    const {metaTitle} = useMetaTitle()
    return {
      metaTitle,
      showWelcome,
      toolsMenuOptions: [
        {
          label: formatSiteTitle(),
          props: {
            onClick: async () => {
              await router.push({name: 'CraftPage'})
            },
          },
        },
        ...toolsMenuOptions,
        {
          label: $t('common.settings'),
          props: {
            onClick: async () => {
              mainStore.isShowSettings = true
            },
          },
        },
      ],
    }
  },
})
</script>

<template>
  <div class="mc-welcome-page" v-if="showWelcome">
    <ViewPortWindow :show-close="false" wid="welcome" class="welcome-window">
      <template #titleBarLeft>
        {{ metaTitle }}
      </template>

      <div class="tools-wrapper">
        <QuickOptions :options="toolsMenuOptions" is-static />
      </div>
    </ViewPortWindow>
  </div>
</template>

<style lang="scss">
.mc-welcome-page {
  height: 100%;
  width: 100%;

  .welcome-window {
    min-width: 300px;
    min-height: 500px;
  }

  .tools-wrapper {
    .option-item {
      font-size: 16px;
    }
  }
}
</style>
