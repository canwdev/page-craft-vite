<script lang="ts">
import {defineComponent} from 'vue'
import {useCommonTools} from '@/components/PageCraft/ToolBar/use-common-tools'
import {formatSiteTitle} from '@/router'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'

export default defineComponent({
  name: 'WelcomePage',
  setup() {
    const showWelcome = ref(true)
    const {t: $t} = useI18n()
    const {toolsMenuOptions} = useCommonTools()
    const router = useRouter()
    const mainStore = useMainStore()

    return {
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
    <div class="vp-panel">
      <n-button
        class="vp-button"
        v-for="(item, index) in toolsMenuOptions"
        :key="index"
        @click="item.props.onClick()"
      >
        {{ item.label }}
      </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-page {
  height: 100%;
  width: 100%;
  padding: 50px;

  .vp-panel {
    margin-right: auto;
    width: fit-content;
    height: fit-content;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .vp-button {
      padding: 10px 20px;
      cursor: pointer;
    }
  }
}
</style>
