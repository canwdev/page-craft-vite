<script lang="ts">
import {computed, defineComponent, PropType, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {FormInst, FormRules} from 'naive-ui'
import {formatForm, getCustomFormItems} from '../utils/element-edit'
import VueMonaco from '@/components/CommonUI/VueMonaco/index.vue'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {AutoFormItemType, MixedFormItems} from '@/components/CommonUI/AutoFormNaive/enum'
import AutoFormNaive from '@/components/CommonUI/AutoFormNaive/index.vue'

export default defineComponent({
  name: 'ElementEditDialog',
  components: {
    AutoFormNaive,
    ViewPortWindow,
    VueMonaco,
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
      if (!val) {
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

    const vueMonacoRef = ref()

    const handleCancel = () => {
      mVisible.value = false
    }

    const handleSubmit = () => {
      emit('onSave', {
        el: editingNode.value,
        dataForm,
      })
    }

    const formItems = computed((): MixedFormItems[] => {
      const commonItems = isRoot.value
        ? []
        : [
            {
              type: AutoFormItemType.INPUT,
              key: 'className',
              label: 'class',
              placeholder: 'class name',
            },
          ]

      return [
        ...commonItems,
        ...customFormItems.value,
        isEditInnerHTML.value
          ? {
              type: AutoFormItemType.INPUT,
              key: 'innerHTML',
              label: 'innerHTML',
              props: {type: 'textarea'},
            }
          : {
              type: AutoFormItemType.INPUT,
              key: 'outerHTML',
              label: 'outerHTML',
              props: {type: 'textarea'},
            },
      ].filter(Boolean)
    })
    return {
      mVisible,
      dataForm,
      autoFormRef,
      formRules,
      formItems,
      vueMonacoRef,
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
    @resize="vueMonacoRef?.resize()"
  >
    <template #titleBarLeft>
      {{ `${$t('actions.edit_element')}: ${dataForm.tagName}` }}
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
      class="element-edit-form"
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
    <!--<n-form
      v-if="mVisible"
      ref="formRef"
      :model="dataForm"
      :rules="formRules"
      size="small"
      class="element-edit-form"
    >
      <n-form-item label="class" path="className">
        <input
          :disabled="isRoot"
          v-model="dataForm.className"
          placeholder="class"
          class="vp-input font-code"
          @keyup.enter="handleValidateClick"
        />
      </n-form-item>

      <n-form-item
        v-for="item in customFormItems"
        :key="item.key"
        :label="item.label"
        :path="`customForm.${item.key}`"
        class="font-code"
      >
        <select
          v-if="item.type === CustomFormInputType.SELECT"
          v-model="dataForm.customProps[item.key]"
          class="vp-input"
        >
          <option class="vp-bg" v-for="opt in item.options" :key="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <n-switch
          v-else-if="item.type === CustomFormInputType.SWITCH"
          v-model:value="dataForm.customProps[item.key]"
        />

        <AdvancedInput v-else v-model="dataForm.customProps[item.key]" />
      </n-form-item>

      <n-switch
        v-model:value="isEditInnerHTML"
        :title="`${$t('actions.toggle')} innerHTML/outerHTML`"
        :disabled="isRoot"
      >
        <template #checked> innerHTML </template>
        <template #unchecked> outerHTML </template>
      </n-switch>
      <n-form-item v-if="isEditInnerHTML" path="innerHTML">
        <VueMonaco ref="vueMonacoRef" show-line-numbers v-model="dataForm.innerHTML" />
      </n-form-item>
      <n-form-item v-else path="outerHTML">
        <VueMonaco ref="vueMonacoRef" show-line-numbers v-model="dataForm.outerHTML" />
      </n-form-item>

    </n-form>-->
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
  }
}
</style>
