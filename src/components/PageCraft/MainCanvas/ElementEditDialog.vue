<script lang="ts">
import {defineComponent, PropType, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {FormInst} from 'naive-ui'
import {CustomFormInputType, CustomFormItem, formatForm, getCustomFormItems} from './element-edit'

export default defineComponent({
  name: 'ElementEditDialog',
  props: {
    editingNode: {
      type: Object as PropType<HTMLElement | null>,
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onSave'],
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const isEditInnerHTML = ref(false)

    const formRef = ref<FormInst | null>(null)
    const formValueRef = ref(formatForm(null))
    const formRules = {
      // tagName: {
      //   required: true,
      //   message: 'Please input tagName',
      //   trigger: ['blur', 'input'],
      // },
    }

    // add element specific form items
    const customFormItems = ref<CustomFormItem[]>([])

    watch(mVisible, (val) => {
      if (val) {
        formValueRef.value = formatForm(props.editingNode)
        customFormItems.value = getCustomFormItems(props.editingNode)
      } else {
        formValueRef.value = formatForm(null)
        customFormItems.value = []
      }
    })

    return {
      mVisible,
      formRef,
      formValueRef,
      formRules,
      handleValidateClick(e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (errors) {
            return
          }
          emit('onSave', {
            el: props.editingNode,
            formValueRef,
          })
          mVisible.value = false
        })
      },
      handleCancel() {
        mVisible.value = false
      },
      customFormItems,
      CustomFormInputType,
      isEditInnerHTML,
    }
  },
})
</script>

<template>
  <n-modal
    v-model:show="mVisible"
    preset="dialog"
    :title="`Edit Element: ${formValueRef.tagName}`"
    label-placement="top"
  >
    <n-form ref="formRef" :label-width="80" :model="formValueRef" :rules="formRules" size="small">
      <n-form-item label="Class" path="className">
        <n-input
          v-model:value="formValueRef.className"
          placeholder="class"
          class="font-code"
          clearable
          @keyup.enter="handleValidateClick"
        />
      </n-form-item>
      <n-form-item v-if="isEditInnerHTML" label="innerHTML" path="innerHTML">
        <n-input
          v-model:value="formValueRef.innerHTML"
          placeholder="innerHTML"
          type="textarea"
          class="font-code"
          rows="8"
        />
      </n-form-item>
      <n-form-item v-else label="outerHTML" path="outerHTML">
        <n-input
          v-model:value="formValueRef.outerHTML"
          placeholder="outerHTML"
          type="textarea"
          class="font-code"
          rows="8"
        />
      </n-form-item>

      <n-form-item
        v-for="item in customFormItems"
        :key="item.key"
        :label="item.label"
        :path="`customForm.${item.key}`"
        class="font-code"
      >
        <n-select
          v-if="item.type === CustomFormInputType.SELECT"
          v-model:value="formValueRef.customProps[item.key]"
          :options="item.options"
          filterable
        />
        <n-switch
          v-else-if="item.type === CustomFormInputType.SWITCH"
          v-model:value="formValueRef.customProps[item.key]"
        />

        <n-input
          v-else
          v-model:value="formValueRef.customProps[item.key]"
          placeholder=""
          clearable
          @keyup.enter="handleValidateClick"
        />
      </n-form-item>

      <n-space justify="space-between">
        <n-space>
          <n-switch v-model:value="isEditInnerHTML" title="Toggle innerHTML/outerHTML" />
        </n-space>
        <n-space>
          <n-button attr-type="button" @click="handleCancel"> Cancel </n-button>
          <n-button type="primary" attr-type="button" @click="handleValidateClick"> OK </n-button>
        </n-space>
      </n-space>
    </n-form>
  </n-modal>
</template>

<style lang="scss" scoped></style>
