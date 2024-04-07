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
      default: '',
    },
    style: {
      type: String,
      default: '',
    },
  },
  emits: ['styleCompiled'],
  setup(props, {emit}) {
    const {style, id} = toRefs(props)
    const styleRewrote = ref('')

    const mId = computed(() => {
      if (!id.value) {
        return 'dom_preview_temp_id'
      }
      return id.value
    })

    watch(
      style,
      async (val) => {
        try {
          styleRewrote.value = await sassToCSS(`div[data-app-name="${mId.value}"] { ${val} }`)
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
      mId,
    }
  },
})
</script>

<template>
  <div :data-app-name="mId">
    <VStyle :id="mId">{{ styleRewrote }}</VStyle>
    <slot></slot>
  </div>
</template>
