<script lang="ts" setup>
import QuickOptions from '@canwdev/vgo-ui/src/components/QuickOptions/QuickOptions.vue'
import { useRemoteOptions } from '@canwdev/vgo-ui/src/components/QuickOptions/utils/use-remote-options'
import ViewPortWindow from '@canwdev/vgo-ui/src/components/ViewPortWindow/ViewPortWindow.vue'
import { useStorage, useVModel } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { LS_SettingsKey } from '@/enum/settings'

const props = withDefaults(
  defineProps<{
    visible: boolean
  }>(),
  {
    visible: false,
  },
)

const emit = defineEmits(['update:visible'])

const mVisible = useVModel(props, 'visible', emit)

const router = useRouter()
const isLoading = ref(false)

const iframeRef = ref()
const iframeSrc = ref('')

const defUrl = router.resolve({
  name: 'PlaygroundPage',
}).href

const addressBarUrl = useStorage(
  LS_SettingsKey.PAGECRAFT_IFRAME_BROWSER_URL,
  defUrl,
  localStorage,
  {
    listenToStorageChanges: false,
  },
)

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

function handleGo() {
  iframeSrc.value = ''
  iframeSrc.value = addressBarUrl.value
  isLoading.value = true
}
function handleIframeLoad() {
  isLoading.value = false
}
function handleIframeError(e) {
  isLoading.value = false
  console.error('[handleIframeError]', e)
}

const { options: shortcutList } = useRemoteOptions({
  fetchFn: async () => {
    const res = await fetch('./resources/bookmarks.json')
    return await res.json()
  },
  mapFn: (item) => {
    return {
      label: item.label || item.value,
      iconClass: 'mdi mdi-bookmark',
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
function setMobileView() {
  iframeWinRef.value.setPos('width', `${375 + 10}px`)
  iframeWinRef.value.setPos('height', `${668 + 59}px`)
}
</script>

<template>
  <ViewPortWindow
    ref="iframeWinRef"
    v-model:visible="mVisible"
    class="iframe-browser-vgo-window"
    wid="iframe_browser"
    allow-maximum
    :init-win-options="{
      width: '350px',
      height: '500px',
    }"
  >
    <template #titleBarLeft>
      <span class="mdi mdi-web" />
      Iframe Browser {{ titleText }}
    </template>
    <template #titleBarRightControls>
      <button @click="setMobileView">
        <!--  📱 -->
        <span class="mdi mdi-cellphone" />
      </button>
    </template>

    <div v-if="mVisible" class="iframe-browser-inner-wrap">
      <div class="iframe-browser-address-bar-wrap">
        <div class="button-wrap">
          <button class="vgo-button" @click="showShortcuts = true">
            <span class="mdi mdi-bookmark-box" />
          </button>
          <QuickOptions v-model:visible="showShortcuts" :options="shortcutList" title="Shortcuts" />
        </div>

        <input
          v-model="addressBarUrl"
          class="vgo-input iframe-browser-input font-code"
          placeholder="input url (https://)"
          type="text"
          @keyup.enter="handleGo()"
        >
        <button class="vgo-button" @click="handleGo()">
          <span class="mdi mdi-arrow-left-bottom" />
        </button>
      </div>
      <iframe
        ref="iframeRef"
        class="iframe-browser-inner-iframe"
        :src="iframeSrc"
        frameborder="0"
        @load="handleIframeLoad"
        @error="handleIframeError"
      />
    </div>
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
.iframe-browser-vgo-window {
  min-width: 100px;
  min-height: 200px;
}
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
    .vgo-input,
    .vgo-button {
      border-radius: 0;
      height: 32px;
      box-sizing: border-box;
      .mdi {
        font-size: 18px;
        line-height: 1;
      }
    }
  }

  .iframe-browser-inner-iframe {
    flex: 1;
  }
}
</style>
