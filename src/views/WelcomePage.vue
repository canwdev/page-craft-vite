<script lang="ts">
import {defineComponent} from 'vue'
import {useCommonTools} from '@/components/PageCraft/ToolBar/use-common-tools'
import {formatSiteTitle} from '@/router'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'
import {useMetaTitle} from '@/hooks/use-meta'

export default defineComponent({
  name: 'WelcomePage',
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
  <div class="welcome-page" v-if="showWelcome">
    <ViewPortWindow :show-close="false" wid="welcome" class="welcome-window">
      <template #titleBarLeft>
        {{ metaTitle }}
      </template>
      <div class="tools-wrapper">
        <button
          class="tool-button vp-button font-emoji"
          v-for="(item, index) in toolsMenuOptions"
          :key="index"
          @click="item.props.onClick()"
        >
          {{ item.label }}
        </button>
      </div>
    </ViewPortWindow>
  </div>
</template>

<style lang="scss" scoped>
.welcome-page {
  height: 100%;
  width: 100%;

  .welcome-window {
    min-width: 300px;
    min-height: 500px;
  }

  .tools-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: auto;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    .tool-button {
      padding: 16px 20px;
      cursor: pointer;
      font-size: 16px;
      text-align: left;
      font-weight: 500;
    }
  }
}
</style>
