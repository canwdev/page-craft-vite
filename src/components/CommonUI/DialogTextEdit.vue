<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'

export default defineComponent({
  name: 'DialogTextEdit',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Text edit',
    },
    placeholder: {
      type: String,
      default: 'Input text',
    },
    text: {
      type: String,
      default: '',
    },
    isTextarea: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onSave'],
  setup(props, {emit}) {
    const {text} = toRefs(props)
    const mVisible = useModelWrapper(props, emit, 'visible')

    const editingText = ref('')
    watch(text, (val) => {
      editingText.value = val
    })

    return {
      mVisible,
      editingText,
      handleSave() {
        emit('onSave', editingText.value)
      },
    }
  },
})
</script>

<template>
  <n-modal
    style="width: 700px"
    preset="dialog"
    negative-text="Cancel"
    positive-text="Done"
    :title="title"
    @positive-click="handleSave"
    @negative-click="mVisible = false"
    @close="mVisible = false"
    :show="mVisible"
  >
    <n-input
      v-if="mVisible && editingText"
      :type="isTextarea ? 'textarea' : 'text'"
      v-model:value="editingText"
      class="font-code"
      :rows="isTextarea ? 25 : null"
      :placeholder="placeholder"
      autofocus
    ></n-input>
  </n-modal>
</template>
