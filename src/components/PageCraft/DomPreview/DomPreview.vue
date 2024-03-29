<script lang="ts">
import {defineComponent, toRefs} from 'vue'
import VStyle from './VStyle.vue'
import {sassToCSS} from '@/components/StyleEditor/utils/css'

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
    css: {
      type: String,
      default: '',
    },
  },
  emits: ['styleCompiled'],
  setup(props, {emit}) {
    const {css, id} = toRefs(props)
    const styleRewrote = ref('')

    watch(
      css,
      async (val) => {
        try {
          styleRewrote.value = await sassToCSS(`div[data-app-name="${id.value}"] { ${val} }`)
        } catch (e) {
          console.error(e)
          styleRewrote.value = ''
        }
        nextTick(() => {
          emit('styleCompiled')
        })
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
