<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {copyToClipboard} from '@/utils'

export default defineComponent({
  name: 'StylusTools',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const styleInput = ref(`@require "./file.styl"
/**
multi-line comment
*/
.class1, .class2
  padding 1px // comment
  margin 0px 5px 0px 5px
  color alpha(red, 0.5)
  if (!condition)
    @extend .class3
  else
    background blue
  block =
    display none`)
    const styleOutput = ref('')
    const errorText = ref('')

    function doFormat() {
      try {
        styleOutput.value = window.stylusSupermacyFormat(styleInput.value, {
          tabStopChar: '  ',
        })
        errorText.value = ''
      } catch (e: any) {
        console.error(e)
        errorText.value = e.message
      }
    }

    function doClear() {
      styleInput.value = ''
      doFormat()
    }

    return {
      mVisible,
      styleInput,
      styleOutput,
      errorText,
      doFormat,
      doClear,
    }
  },
})
</script>

<template>
  <n-modal v-model:show="mVisible" preset="dialog" title="Stylus Tools" style="min-width: 800px">
    <div class="style-tools">
      <div class="common-card">
        <div class="action-row">
          <n-button size="small" @click="doFormat">Format</n-button>
          <n-button size="small" @click="doClear">Clear</n-button>
          <n-a href="https://thisismanta.github.io/stylus-supremacy/#demo" target="_blank"
            >Stylus Supermacy</n-a
          >
        </div>
        <div class="main-box font-code">
          <n-input
            class="input-text"
            type="textarea"
            v-model:value="styleInput"
            placeholder="Input Stylus Code"
          ></n-input>
          <n-input
            class="input-text"
            type="textarea"
            v-model:value="styleOutput"
            placeholder="Formatted"
          ></n-input>
        </div>
        <div class="error-box">
          {{ errorText }}
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
.style-tools {
  .action-row {
    margin-bottom: 10px;
    button {
      margin-right: 10px;
    }
  }

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

  .error-box {
    color: #e60036;
  }
}
</style>
