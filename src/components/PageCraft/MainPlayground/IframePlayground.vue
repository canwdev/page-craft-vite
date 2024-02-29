<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'IframePlayground',
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
