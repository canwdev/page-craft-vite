<script setup lang="ts">
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {ViewDesktopMobile20Regular} from '@vicons/fluent'
import {useRouter} from 'vue-router'
import {useStorage, useVModel} from '@vueuse/core'
import {useRemoteOptions} from '@/components/CommonUI/QuickOptions/utils/use-remote-options'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'

interface Props {
  visible: boolean
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
})
const emit = defineEmits(['update:visible'])
const mVisible = useVModel(props, 'visible', emit)

const router = useRouter()
const isLoading = ref(false)

const iframeRef = ref()
const iframeSrc = ref('')

const defUrl = router.resolve({
  name: 'CraftPlayground',
}).href

const addressBarUrl = useStorage('pagecraft_iframe_browser_url', defUrl, localStorage, {
  listenToStorageChanges: false,
})

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
