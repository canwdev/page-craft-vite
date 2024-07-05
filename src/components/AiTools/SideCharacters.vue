<script lang="ts" setup>
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {useIDBKeyval} from '@vueuse/integrations/useIDBKeyval'
import {IAiCharacter} from '@/components/AiTools/types/ai'
import {ChatModel, chatModels} from '@/components/AiTools/types/openai'

import iconUser from '@/assets/textures/user.png?url'
import {useAiSettingsStore} from '@/store/ai-settings'
import {guid} from '@/utils'
import {useI18n} from 'vue-i18n'
import AutoFormNaive from '@/components/CommonUI/AutoFormNaive/index.vue'
import {computed, ref} from 'vue'
import {FormRules} from 'naive-ui'
import {AutoFormItemType, MixedFormItems} from '@/components/CommonUI/AutoFormNaive/enum'

const {t: $t} = useI18n()
const aisStore = useAiSettingsStore()
const {data: characterList, set: setCharacterList} = useIDBKeyval<IAiCharacter[]>(
  'page_craft_ai_characters',
  [
    {
      id: 'default',
      name: '默认助手',
      desc: '原始设定的助手',
      model: ChatModel.GPT35Turbo,
      systemPrompt: 'You are a helpful assistant.',
    },
  ]
)

const isCreate = ref(false)
const isShowEditDialog = ref(false)
const formatEditingData = (data: any = {}) => {
  return {
    id: data.id || guid(),
    name: data.name || '',
    desc: data.desc || '',
    model: data.model || ChatModel.GPT35Turbo,
    systemPrompt: data.systemPrompt || '',
  }
}
const editingItem = ref<IAiCharacter>(formatEditingData())

const optionList = computed((): StOptionItem[] => {
  return [
    {
      label: '角色列表',
      key: 'characters',
      children: characterList.value.map((item, index) => {
        return {
          key: item.id,
          label: `${item.name} [${item.model}]`,
          subtitle: `${item.desc}`,
          icon: iconUser,
          clickFn: () => {
            console.log(item)
            aisStore.currentCharacterId = item.id
          },
          cls: aisStore.currentCharacterId === item.id ? 'active' : '',
          actionRender: [
            h(
              'button',
              {
                class: 'vp-button',
                onClick: () => {
                  isCreate.value = false
                  editingItem.value = formatEditingData(item)
                  isShowEditDialog.value = true
                },
              },
              'Edit'
            ),
            h(
              'button',
              {
                class: 'vp-button',
                onClick: () => {
                  window.$dialog.warning({
                    title: $t('actions.confirm'),
                    content: $t('msgs.que_ren_shan_chu_ci'),
                    positiveText: $t('actions.ok'),
                    negativeText: $t('actions.cancel'),
                    onPositiveClick: () => {
                      characterList.value.splice(index, 1)
                    },
                    onNegativeClick: () => {},
                  })
                },
              },
              'Del'
            ),
          ],
        }
      }),
      actionRender: h(
        'button',
        {
          class: 'vp-button',
          onClick: () => {
            isCreate.value = true
            editingItem.value = formatEditingData()
            isShowEditDialog.value = true
          },
        },
        '+'
      ),
    },
  ]
})
const formRules = ref<FormRules>({
  id: {
    required: true,
    trigger: 'blur',
  },
  model: {
    required: true,
    trigger: 'blur',
  },
  name: {
    required: true,
    trigger: 'blur',
  },
  systemPrompt: {
    required: true,
    trigger: 'blur',
  },
})

const formItems = computed((): MixedFormItems[] => {
  return [
    [
      {
        type: AutoFormItemType.INPUT,
        key: 'id',
        label: 'ID (创建后不可修改)',
        disabled: !isCreate.value,
      },
      {
        type: AutoFormItemType.SELECT,
        options: chatModels,
        key: 'model',
        label: $t('ai.model'),
      },
    ],
    {
      type: AutoFormItemType.INPUT,
      key: 'name',
      label: '角色名称',
    },
    {
      type: AutoFormItemType.INPUT,
      key: 'desc',
      label: '角色简介',
    },
    {
      type: AutoFormItemType.INPUT,
      key: 'systemPrompt',
      label: 'System Prompt',
      props: {
        type: 'textarea',
      },
    },
  ]
})

const handleSubmit = () => {
  isShowEditDialog.value = false
  if (isCreate.value) {
    characterList.value.push(editingItem.value)
    return
  }
  const idx = characterList.value.findIndex((item) => item.id === editingItem.value.id)
  if (idx > -1) {
    characterList.value.splice(idx, 1, editingItem.value)
  }
}
</script>

<template>
  <div class="ai-side-characters">
    <OptionUI :option-list="optionList" />

    <n-modal
      v-model:show="isShowEditDialog"
      preset="dialog"
      :title="isCreate ? $t('actions.create') : $t('actions.edit')"
    >
      <AutoFormNaive
        :form-schema="{
          model: editingItem,
          rules: formRules,
          props: {
            labelPosition: 'top',
          },
          formItems,
        }"
        @onSubmit="handleSubmit"
      />
    </n-modal>
  </div>
</template>

<style lang="scss">
.ai-side-characters {
  height: 100%;
  .c-panel-item {
    .panel-header {
      z-index: 0;
    }
    .panel-body .sub-item {
      &.active {
        background-color: $primary_opacity;
      }
      .o-left .item-icon {
        border-radius: 50%;
        overflow: hidden;
      }
    }
  }
}
</style>
