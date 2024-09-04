<script lang="ts" setup>
import {CopyMode, copyModeOptions} from '@/enum/vue-i18n-tool'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'

const props = withDefaults(
  defineProps<{
    content?: string
  }>(),
  {
    content: '',
  },
)
const emit = defineEmits([])
const {content} = toRefs(props)

const i18nMainStore = useI18nMainStore()
// 一键复制模板
const highlightCopyMode = ref<CopyMode | null>(null)
const handleCopy = (mode: CopyMode) => {
  let text = ``

  if (mode === CopyMode.ORIGINAL) {
    text = `$t('${content.value}')`
  } else if (mode === CopyMode.TEMPLATE) {
    text = `{{ $t('${content.value}') }}`
  } else if (mode === CopyMode.VHTML) {
    text = `v-html="$t('${content.value}')"`
  } else if (mode === CopyMode.DOLLART) {
    text = `this.$t('${content.value}')`
  }

  highlightCopyMode.value = mode
  i18nMainStore.trLastCopyMode = mode

  window.$qlUtils.copy(text)
}

defineExpose({
  handleCopy,
})
</script>

<template>
  <div class="copy-buttons-wrap vp-button-group">
    <!-- 一键复制按钮 -->
    <button
      v-for="item in copyModeOptions"
      :key="item.value"
      :title="item.desc"
      @click="handleCopy(item.value)"
      class="vp-button secondary"
      :class="{primary: item.value === highlightCopyMode}"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.copy-buttons-wrap {
  display: flex;
  align-items: center;
}
</style>
