<script lang="ts">
import {defineComponent} from 'vue'
import {useCommonTools} from '@/components/QuickLaunch/use-common-tools'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'
import {useMetaTitle} from '@/hooks/use-meta'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import {formatSiteTitle} from '@/router/router-utils'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import moment from 'moment/moment'
import {copyToClipboard} from '@/utils'
import {promptGetFileName} from '@/utils/exporter'
import {TextConvertMode, textConvertMultipleLine} from '@/components/VueI18nEditTool/copy-enum'
import {useQLogics} from '@/components/QuickLaunch/q-logics'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {useSettingsStore} from '@/store/settings'

export default defineComponent({
  name: 'QuickLaunch',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {ViewPortWindow, QuickOptions},
  emits: ['update:visible'],
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const {t: $t} = useI18n()
    const {toolsMenuOptions} = useCommonTools()
    const router = useRouter()
    const route = useRoute()
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()
    const inputRef = ref()
    const qRef = ref()
    onMounted(() => {
      inputRef.value.focus()
    })
    watch(mVisible, (val) => {
      if (val) {
        setTimeout(() => {
          inputRef.value.focus()
        }, 100)
      }
    })

    const {metaTitle} = useMetaTitle()

    const anyText = ref('')
    const qlOptions = computed((): QuickOptionItem[] => {
      let list: QuickOptionItem[] = [
        ...toolsMenuOptions,
        {
          label: '⚙️ ' + $t('common.settings'),
          search: 'settings',
          props: {
            onClick: async () => {
              mainStore.isShowSettings = true
            },
          },
        },
      ]
      if (route.name === 'CraftPage') {
        list = [
          {
            label: '🌎 Iframe Browser (alt+i)',
            props: {
              onClick: async () => {
                mainStore.isShowQuickLaunch = false
                settingsStore.isShowIframeBrowser = !settingsStore.isShowIframeBrowser
              },
            },
          },
          ...list,
        ]
      } else {
        list = [
          {
            label: '🖼️ ' + formatSiteTitle(),
            props: {
              onClick: async () => {
                mainStore.isShowQuickLaunch = false
                await router.push({name: 'CraftPage'})
              },
            },
          },
          ...list,
        ]
      }

      if (route.name !== 'HomePage') {
        if (settingsStore.enableWelcomePage) {
          list = [
            ...list,
            {
              label: '🏠 Welcome Page',
              props: {
                onClick: async () => {
                  await router.push({name: 'HomePage'})
                },
              },
            },
          ]
        }
      }

      return list
    })

    const {filteredOptions, handleInput} = useQLogics(qlOptions)

    onMounted(() => {
      handleInput(anyText.value)
    })
    watch(route, () => {
      handleInput(anyText.value)
    })

    const showClose = computed(() => {
      return route.name !== 'HomePage'
    })

    return {
      mVisible,
      metaTitle,
      inputRef,
      qRef,
      anyText,
      qlOptions,
      handleInput,
      filteredOptions,
      showClose,
    }
  },
})
</script>

<template>
  <ViewPortWindow
    v-model:visible="mVisible"
    :show-close="showClose"
    wid="ql"
    class="quick-launch-window"
  >
    <template #titleBarLeft>
      <img src="@/assets/textures/enchanted_book.png" alt="icon" />
      Quick Launch (alt+r)
    </template>

    <div class="tools-wrapper">
      <n-input
        ref="inputRef"
        rows="1"
        clearable
        v-model:value="anyText"
        @input="handleInput"
        placeholder="/?"
        type="textarea"
        class="font-code"
      />
      <QuickOptions
        ref="qRef"
        :auto-focus="false"
        :options="filteredOptions"
        is-static
        @keyup.esc="inputRef.focus()"
      />
    </div>
  </ViewPortWindow>
</template>

<style lang="scss">
.quick-launch-window {
  min-width: 300px;
  min-height: 400px;
  position: fixed;
}

.tools-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  .quick-options {
    flex: 1;
    overflow: auto;
    .option-item {
      font-size: 16px;
      line-height: 1.5;
      white-space: pre-wrap;
    }
  }
}
</style>
