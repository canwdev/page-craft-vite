<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'

export default defineComponent({
  name: 'FileChooser',
  props: {
    showInput: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    sizeLimit: {
      type: Number,
      default: 2, // 2MB
    },
    accept: {
      type: String,
      default: null,
    },
  },
  emits: ['selected'],
  setup(props, { emit }) {
    const { multiple, sizeLimit } = toRefs(props)
    const fileInputRef = ref<HTMLInputElement>()

    const handleInputFileChange = async (event) => {
      // console.log('[handleInputFileChange]', event)
      const inputEl = fileInputRef.value
      if (!inputEl) {
        return
      }
      const files = Array.from(inputEl.files || [])
      inputEl.value = ''
      // console.log('[files]', files)
      emit('selected', multiple.value ? files : files[0])
    }

    const chooseFile = () => {
      fileInputRef.value!.click()
    }

    return {
      handleInputFileChange,
      chooseFile,
      fileInputRef,
    }
  },
})
</script>

<template>
  <div class="file-chooser">
    <input
      v-show="showInput"
      ref="fileInputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      @change="handleInputFileChange"
    >
  </div>
</template>
