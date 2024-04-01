<script lang="ts" setup>
import {countryCodeSvg} from '@/utils/flags/country-code-emoji'

interface Props {
  src?: string
  cc?: string
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  cc: '',
  size: '',
})

const {cc, src} = toRefs(props)
const flagSrc = computed(() => {
  if (src.value) {
    return src.value
  }
  let code = cc.value
  if (code.includes('.')) {
    code = code.split('.')[0] || ''
  }
  if (code.length !== 2) {
    code = code.split('-').pop() || ''
  }
  return countryCodeSvg(code)
})
</script>

<template>
  <div class="cc-flag" :style="{width: size, height: size}" :title="cc">
    <img :src="flagSrc" v-if="flagSrc" :alt="cc" />
  </div>
</template>

<style lang="scss" scoped>
.cc-flag {
  border-radius: 50%;
  overflow: hidden;
  display: inline-flex;
  $size: 18px;
  height: $size;
  width: $size;
  img {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
  }
}
</style>
