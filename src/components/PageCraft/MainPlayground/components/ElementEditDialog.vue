<script lang="ts">
import type { MixedFormItems } from '@canwdev/vgo-ui/src/components/AutoFormElPlus/enum'
import type { FormRules } from 'element-plus'
import type { PropType } from 'vue'
import AutoFormElPlus from '@canwdev/vgo-ui/src/components/AutoFormElPlus/AutoFormElPlus.vue'
import ViewPortWindow from '@canwdev/vgo-ui/src/components/ViewPortWindow/ViewPortWindow.vue'
import VueMonaco from '@canwdev/vgo-ui/src/components/VueMonaco/VueMonaco.vue'
import { useVModel } from '@vueuse/core'
import { computed, defineComponent, ref } from 'vue'
import { formatForm, getCustomFormItems } from '../utils/element-edit'

export default defineComponent({
  name: 'ElementEditDialog',
  components: {
    AutoFormElPlus,
    ViewPortWindow,
  },
  props: {
    editingNode: {
      type: Object as PropType<HTMLElement | null>,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onSave', 'update:visible'],
  setup(props, { emit }) {
    const { isRoot, editingNode } = toRefs(props)
    const mVisible = useVModel(props, 'visible', emit)
    const isEditInnerHTML = ref(true)

    const autoFormRef = ref()
    const dataForm = ref(formatForm(null))
    const formRules = ref<FormRules>({})

    // add element specific form items
    const customFormItems = ref<MixedFormItems[]>([])

    watch(mVisible, (val) => {
      if (val) {
        initEditingNode()
      }
      else {
        dataForm.value = formatForm(null)
        customFormItems.value = []
      }
    })

    watch(editingNode, (val) => {
      initEditingNode()
    })

    const initEditingNode = () => {
      dataForm.value = formatForm(editingNode.value)
      customFormItems.value = getCustomFormItems(editingNode.value)
      if (isRoot.value) {
        isEditInnerHTML.value = true
      }
    }

    const handleCancel = () => {
      mVisible.value = false
    }

    const handleSubmit = () => {
      emit('onSave', {
        el: editingNode.value,
        data: dataForm.value,
      })
      mVisible.value = false
    }

    const monacoRender = (_, modelValue, emit) => {
      return h(VueMonaco, {
        'showLineNumbers': true,
        'style': 'height: 400px; border-bottom: 1px solid rgba(91, 85, 85, 0.3)',
        modelValue,
        'onUpdate:modelValue': (val: string) => {
          emit('update:modelValue', val)
        },
      })
    }

    const formItems = computed((): MixedFormItems[] => {
      if (isRoot.value) {
        return [
          {
            key: 'innerHTML',
            label: 'innerHTML',
            render: monacoRender,
          },
        ]
      }
      if (isEditInnerHTML.value) {
        return [
          ...customFormItems.value,
          {
            label: 'innerHTML',
            key: 'innerHTML',
            render: monacoRender,
          },
        ]
      }
      return [
        {
          label: 'outerHTML',
          key: 'outerHTML',
          render: monacoRender,
        },
      ]
    })
    return {
      mVisible,
      dataForm,
      autoFormRef,
      formRules,
      formItems,
      handleSubmit,
      handleCancel,
      isEditInnerHTML,
    }
  },
})
</script>

<template>
  <ViewPortWindow
    v-model:visible="mVisible"
    allow-maximum
    wid="element_editor"
    :init-win-options="{
      width: '400px',
      height: '500px',
    }"
  >
    <template #titleBarLeft>
      {{ `${$t('actions.edit_element')} <${dataForm.tagName}>` }}
    </template>

    <template #titleBarRightControls>
      <button @click="autoFormRef.submitForm">
        {{ $t('actions.ok') }}
      </button>
    </template>
    <AutoFormElPlus
      ref="autoFormRef"
      :form-schema="{
        model: dataForm,
        rules: formRules,
        props: {
          labelPosition: 'top',
        },
        formItems,
      }"
      class="element-edit-form font-code"
      hide-actions
      @on-submit="handleSubmit"
    >
      <div class="action-row vgo-bg">
        <el-switch
          v-model="isEditInnerHTML"
          :title="`${$t('actions.toggle')} innerHTML/outerHTML`"
          :disabled="isRoot"
          active-text="innerHTML"
          inactive-text="outerHTML"
        />

        <div class="flex-row-center-gap">
          <button type="button" class="vgo-button" @click="handleCancel">
            {{ $t('actions.cancel') }}
          </button>
          <button type="submit" class="vgo-button primary">
            {{ $t('actions.ok') }}
          </button>
        </div>
      </div>
    </AutoFormElPlus>
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
.element-edit-form {
  height: 100%;
  overflow: auto;
  padding: 10px 10px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  :deep(.form-content-wrap) {
    flex: 1;
  }

  .action-row {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    margin-left: -10px;
    margin-right: -10px;
    box-sizing: border-box;
    z-index: 100;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }
}
</style>
