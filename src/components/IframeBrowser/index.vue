<script lang="ts">
import {defineComponent} from 'vue'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {ViewDesktopMobile20Regular} from '@vicons/fluent'
import {useRouter} from 'vue-router'
import {useStorage} from '@vueuse/core'

export default defineComponent({
  name: 'IframeBrowser',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {ViewPortWindow, ViewDesktopMobile20Regular},
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

    const shortcutList = computed(() => {
      return [
        {label: 'PageCraft Playground', value: '/#/craft/playground'},
        {label: 'Google', value: 'https://www.google.com/webhp?igu=1'},
        {label: 'Bing', value: 'https://www.bing.com'},
        {label: 'Win11React', value: 'https://win11.blueedge.me/'},
        {label: 'Grid Layout it', value: 'https://grid.layoutit.com/'},
        {label: 'Can I use', value: 'https://caniuse.com/'},
        {label: 'CSS Gradient Generator', value: 'https://www.colorzilla.com/gradient-editor/'},
        {label: 'CSS clip-path maker', value: 'https://bennettfeely.com/clippy/'},
        {label: 'JSON Editor Online', value: 'https://jsoneditoronline.org/'},
        {label: '在线工具 tool.lu', value: 'https://tool.lu/'},
        {label: '二维码生成 cli.im', value: 'https://cli.im/'},
      ].map((item) => {
        return {
          label: '🌎 ' + (item.label || item.value),
          value: item.value,
        }
      })
    })
    const handleSelectShortcut = (url) => {
      addressBarUrl.value = url
      handleGo()
    }

    const iframeWinRef = ref()
    const setMobileView = () => {
      console.log(iframeWinRef.value)
      iframeWinRef.value.setSize(`${375}px`, `${668 + 52}px`)
    }

    return {
      mVisible,
      iframeWinRef,
      iframeRef,
      iframeSrc,
      addressBarUrl,
      handleGo,
      handleIframeLoad,
      handleIframeError,
      titleText,
      shortcutList,
      handleSelectShortcut,
      setMobileView,
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
        <n-dropdown
          :options="shortcutList"
          key-field="value"
          size="small"
          placement="bottom-start"
          @select="handleSelectShortcut"
        >
          <n-button size="tiny">@</n-button>
        </n-dropdown>

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
