<script lang="ts">
import {defineComponent} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import QuickLaunch from '@/components/QuickLaunch/index.vue'

export default defineComponent({
  name: 'QuickLaunchWindow',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {QuickLaunch, ViewPortWindow},
  emits: ['update:visible'],
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const route = useRoute()

    const qlRef = ref()
    watch(mVisible, (val) => {
      if (val) {
        setTimeout(() => {
          qlRef.value.focus()
        }, 100)
      }
    })

    const showClose = computed(() => {
      return route.name !== 'HomePage'
    })
    return {
      mVisible,
      showClose,
      qlRef,
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
    allow-maximum
  >
    <template #titleBarLeft>
      <img src="@/assets/textures/enchanted_book.png" alt="icon" />
      Quick Launch (alt+r)
    </template>

    <QuickLaunch ref="qlRef" />
  </ViewPortWindow>
</template>

<style lang="scss">
.quick-launch-window {
  min-width: 400px;
  min-height: 400px;
  position: fixed;
}
</style>
