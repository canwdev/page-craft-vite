<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router'
import QuickOptions from '@/components/CanUI/packages/QuickOptions/index.vue'
import {useQLogics} from './q-logics'
import {useTextareaAutosize} from '@vueuse/core'
import {useQuickLaunchPlugins} from './q-logics/plugins'
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import VueMonaco from '@/components/CanUI/packages/VueMonaco/index.vue'

const route = useRoute()
const qRef = ref()
// 是否进入了子页面
const isEnterSub = ref(false)

const focus = () => {
  textareaRef.value.focus()
}

onMounted(() => {
  setTimeout(() => {
    focus()
    update()
  })
})
const {textarea: textareaRef, input: anyText} = useTextareaAutosize()

const update = () => {
  handleSearch(anyText)
}
const qlOptions = ref([])
const {filteredOptions, handleSearch, editingCustomPlugin, saveCustomPlugin, runCustomPlugin} =
  useQLogics(qlOptions, update)
useQuickLaunchPlugins(update, anyText)

watch(route, () => {
  update()
})
const handleInput = () => {
  if (isEnterSub.value) {
    // 进入子页面后不刷新查询
    return
  }
  update()
}
const cleanText = () => {
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
      rows="1"
      v-model="anyText"
      @input="handleInput"
      placeholder="/?"
      type="textarea"
      class="font-code vgo-input"
      @keyup.esc="cleanText"
    ></textarea>
    <QuickOptions
      ref="qRef"
      :auto-focus="true"
      :options="filteredOptions"
      visible
      is-static
      class="font-emoji"
      @onClose="textareaRef.focus()"
      @onEnter="isEnterSub = true"
      @onBack="isEnterSub = false"
    />
  </div>
  <Teleport to="body">
    <ViewPortWindow
      v-if="editingCustomPlugin"
      :visible="!!editingCustomPlugin"
      :init-win-options="{width: '500px', height: '500px'}"
      allow-maximum
      @onClose="editingCustomPlugin = null"
    >
      <template #titleBarLeft> Editing Plugin: {{ editingCustomPlugin?.name }} </template>
      <template #titleBarRightControls>
        <button @click="runCustomPlugin" title="Run Script">▶️</button>
        <button @click="saveCustomPlugin" title="Save">💾</button>
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
