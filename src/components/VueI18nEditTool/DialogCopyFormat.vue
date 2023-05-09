<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {copyToClipboard} from '@/utils'

export default defineComponent({
  name: 'DialogCopyFormat',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    formatText: {
      type: Function,
      default: null,
    },
  },
  setup(props, {emit}) {
    const {formatText} = toRefs(props)
    const mVisible = useModelWrapper(props, emit, 'visible')
    const textInput = ref('')
    const textOutput = ref('')

    watch(textInput, () => {
      textOutput.value = formatText ? formatText.value(textInput.value) : textInput.value
    })

    return {
      mVisible,
      textInput,
      textOutput,
    }
  },
})
</script>

<template>
  <n-modal v-model:show="mVisible" preset="dialog" :title="title" style="min-width: 800px">
    <div class="style-tools">
      <div class="common-card">
        <div class="main-box font-code">
          <n-input
            class="input-text"
            type="textarea"
            v-model:value="textInput"
            placeholder="Text Input"
          ></n-input>
          <n-input
            class="input-text"
            type="textarea"
            v-model:value="textOutput"
            placeholder="Text Output"
          ></n-input>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
.style-tools {
  .main-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    .input-text {
      flex: 1;
      height: 50vh;
      padding: 5px;
      & + .input-text {
        margin-left: 10px;
      }
    }
  }
}
</style>
