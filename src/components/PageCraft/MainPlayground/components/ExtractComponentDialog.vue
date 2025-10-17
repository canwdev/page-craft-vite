<script lang="ts" setup="">
import ViewPortWindow from '@canwdev/vgo-ui/src/components/ViewPortWindow/index.vue'
import VueMonaco from '@canwdev/vgo-ui/src/components/VueMonaco/index.vue'
import { useVModel } from '@vueuse/core'
import { useSettingsStore } from '@/store/settings'
import { readClipboardData } from '@/utils'
import globalEventBus, { GlobalEvents } from '@/utils/global-event-bus'

const props = withDefaults(
  defineProps<{
    visible?: boolean
  }>(),
  {
    visible: false,
  },
)
const emit = defineEmits(['update:visible'])
const mVisible = useVModel(props, 'visible', emit, { passive: true })
const settingsStore = useSettingsStore()

const className = ref('')
const dataForm = ref({
  name: '',
  html: '',
  style: '',
})

function showDialog(editingNode) {
  className.value = editingNode.className || ''
  const name = window.$mcUtils.changeCase.pascalCase(className.value)

  dataForm.value = {
    name,
    html: editingNode.outerHTML || '',
    style: '',
  }

  mVisible.value = true
}

function handleCreateComponent() {
  globalEventBus.emit(GlobalEvents.CREATE_COMPONENT, {
    ...dataForm.value,
    successCallback: ({ name }) => {
      window.$message.success(`[${name}] created successfully!`)
      mVisible.value = false
    },
  })
}

async function pasteStyle() {
  dataForm.value.style = await readClipboardData()
}

async function copyClassName() {
  window.$mcUtils.copy(className.value, true)
}

defineExpose({
  showDialog,
})
</script>

<template>
  <ViewPortWindow
    v-model:visible="mVisible"
    allow-maximum
    wid="component_extractor"
    :init-win-options="{
      width: '800px',
      height: '600px',
    }"
  >
    <template #titleBarLeft>
      <span class="mdi mdi-star-four-points-box" />
      Component Extractor
    </template>
    <template #titleBarRightControls>
      <button class="vgo-button primary" @click="handleCreateComponent">
        {{ $t('actions.ok') }}
      </button>
    </template>

    <div class="extract-component-main">
      <div class="input-wrapper flex-row-center-gap font-code">
        <label class="flex-row-center-gap">
          Component Name:
          <input v-model="dataForm.name" class="vgo-input">
        </label>
        <button class="btn-no-style font-code" @click="copyClassName">
          <span class="mdi mdi-content-copy" />{{ className }}
        </button>
      </div>

      <div class="out-row">
        <div class="out-item">
          <div class="input-box">
            <div class="input-header">
              <div>HTML</div>

              <div class="flex-rows" />
            </div>
            <VueMonaco v-model="dataForm.html" class="input-text" language="html" />
          </div>
        </div>
        <div class="out-item">
          <div class="input-box">
            <div class="input-header" style="background-color: #309dd4">
              <div class="flex-rows">
                SCSS

                <button class="btn-no-style mdi mdi-content-paste" @click="pasteStyle" />
              </div>

              <div class="flex-rows">
                <button
                  class="btn-no-style mdi mdi-format-paint"
                  title="Open style editor"
                  @click="settingsStore.showStyleEditor = true"
                />
              </div>
            </div>
            <VueMonaco v-model="dataForm.style" class="input-text" language="scss" />
          </div>
        </div>
      </div>
    </div>
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
.extract-component-main {
  height: 100%;
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .input-wrapper {
    padding: 0 8px;
  }

  .out-row {
    flex: 1;
    display: flex;
    gap: 2px;
    overflow: hidden;
    border: 1px solid var(--vgo-color-border);
    border-left: none;
    border-right: none;
    .out-item {
      height: 100%;
      flex: 1;
      flex-shrink: 0;
      overflow: hidden;
      border-left: 1px solid var(--vgo-color-border);
      border-right: 1px solid var(--vgo-color-border);
    }
    .input-header {
      background-color: #e35e2c;
      color: #fff;
    }
  }
  .input-box {
    flex: 1;
    height: 100%;
    flex-shrink: 0;
    overflow: hidden;
    outline: 1px solid var(--vgo-color-border);
    display: flex;
    flex-direction: column;

    .input-header {
      padding: 4px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 4px;
      border-bottom: 1px solid var(--vgo-color-border);
      button {
        font-size: 12px;
        padding: 0 4px;
        line-height: 1;
      }
      .vgo-button {
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

  :deep(.vue-monaco-placeholder) {
    min-height: auto;
  }
}
</style>
