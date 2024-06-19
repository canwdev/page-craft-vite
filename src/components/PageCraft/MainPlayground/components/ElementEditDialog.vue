<script lang="ts">
import {computed, defineComponent, PropType, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {FormInst, FormRules} from 'naive-ui'
import {formatForm, getCustomFormItems} from '../utils/element-edit'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {AutoFormItemType, MixedFormItems} from '@/components/CommonUI/AutoFormNaive/enum'
import AutoFormNaive from '@/components/CommonUI/AutoFormNaive/index.vue'

export default defineComponent({
  name: 'ElementEditDialog',
  components: {
    AutoFormNaive,
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
  setup(props, {emit}) {
    const {isRoot, editingNode} = toRefs(props)
    const mVisible = useModelWrapper(props, emit, 'visible')
    const isEditInnerHTML = ref(true)

    const autoFormRef = ref()
    const dataForm = ref(formatForm(null))
    const formRules = ref<FormRules>({})

    // add element specific form items
    const customFormItems = ref<MixedFormItems[]>([])

    watch(mVisible, (val) => {
      if (val) {
        initEditingNode()
      } else {
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

    const handleResize = () => {
      // 手动触发resize事件，让monaco编辑器自动调整
      window.dispatchEvent(new Event('resize'))
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

    const formItems = computed((): MixedFormItems[] => {
      if (isEditInnerHTML.value) {
        return [
          ...customFormItems.value,
          {
            type: AutoFormItemType.MONACO_EDITOR,
            key: 'innerHTML',
            label: 'innerHTML',
          },
        ]
      }
      return [
        {
          type: AutoFormItemType.MONACO_EDITOR,
          key: 'outerHTML',
          label: 'outerHTML',
        },
      ]
    })
    return {
      mVisible,
      dataForm,
      autoFormRef,
      formRules,
      formItems,
      handleResize,
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
    @resize="handleResize"
  >
    <template #titleBarLeft>
      {{ `${$t('actions.edit_element')} <${dataForm.tagName}>` }}
    </template>

    <template #titleBarRightControls>
      <button @click="autoFormRef.submitForm">
        {{ $t('actions.ok') }}
      </button>
    </template>
    <AutoFormNaive
      ref="autoFormRef"
      :form-schema="{
        model: dataForm,
        rules: formRules,
        props: {
          labelPosition: 'top',
        },
        formItems,
      }"
      @onSubmit="handleSubmit"
      class="element-edit-form font-code"
    >
      <div class="action-row vp-bg">
        <n-switch
          v-model:value="isEditInnerHTML"
          :title="`${$t('actions.toggle')} innerHTML/outerHTML`"
          :disabled="isRoot"
        >
          <template #checked> innerHTML </template>
          <template #unchecked> outerHTML </template>
        </n-switch>

        <n-space size="small">
          <button class="vp-button" @click="handleCancel">{{ $t('actions.cancel') }}</button>
          <button class="vp-button primary" @click="autoFormRef.submitForm">
            {{ $t('actions.ok') }}
          </button>
        </n-space>
      </div>
    </AutoFormNaive>
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
.element-edit-form {
  height: 100%;
  overflow: auto;
  padding: 10px 10px 0;
  box-sizing: border-box;

  .vp-button {
    &.primary {
      background: $primary;
      color: white;
    }
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
  }
}
</style>
