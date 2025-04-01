<script lang="ts" setup>
import {StOptionItem} from '@/components/VgoUI/packages/OptionUI/enum'
import OptionUI from '@/components/VgoUI/packages/OptionUI/index.vue'
import {IAiCharacter} from '@/components/AI/types/ai'
import {
  openAIChatModelOptions,
  AIProvider,
  chatProviderOptions,
  getModelOptions,
  defaultOpenAIModel,
} from '@/components/AI/types/models'

import iconUser from '@/assets/textures/user.png?url'
import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'
import {useI18n} from 'vue-i18n'
import {computed, ref} from 'vue'

import {mergeIdData, useAiCharacters} from '@/components/AI/hooks/use-ai-characters'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {base64Utils} from '@/utils/base64-utils'
import {generateItemDragProps} from '@/components/VgoUI/packages/OptionUI/Tools/item-drag'
import {AutoFormItemType, MixedFormItems} from '@/components/VgoUI/packages/AutoFormElPlus/enum'
import {renderDropdownMenu} from '@/components/VgoUI/packages/OptionUI/Tools/renders'
import AutoFormElPlus from '@/components/VgoUI/packages/AutoFormElPlus/index.vue'

const {t: $t} = useI18n()
const aisStore = useAiSettingsStore()
const {characterList, allChatHistory, updatePresetCharacters, isCharacterListFinished} =
  useAiCharacters()

const isCreate = ref(false)
const isShowEditDialog = ref(false)
const formatEditingData = (data: any = {}) => {
  return {
    id: data.id || '',
    name: data.name || '',
    desc: data.desc || '',
    avatar: data.avatar || '',
    provider: data.provider || AIProvider.OPEN_AI,
    model: data.model || defaultOpenAIModel,
    systemPrompt: data.systemPrompt || '',
  }
}
const editingItem = ref<IAiCharacter>(formatEditingData())

const switchPosition = (oldIndex: number, newIndex: number) => {
  const arr = [...characterList.value]

  // Validate indices
  if (
    oldIndex < 0 ||
    oldIndex >= arr.length ||
    newIndex < 0 ||
    newIndex >= arr.length ||
    oldIndex === newIndex
  ) {
    return
  }

  // Remove the item from the old position
  const [movedItem] = arr.splice(oldIndex, 1)

  // Adjust newIndex if it is greater than the oldIndex after removal
  const adjustedNewIndex = oldIndex < newIndex ? newIndex - 1 : newIndex

  // Insert the item at the new position
  arr.splice(adjustedNewIndex, 0, movedItem)

  // Update the characterList
  characterList.value = arr.map(toRaw)
}

const optionList = computed((): StOptionItem[] => {
  return [
    {
      label: $t('ai.characters'),
      key: 'characters',
      hideExpandIcon: true,
      actionRender: () =>
        renderDropdownMenu([
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
                  '.json',
                )
              },
            },
          },
          {
            label: `📥 ${$t('actions.import')} JSON...`,
            props: {
              onClick: async () => {
                const list = await window.$mcUtils.handleImportJson()
                characterList.value = mergeIdData(characterList.value, list || [])
                window.$message.success('Import success!')
              },
            },
          },
          {
            label: `🗑️ ${$t('actions.delete_all')}`,
            props: {
              onClick: () => {
                window.$dialog
                  .confirm(
                    $t('msgs.que_ren_shan_chu_ci') + ' !!All chat records will be deleted!!',
                    $t('actions.delete_all'),
                    {
                      type: 'warning',
                    },
                  )
                  .then(() => {
                    characterList.value = []
                    allChatHistory.value = []
                  })
                  .catch()
              },
            },
          },
          {
            label: $t('ai.geng_xin_yu_she_jue'),
            iconClass: 'mdi mdi-shape-plus-outline',
            props: {
              onClick: () => {
                updatePresetCharacters()
              },
            },
          },
        ]),
      children: characterList.value.map((item, index) => {
        return {
          key: item.id,
          label: `${item.name}`,
          subtitle: `${item.desc} [${item.model}]`,
          icon: item.avatar,
          iconClass: 'mdi mdi-account-circle-outline',
          cls: aisStore.currentCharacterId === item.id ? 'active' : '',
          clickFn: () => {
            aisStore.currentCharacterId = item.id
          },
          itemProps: generateItemDragProps({index, cb: switchPosition}),
          actionRender: () =>
            renderDropdownMenu([
              {
                label: `✏️ ${$t('actions.edit')}`,
                props: {
                  onClick: () => {
                    isCreate.value = false
                    editingItem.value = formatEditingData(item)
                    isShowEditDialog.value = true
                  },
                },
              },
              {
                label: `📄 ${$t('actions.duplicate')}...`,
                props: {
                  onClick: async () => {
                    isCreate.value = true
                    editingItem.value = formatEditingData(item)
                    isShowEditDialog.value = true
                  },
                },
              },
              {
                label: `🗑️ ${$t('actions.delete')}`,
                props: {
                  onClick: () => {
                    window.$dialog
                      .confirm(
                        $t('msgs.que_ren_shan_chu_ci') + ' !!Chat records will be deleted!!',
                        $t('actions.confirm'),
                        {
                          type: 'warning',
                        },
                      )
                      .then(() => {
                        // 删除与当前角色的全部聊天记录
                        allChatHistory.value = allChatHistory.value
                          .filter((i) => i.cid !== item.id)
                          // 转换成原始对象，否则设值报错
                          .map(toRaw)

                        characterList.value.splice(index, 1)
                      })
                      .catch()
                  },
                },
              },
            ]),
        }
      }),
    },
  ]
})

watch(isCharacterListFinished, (val) => {
  if (val) {
    if (!characterList.value.length) {
      updatePresetCharacters()
    }
    setTimeout(() => {
      document.querySelectorAll('.ai-option-ui .sub-item.active').forEach((el) => {
        el.scrollIntoView({behavior: 'smooth', block: 'center'})
      })
    }, 600)
  }
})

const formRules = ref({
  id: {
    required: true,
    trigger: 'blur',
    validator: (rule, value: string) => {
      if (!value) {
        return new Error('id is required')
      }
      if (isCreate.value) {
        const idx = characterList.value.findIndex((i) => i.id === value)
        if (idx > -1) {
          return new Error('id can not be same')
        }
      }
      return true
    },
  },
  provider: {
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
})

const formItems = computed((): MixedFormItems[] => {
  const modelOptions = getModelOptions(editingItem.value.provider)
  const isThirdParty = editingItem.value.provider === AIProvider.OPEN_AI_COMPATIBLE
  return [
    [
      {
        type: AutoFormItemType.INPUT,
        key: 'name',
        label: $t('ai.name'),
        props: {
          onChange: () => {
            if (isCreate.value) {
              const name = editingItem.value.name.trim()
              editingItem.value.name = name
              // 自动生成id
              if (!editingItem.value.id && name) {
                editingItem.value.id = window.$mcUtils.formatI18nKey(name)
              }
            }
          },
        },
      },
      {
        type: AutoFormItemType.INPUT,
        key: 'avatar',
        label: `${$t('ai.avatar')} URL`,
        props: {
          clearable: true,
        },
        render: () =>
          h('button', {
            type: 'button',
            class: 'btn-no-style mdi mdi-image-plus',
            onClick: async () => {
              const url = await base64Utils.chooseFileToBase64({accept: 'image/*'})
              if (typeof url === 'string') {
                editingItem.value.avatar = url
              }
            },
          }),
      },
    ],
    [
      {
        type: AutoFormItemType.INPUT,
        key: 'id',
        label: `ID (${$t('ai.chuang_jian_hou_bu_k')})`,
        disabled: !isCreate.value,
      },
      {
        type: AutoFormItemType.INPUT,
        key: 'desc',
        label: $t('common.bei_zhu'),
        placeholder: '',
      },
    ],
    [
      {
        type: AutoFormItemType.SELECT,
        options: chatProviderOptions,
        key: 'provider',
        label: $t('ai.ti_gong_shang'),
        props: {
          filterable: true,
          onChange() {
            editingItem.value.model = getModelOptions(editingItem.value.provider)[0].value
          },
        },
      },
      {
        type: AutoFormItemType.SELECT,
        options: modelOptions,
        key: 'model',
        label: $t('ai.model') + ` ${editingItem.value.model}`,
        props: {
          // 允许动态创建项
          allowCreate: true,
          filterable: true,
        },
        render: isThirdParty
          ? () =>
              h('button', {
                type: 'button',
                class: 'btn-no-style mdi mdi-help-circle-outline',
                onClick: () => {
                  window.open('https://aihubmix.com/models', '_blank', 'noopener,noreferrer')
                },
              })
          : null,
      },
    ],
    {
      type: AutoFormItemType.INPUT,
      key: 'systemPrompt',
      label: $t('ai.system_prompt'),
      props: {
        type: 'textarea',
        rows: 8,
      },
    },
  ]
})

const handleSubmit = () => {
  isShowEditDialog.value = false
  // 添加或更新角色
  if (isCreate.value) {
    characterList.value.push(editingItem.value)
    return
  }
  const idx = characterList.value.findIndex((item) => item.id === editingItem.value.id)
  if (idx > -1) {
    characterList.value.splice(idx, 1, editingItem.value)
  }
  globalEventBus.emit(GlobalEvents.ON_AI_CHARACTER_UPDATE)
}
</script>

<template>
  <div class="ai-side-characters">
    <OptionUI class="ai-option-ui" :option-list="optionList" />

    <el-dialog
      draggable
      top="10vh"
      width="700"
      v-model="isShowEditDialog"
      :title="isCreate ? $t('actions.create') : $t('actions.edit')"
    >
      <AutoFormElPlus
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
    </el-dialog>
  </div>
</template>

<style lang="scss">
.ai-side-characters {
  height: 100%;
  overflow: auto;

  .el-form-item__content {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: nowrap;
  }
}
</style>
