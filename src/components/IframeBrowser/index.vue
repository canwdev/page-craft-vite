<script lang="ts">
export default {
  name: 'IframeBrowser',
}
</script>

<script lang="ts" setup>
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import {useRouter} from 'vue-router'
import {useStorage, useVModel} from '@vueuse/core'
import {useRemoteOptions} from '@/components/CanUI/packages/QuickOptions/utils/use-remote-options'
import QuickOptions from '@/components/CanUI/packages/QuickOptions/index.vue'
import {LS_SettingsKey} from '@/enum/settings'

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
  iframeWinRef.value.setPos('width', 375 + 10 + 'px')
  iframeWinRef.value.setPos('height', 668 + 59 + 'px')
}
</script>

<template>
  <ViewPortWindow
    ref="iframeWinRef"
    class="iframe-browser-vp-window"
    v-model:visible="mVisible"
    wid="iframe_browser"
    allow-maximum
    :init-win-options="{
      width: '350px',
      height: '500px',
    }"
  >
    <template #titleBarLeft>Iframe Browser {{ titleText }}</template>
    <template #titleBarRightControls>
      <button @click="setMobileView">📱</button>
    </template>

    <div v-if="mVisible" class="iframe-browser-inner-wrap">
      <div class="iframe-browser-address-bar-wrap">
        <div class="button-wrap">
          <button class="vp-button" @click="showShortcuts = true">@</button>
          <QuickOptions :options="shortcutList" v-model:visible="showShortcuts" title="Shortcuts" />
        </div>

        <input
          class="vp-input iframe-browser-input font-code"
          v-model="addressBarUrl"
          placeholder="input url (https://)"
          type="text"
          @keyup.enter="handleGo()"
        />
        <button class="vp-button" @click="handleGo()">Go</button>
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
.iframe-browser-vp-window {
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
  }

  .iframe-browser-inner-iframe {
    flex: 1;
  }
}
</style>
