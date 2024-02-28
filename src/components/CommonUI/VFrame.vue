<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  setup(props, context) {
    const iFrameRef = ref()

    // onBeforeUpdate(() => {
    //   iApp.value.children = Object.freeze(this.$slots.default);
    // });

    const renderChildren = () => {
      const iDoc = iFrameRef.value.contentDocument || iFrameRef.value.contentWindow.document

      const children = context.slots.default
      const body = iDoc.body
      const el = document.createElement('div')
      body.appendChild(el)

      createApp({
        render: children,
      }).mount(el)
    }

    return {
      iFrameRef,
      renderChildren,
    }
  },
})
</script>

<template>
  <iframe frameborder="0" @load="renderChildren" ref="iFrameRef"></iframe>
</template>
