<script setup lang="ts">
import {parseComponent} from 'vue-template-compiler'
import {onMounted, ref} from 'vue'
import {useStorage} from '@vueuse/core'
import {VueLangExtractor} from '@/components/Apps/VueLangExtractor/utils/extractor'
import VueMonaco from '@/components/CanUI/packages/VueMonaco/index.vue'
import _set from 'lodash/set'
import demoVue2 from './demo/DemoVue2.vue?raw'
import {readClipboardData} from '@/utils'

const inputSFC = useStorage('vlx_input_vue_sfc', '', localStorage, {
  listenToStorageChanges: false,
})
const keyPrefix = useStorage('vlx_key_prefix', 'extracted_texts', localStorage, {
  listenToStorageChanges: false,
})

const extractedTexts = ref('')
const outputSFC = ref('')
const outputWarnings = ref('')

const formatValue = (value: string) => {
  // 处理HTML字符串中的  \n  为空格
  return value.replace(/ *\n */g, ' ')
}

const runConvert = async () => {
  try {
    const parsed = parseComponent(inputSFC.value)
    console.log('parsed vueContent', parsed)
    const newVueTmplArr: string[] = []
    let textMap: {[key: string]: string} = {}

    const vueLangEx = new VueLangExtractor(keyPrefix.value)
    const warnings: any[] = []

    if (parsed.template) {
      const result = vueLangEx.extractTemplate(parsed.template.content)

      // console.log('extract template result', result)
      Object.keys(result.textMap).forEach((key) => {
        _set(textMap, key, formatValue(result.textMap[key]))
      })

      newVueTmplArr.push(`<template>${result.newTemplate}</template>`)

      if (result.warnings.length > 0) {
        warnings.push(...result.warnings)
      }
    }

    try {
      let script = parsed.script?.content || parsed.scriptSetup?.content
      if (script) {
        const result = vueLangEx.extractScript(script)
        // console.log('extract script result', result)

        Object.keys(result.textMap).forEach((key) => {
          _set(textMap, key, formatValue(result.textMap[key]))
        })

        // console.log(result.textMap)
        // console.log(result.newTemplate)
        newVueTmplArr.push(`<script>${result.newTemplate}<\/script>`)

        if (result.warnings.length > 0) {
          warnings.push(...result.warnings)
        }
      }
    } catch (e) {
      console.error('extract script error', e)
      window.$message.warning('暂不支持支持TypeScript。extract script error:' + e.message)
    }

    if (parsed.styles) {
      parsed.styles.forEach((style) => {
        const lang = style.lang ? ` lang="${style.lang}"` : ``
        const scoped = style.scoped ? ` scoped` : ``
        newVueTmplArr.push(`<style${lang}${scoped}>${style.content}</style>`)
      })
    }

    if (warnings.length > 0) {
      outputWarnings.value = JSON.stringify(warnings, null, 2)
    } else {
      outputWarnings.value = ''
    }
    outputSFC.value = newVueTmplArr.join('\n\n')
    extractedTexts.value = JSON.stringify(textMap, null, 2)
  } catch (e: any) {
    console.error('parse error', e)
    window.$message.error('template parse error: ' + e.message)
  }
}

onMounted(() => {
  runConvert()
})

const copy = (text) => {
  window.$mcUtils.copy(text)
}
const saveFile = (text, ext) => {
  window.$mcUtils.handleExportFile('', text, '.json')
}
const handleClear = () => {
  inputSFC.value = ''
  outputSFC.value = ''
  extractedTexts.value = ''
  outputWarnings.value = ''
  console.log('---------- 内容已清除 ----------')
}

const handleDrop = async (event: DragEvent) => {
  const files = event.dataTransfer?.files
  console.log(files)
  if (files && files.length > 0) {
    inputSFC.value = await window.$mcUtils.handleReadSelectedFile(files[0])
    runConvert()
  }
}
const handleSelectFile = async () => {
  inputSFC.value = await window.$mcUtils.handleImportTextFile({
    types: [
      {
        description: 'Vue SFC File',
        accept: {
          'text/vue': ['.vue'],
        },
      },
    ],
  })
  runConvert()
}

const loadDemo = async () => {
  handleClear()
  inputSFC.value = demoVue2
  runConvert()
}

const pasteAndCopy = async () => {
  inputSFC.value = await readClipboardData()
  await runConvert()
  copy(outputSFC.value)
}
</script>

<template>
  <div
    class="vue-lang-extractor flex-cols"
    @dragenter.prevent
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <!--<textarea class="input-text" v-model="inputSFC" placeholder="Input Vue SFC"></textarea>-->

    <div class="input-row">
      <div class="input-box">
        <div class="input-header">
          <div>Input Vue SFC</div>
          <div class="flex-rows">
            <button @click="handleSelectFile" class="vp-button">Open *.vue File</button>
            <span>-- or drop vue file here --</span>
          </div>

          <div class="flex-rows">
            <button @click="handleClear" class="vp-button">Clear</button>
            <button @click="loadDemo" class="vp-button">Demo</button>
          </div>
        </div>
        <VueMonaco v-model="inputSFC" class="input-text" language="html" ref="monacoEditorRef" />
      </div>
    </div>

    <div class="flex-rows action-row">
      <div class="flex-rows" style="width: 200px">
        <span class="mdi mdi-code-json"></span>
        <input
          v-model="keyPrefix"
          @keyup.esc="() => (keyPrefix = '')"
          placeholder="key prefix"
          class="vp-input"
        />
      </div>
      <div class="flex-rows">
        <button @click="runConvert" class="vp-button primary">↓ Convert ↓</button>
      </div>
      <div class="flex-rows" style="width: 200px; justify-content: flex-end">
        <button @click="pasteAndCopy" class="vp-button">
          <span class="mdi mdi-content-paste"></span> Paste+Copy
        </button>
      </div>
    </div>

    <div class="out-row">
      <div class="out-item">
        <div class="input-box">
          <div class="input-header">
            <div>Converted Vue SFC</div>

            <div class="flex-rows">
              <button
                @click="saveFile(outputSFC, '.vue')"
                class="btn-no-style mdi mdi-download"
              ></button>
              <button @click="copy(outputSFC)" class="btn-no-style mdi mdi-content-copy">
                Copy New SFC
              </button>
            </div>
          </div>
          <VueMonaco v-model="outputSFC" class="input-text" language="html" ref="monacoEditorRef" />
        </div>
      </div>
      <div class="out-item">
        <div class="input-box">
          <div class="input-header">
            <div>Extracted Texts</div>

            <div class="flex-rows">
              <button
                @click="saveFile(extractedTexts, '.json')"
                class="btn-no-style mdi mdi-download"
              ></button>
              <button @click="copy(extractedTexts)" class="btn-no-style mdi mdi-content-copy">
                Copy JSON
              </button>
            </div>
          </div>
          <VueMonaco
            v-model="extractedTexts"
            class="input-text"
            language="json"
            ref="monacoEditorRef"
          />
        </div>
      </div>
    </div>

    <div v-if="outputWarnings" class="log-row">
      <div class="out-item">
        <div class="input-box">
          <div class="input-header">
            <div>⚠️ Warnings, open console to see more details</div>

            <div class="flex-rows">
              <div class="flex-rows">
                <button
                  @click="saveFile(outputWarnings, '.json')"
                  class="btn-no-style mdi mdi-download"
                ></button>
                <button
                  @click="copy(outputWarnings)"
                  class="btn-no-style mdi mdi-content-copy"
                ></button>
              </div>
            </div>
          </div>
          <VueMonaco
            v-model="outputWarnings"
            class="input-text"
            language="html"
            ref="monacoEditorRef"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vue-lang-extractor {
  padding: 2px;
  box-sizing: border-box;
  height: 100%;
  gap: 2px;
  .input-row {
    height: 30%;
    border: 1px solid $color_border;
    overflow: hidden;
    .input-header {
      background: #009688;
      color: white;
    }
  }

  .action-row {
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    font-size: 14px;

    .flex-rows {
      gap: 4px;
      align-items: center;
    }
  }

  .out-row {
    flex: 1;
    display: flex;
    gap: 2px;
    overflow: hidden;
    border: 1px solid $color_border;
    border-left: none;
    border-right: none;
    .out-item {
      height: 100%;
      flex: 1;
      flex-shrink: 0;
      overflow: hidden;
      border-left: 1px solid $color_border;
      border-right: 1px solid $color_border;
    }
    .input-header {
      background: #4caf50;
      color: white;
    }
  }

  .log-row {
    height: 25%;
    border: 1px solid $color_border;
    overflow: hidden;
    .out-item {
      height: 100%;
      flex: 1;
      flex-shrink: 0;
      overflow: hidden;
      border: 1px solid $color_border;
    }
    .input-header {
      background-color: #ffeb3b;
      color: #000;
      font-size: 12px !important;
    }
  }

  .input-box {
    flex: 1;
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;
    outline: 1px solid $color_border;
    display: flex;
    flex-direction: column;

    .input-header {
      padding: 4px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid $color_border;
      button {
        font-size: 12px;
        padding: 0 4px;
        line-height: 1;
      }
      .vp-button {
        padding: 2px 4px;
      }

      .flex-rows {
        gap: 4px;
        align-items: center;
      }
    }

    .input-text {
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      border-radius: 0;
    }
  }

  ::v-deep .vue-monaco-placeholder {
    min-height: auto;
  }
}
</style>
