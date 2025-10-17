<script setup lang="ts">
import QuickOptions from '@canwdev/vgo-ui/src/components/QuickOptions/index.vue'
import ViewPortWindow from '@canwdev/vgo-ui/src/components/ViewPortWindow/index.vue'
import VueMonaco from '@canwdev/vgo-ui/src/components/VueMonaco/index.vue'
import { useTextareaAutosize } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useQLogics } from './q-logics'
import { useQuickLaunchPlugins } from './q-logics/plugins'

const route = useRoute()
const qRef = ref()
// 是否进入了子页面
const isEnterSub = ref(false)

function focus() {
  textareaRef.value.focus()
}

onMounted(() => {
  setTimeout(() => {
    focus()
    update()
  })
})
const { textarea: textareaRef, input: anyText } = useTextareaAutosize()

function update() {
  handleSearch(anyText)
}
const qlOptions = ref([])
const { filteredOptions, handleSearch, editingCustomPlugin, saveCustomPlugin, runCustomPlugin }
  = useQLogics(qlOptions, update)
useQuickLaunchPlugins(update, anyText)

watch(route, () => {
  update()
})
function handleInput() {
  if (isEnterSub.value) {
    // 进入子页面后不刷新查询
    return
  }
  update()
}
function cleanText() {
  anyText.value = ''
  update()
}

defineExpose({
  focus,
})
</script>

<template>
  <div class="quick-launch">
    <textarea
      ref="textareaRef"
      v-model="anyText"
      rows="1"
      placeholder="/?"
      type="textarea"
      class="font-code vgo-input"
      @input="handleInput"
      @keyup.esc="cleanText"
    />
    <QuickOptions
      ref="qRef"
      :auto-focus="true"
      :options="filteredOptions"
      visible
      is-static
      class="font-emoji"
      @on-close="textareaRef.focus()"
      @on-enter="isEnterSub = true"
      @on-back="isEnterSub = false"
    />
  </div>
  <Teleport to="body">
    <ViewPortWindow
      v-if="editingCustomPlugin"
      :visible="!!editingCustomPlugin"
      :init-win-options="{ width: '500px', height: '500px' }"
      allow-maximum
      @on-close="editingCustomPlugin = null"
    >
      <template #titleBarLeft>
        Editing Plugin: {{ editingCustomPlugin?.name }}
      </template>
      <template #titleBarRightControls>
        <button title="Run Script" @click="runCustomPlugin">
          ▶️
        </button>
        <button title="Save" @click="saveCustomPlugin">
          💾
        </button>
      </template>

      <VueMonaco
        v-if="editingCustomPlugin"
        v-model="editingCustomPlugin.code"
        language="javascript"
        show-line-numbers
      />
    </ViewPortWindow>
  </Teleport>
</template>

<style lang="scss">
.quick-launch {
  display: flex;
  flex-direction: column;
  height: 100%;
  & > textarea {
    box-sizing: border-box;
    width: 100% !important;
    border-radius: 0 !important;
    min-height: 28px;
    max-height: 150px !important;
    scrollbar-width: none;
    line-height: 1;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
  }
  .quick-options {
    flex: 1;
    overflow: auto;
    width: 100%;
    .option-item {
      font-size: 16px;
      line-height: 1.5;
      white-space: pre-wrap;
    }
  }
}
</style>
