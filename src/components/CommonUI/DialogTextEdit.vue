<script lang="ts">
import VueMonaco from '@canwdev/vgo-ui/src/components/VueMonaco/VueMonaco.vue'
import { defineComponent, ref } from 'vue'
import { useModelWrapper } from '@/hooks/use-model-wrapper'

export default defineComponent({
  name: 'DialogTextEdit',
  components: { VueMonaco },
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
    // 默认文本
    text: {
      type: String,
      default: '',
    },
    isTextarea: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    // 输入框为input的type
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['onSave', 'update:modelValue', 'update:visible'],
  setup(props, { emit }) {
    const { text } = toRefs(props)
    const mVisible = useModelWrapper(props, emit, 'visible')

    const inputRef = ref()
    const editingText = ref('')
    watch(
      text,
      (val) => {
        editingText.value = val
      },
      { immediate: true },
    )

    watch(mVisible, (val) => {
      if (val) {
        setTimeout(() => {
          inputRef.value?.focus()
        })
      }
    })

    return {
      inputRef,
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
  <el-dialog
    v-model="mVisible"
    draggable
    width="700"
    top="10vh"
    :title="title"
    :close-on-click-modal="false"
    @positive-click="handleSave"
  >
    <template v-if="mVisible">
      <VueMonaco
        v-if="isTextarea"
        ref="inputRef"
        v-model="editingText"
        language="json"
        style="height: 500px"
      />
      <el-input
        v-else
        ref="inputRef"
        v-model="editingText"
        :type="type"
        class="font-code"
        :rows="isTextarea ? 25 : null"
        :placeholder="placeholder"
        autofocus
        :clearable="clearable"
      />
    </template>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="mVisible = false">
          {{ $t('actions.cancel') }}
        </el-button>
        <el-button type="primary" @click="handleSave()">
          {{ $t('actions.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
