<script lang="ts">
import {defineComponent} from 'vue'
import styleUrl from './main-playground.css?url'
import {useMcMain} from '@/components/PageCraft/MainPlayground/hooks/main-hooks'
import {useIndicator} from '@/components/PageCraft/MainPlayground/hooks/indicator-hooks'
import VFrame from '@/components/CommonUI/VFrame.vue'

export default defineComponent({
  name: 'IframePlayground',
  components: {VFrame},
  setup(props, {emit}) {
    return {}
  },
})
</script>

<template>
  <iframe class="iframe-playground" frameborder="0" src="/#/craft/playground" />
</template>

<style lang="scss">
.iframe-playground {
  width: 100%;
  height: 100%;
}
</style>
