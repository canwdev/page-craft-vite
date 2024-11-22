<script lang="ts" setup>
import {useVModel} from '@vueuse/core'
import MarkdownRender from '@/components/RichText/MarkdownRender.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    dark?: boolean
  }>(),
  {
    modelValue: '',
  },
)
const emit = defineEmits(['update:modelValue'])
const mValue = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="markdown-editor">
    <div class="editor-container">
      <div class="editor-input font-code">
        <textarea class="vp-input" v-model="mValue" placeholder="Input markdown content"></textarea>
      </div>
      <MarkdownRender class="editor-preview" :dark="dark" :text="mValue" />
    </div>
  </div>
</template>

<style lang="scss">
.markdown-editor {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;

  .editor-container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .editor-input,
  .editor-preview {
    width: 50%;
    height: 100%;
    box-sizing: border-box;
  }

  .editor-input {
    textarea {
      width: 100%;
      height: 100%;
      resize: none;
      box-sizing: border-box;
      padding: 10px;
      font-size: 16px;
      border-radius: 0;
    }
  }

  .editor-preview {
    overflow-y: auto;
    padding: 20px;
  }
}
</style>
