<script lang="ts">
import {defineComponent} from 'vue'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {ViewDesktopMobile20Regular} from '@vicons/fluent'
import {useRouter} from 'vue-router'
import {useStorage} from '@vueuse/core'
import {useRemoteOptions} from '@/components/CommonUI/QuickOptions/use-remote-options'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'

export default defineComponent({
  name: 'IframeBrowser',
  components: {ViewPortWindow, ViewDesktopMobile20Regular, QuickOptions},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const router = useRouter()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const isLoading = ref(false)

    const iframeRef = ref()
    const iframeSrc = ref('')

    const defUrl = router.resolve({
      name: 'CraftPlayground',
    }).href

    const addressBarUrl = useStorage('pagecraft_iframe_browser_url', defUrl)

    const titleText = computed(() => {
      if (isLoading.value) {
        return '(Loading...)'
      }
      return ''
    })

    onMounted(() => {
      if (addressBarUrl.value) {
        handleGo()
      }
    })

    const handleGo = () => {
      iframeSrc.value = ''
      iframeSrc.value = addressBarUrl.value
      isLoading.value = true
    }
    const handleIframeLoad = () => {
      isLoading.value = false
    }
    const handleIframeError = (e) => {
      isLoading.value = false
      console.error('[handleIframeError]', e)
    }

    const {options: shortcutList} = useRemoteOptions({
      fetchFn: async () => {
        const res = await fetch('./bookmarks.json')
        return await res.json()
      },
      mapFn: (item) => {
        return {
          label: '🌎 ' + (item.label || item.value),
          value: item.value,
          props: {
            onClick: !item.children
              ? () => {
                  addressBarUrl.value = item.value
                  handleGo()
                }
              : undefined,
          },
        }
      },
    })
    const showShortcuts = ref(false)

    const iframeWinRef = ref()
    const setMobileView = () => {
      console.log(iframeWinRef.value)
      iframeWinRef.value.setSize(`${375}px`, `${668 + 52}px`)
    }

    return {
      mVisible,
      iframeWinRef,
      setMobileView,
      iframeRef,
      iframeSrc,
      addressBarUrl,
      handleGo,
      handleIframeLoad,
      handleIframeError,
      titleText,
      shortcutList,
      showShortcuts,
    }
  },
})
</script>

<template>
  <ViewPortWindow
    ref="iframeWinRef"
    class="iframe-browser-vp-window"
    v-model:visible="mVisible"
    wid="iframe_browser"
    allow-maximum
  >
    <template #titleBarLeft>Iframe Browser {{ titleText }}</template>
    <template #titleBarRightControls>
      <button @click="setMobileView">
        <n-icon size="20"> <ViewDesktopMobile20Regular /> </n-icon>
      </button>
    </template>

    <div v-if="mVisible" class="iframe-browser-inner-wrap">
      <div class="iframe-browser-address-bar-wrap">
        <div class="button-wrap">
          <n-button size="tiny" @click="showShortcuts = true">@</n-button>
          <QuickOptions :options="shortcutList" v-model:visible="showShortcuts" title="Shortcuts" />
        </div>

        <n-input
          class="iframe-browser-input font-code"
          size="tiny"
          v-model:value="addressBarUrl"
          placeholder="input url (https://)"
          type="text"
          @keyup.enter="handleGo()"
        />
        <n-button size="tiny" @click="handleGo()">Go</n-button>
      </div>
      <iframe
        ref="iframeRef"
        @load="handleIframeLoad"
        @error="handleIframeError"
        class="iframe-browser-inner-iframe"
        :src="iframeSrc"
        frameborder="0"
      ></iframe>
    </div>
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
.iframe-browser-inner-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  .button-wrap {
    position: relative;
    .quick-options {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 250px;
    }
  }

  .iframe-browser-address-bar-wrap {
    display: flex;
    .iframe-browser-input {
      flex: 1;
    }
  }

  .iframe-browser-inner-iframe {
    flex: 1;
  }
}
</style>
