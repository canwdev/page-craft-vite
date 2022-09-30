<script lang="ts">
import {defineComponent, toRefs} from 'vue'
import VStyle from './VStyle.vue'
import {sassToCSS} from '@/utils/css'

export default defineComponent({
  name: 'DomPreview',
  components: {
    VStyle,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const {style, id} = toRefs(props)
    const styleRewrote = ref('')

    watch(
      style,
      async (val) => {
        try {
          styleRewrote.value = await sassToCSS(`div[data-app-name="${id.value}"] { ${val} }`)
        } catch (e) {
          console.error(e)
          styleRewrote.value = ''
        }
      },
      {immediate: true}
    )

    return {
      styleRewrote,
    }
  },
})
</script>

<template>
  <div :data-app-name="id">
    <VStyle :id="id">{{ styleRewrote }}</VStyle>
    <slot></slot>
  </div>
</template>
