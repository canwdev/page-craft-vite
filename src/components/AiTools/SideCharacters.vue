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
import {AutoFormItemType, MixedFormItems} from '@/components/CommonUI/AutoFormNaive/enum'
import {FormRules, NDropdown} from 'naive-ui'
import {renderNDropdownMenu} from '@/components/CommonUI/renders'
import {useAiCharacters} from '@/components/AiTools/use-gpt'

const {t: $t} = useI18n()
const aisStore = useAiSettingsStore()
const {characterList, allChatHistory} = useAiCharacters()

const isCreate = ref(false)
const isShowEditDialog = ref(false)
const formatEditingData = (data: any = {}) => {
  return {
    id: data.id || guid(),
    name: data.name || '',
    desc: data.desc || '',
    avatar: data.avatar || '',
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
      hideExpandIcon: true,
      actionRender: () =>
        renderNDropdownMenu([
          {
            label: `➕ ${$t('actions.create')}`,
            props: {
              onClick: () => {
                isCreate.value = true
                editingItem.value = formatEditingData()
                isShowEditDialog.value = true
              },
            },
          },
          {
            label: `📤 ${$t('actions.export')} JSON...`,
            props: {
              onClick: async () => {
                window.$mcUtils.handleExportFile(
                  await window.$mcUtils.promptGetFileName('AICharacters'),
                  JSON.stringify(characterList.value, null, 2),
                  '.json'
                )
              },
            },
          },
          {
            label: `📥 ${$t('actions.import')} JSON...`,
            props: {
              onClick: async () => {
                const list = await window.$mcUtils.handleImportJson()
                characterList.value = list || []
                window.$message.success('Import success!')
              },
            },
          },
          {
            label: `🗑️ ${$t('actions.delete_all')}`,
            props: {
              onClick: () => {
                window.$dialog.warning({
                  title: $t('actions.delete_all'),
                  content: $t('msgs.que_ren_shan_chu_ci'),
                  positiveText: $t('actions.ok'),
                  negativeText: $t('actions.cancel'),
                  onPositiveClick: () => {
                    characterList.value = []
                    allChatHistory.value = []
                  },
                  onNegativeClick: () => {},
                })
              },
            },
          },
        ]),
      children: characterList.value.map((item, index) => {
        return {
          key: item.id,
          label: `${item.name} [${item.model}]`,
          subtitle: `${item.desc}`,
          icon: item.avatar || iconUser,
          cls: aisStore.currentCharacterId === item.id ? 'active' : '',
          clickFn: () => {
            aisStore.currentCharacterId = item.id
          },
          actionRender: () =>
            renderNDropdownMenu([
              {
                label: `✏️ ${$t('actions.edit_element')}`,
                props: {
                  onClick: () => {
                    isCreate.value = false
                    editingItem.value = formatEditingData(item)
                    isShowEditDialog.value = true
                  },
                },
              },
              {
                label: `🗑️ ${$t('actions.delete')}`,
                props: {
                  onClick: () => {
                    window.$dialog.warning({
                      title: $t('actions.confirm'),
                      content: $t('msgs.que_ren_shan_chu_ci'),
                      positiveText: $t('actions.ok'),
                      negativeText: $t('actions.cancel'),
                      onPositiveClick: () => {
                        // 删除与当前角色的全部聊天记录
                        allChatHistory.value = allChatHistory.value
                          .filter((i) => i.cid !== item.id)
                          // 转换成原始对象，否则设值报错
                          .map(toRaw)

                        characterList.value.splice(index, 1)
                      },
                      onNegativeClick: () => {},
                    })
                  },
                },
              },
            ]),
        }
      }),
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
    [
      {
        type: AutoFormItemType.INPUT,
        key: 'avatar',
        label: '头像 URL',
      },
      {
        type: AutoFormItemType.INPUT,
        key: 'name',
        label: '角色名称',
      },
    ],
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
  overflow: auto;
  .c-panel-item {
    .panel-header {
      z-index: 0;
    }
    .panel-body .sub-item {
      padding: 4px 8px;
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
