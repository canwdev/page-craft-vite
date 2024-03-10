<script lang="ts">
import {defineComponent, PropType, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {FormInst} from 'naive-ui'
import {CustomFormInputType, CustomFormItem, formatForm, getCustomFormItems} from './element-edit'
import VueMonaco from '@/components/CommonUI/VueMonaco/index.vue'

export default defineComponent({
  name: 'ElementEditDialog',
  components: {VueMonaco},
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
  emits: ['onSave', 'update:visible'],
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const isEditInnerHTML = ref(true)

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
    :title="`${$t('actions.edit_element')}: ${formValueRef.tagName}`"
    label-placement="top"
    style="width: 600px"
  >
    <n-form ref="formRef" :label-width="80" :model="formValueRef" :rules="formRules" size="small">
      <n-form-item label="class" path="className">
        <n-input
          v-model:value="formValueRef.className"
          placeholder="class"
          class="font-code"
          clearable
          @keyup.enter="handleValidateClick"
        />
      </n-form-item>
      <n-form-item v-if="isEditInnerHTML" label="innerHTML" path="innerHTML">
        <VueMonaco v-model="formValueRef.innerHTML" />
      </n-form-item>
      <n-form-item v-else label="outerHTML" path="outerHTML">
        <VueMonaco v-model="formValueRef.outerHTML" />
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
          <n-switch
            v-model:value="isEditInnerHTML"
            :title="`${$t('actions.toggle')} innerHTML/outerHTML`"
          >
            <template #checked> innerHTML </template>
            <template #unchecked> outerHTML </template>
          </n-switch>
        </n-space>
        <n-space>
          <n-button attr-type="button" @click="handleCancel"> {{ $t('actions.cancel') }} </n-button>
          <n-button type="primary" attr-type="button" @click="handleValidateClick">
            {{ $t('actions.ok') }}
          </n-button>
        </n-space>
      </n-space>
    </n-form>
  </n-modal>
</template>
