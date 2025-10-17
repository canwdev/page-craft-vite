<script lang="ts" setup>
import type { StOptionItem } from '@canwdev/vgo-ui/src/components/OptionUI/enum'
import OptionUI from '@canwdev/vgo-ui/src/components/OptionUI/OptionUI.vue'
import { renderDropdownMenu } from '@canwdev/vgo-ui/src/components/OptionUI/utils/renders'
import { useI18n } from 'vue-i18n'
import { useAiSettingsStore } from '@/components/AI/hooks/ai-settings'
import { mergeIdData, useAiCharacters } from '@/components/AI/hooks/use-ai-characters'
import { formatDate, guid } from '@/utils'

const { t: $t } = useI18n()
const aisStore = useAiSettingsStore()

const {
  currentCharacter,
  allChatHistory,

  isCharacterListFinished,
  isAllChatHistory,
  currentHistoryGroup,
  currentHistory,
} = useAiCharacters()
function createChat() {
  if (!currentCharacter.value) {
    return
  }
  console.log('[isCharacterListFinished]', isCharacterListFinished.value)
  console.log('[isAllChatHistory]', isAllChatHistory.value)
  const id = guid()
  const item = {
    id,
    cid: currentCharacter.value.id,
    title: ``,
    timestamp: Date.now(),
    history: [],
  }
  allChatHistory.value.push(item)
  aisStore.currentChatHistoryId = id
  // console.log('创建历史记录', id, item, allChatHistory.value)
}
watch(currentCharacter, (val) => {
  // 必须等待初始完成再执行
  if (!isCharacterListFinished.value || !isAllChatHistory.value) {
    return
  }
  autoInit()
})
watch(isAllChatHistory, (val) => {
  // 必须等待初始完成再执行
  if (!val) {
    return
  }
  autoInit()
})
function autoInit() {
  // 等待另一个计算属性求值
  setTimeout(() => {
    // 如果没有历史记录，则创建
    if (currentCharacter.value && !currentHistoryGroup.value.length) {
      createChat()
    }
    if (!currentHistory.value && currentHistoryGroup.value.length) {
      aisStore.currentChatHistoryId = currentHistoryGroup.value[0].id
    }
  })
}

const optionList = computed((): StOptionItem[] => {
  if (!currentCharacter.value) {
    return []
  }
  const historyLabel = $t('ai.yu_current_character', [currentCharacter.value.name])

  // 删除与当前角色的全部聊天记录
  const deleteCurrentAllHistory = () => {
    allChatHistory.value = allChatHistory.value
      .filter(i => i.cid !== currentCharacter.value!.id)
      // 转换成原始对象，否则设值报错
      .map(toRaw)
  }
  return [
    {
      label: historyLabel,
      key: 'history',
      hideExpandIcon: true,
      actionRender: () =>
        renderDropdownMenu([
          {
            label: `📤 ${$t('actions.export')} JSON...`,
            props: {
              onClick: async () => {
                // 导出与当前角色的全部聊天记录
                const list = allChatHistory.value.filter(
                  i => i.cid === currentCharacter.value!.id,
                )
                window.$mcUtils.handleExportFile(
                  await window.$mcUtils.promptGetFileName(historyLabel),
                  JSON.stringify(list, null, 2),
                  '.json',
                )
              },
            },
          },
          {
            label: `📥 ${$t('actions.import')} JSON...`,
            props: {
              onClick: async () => {
                // 导入与当前角色的全部聊天记录，并覆盖掉本地相同id的记录
                const list = await window.$mcUtils.handleImportJson()
                allChatHistory.value = list || []

                const oList = allChatHistory.value.filter(
                  i => i.cid === currentCharacter.value!.id,
                )
                const mergedList = mergeIdData(oList, list)

                deleteCurrentAllHistory()
                allChatHistory.value = mergedList

                window.$message.success('Import success!')
              },
            },
          },
          {
            label: `🗑️ ${$t('actions.delete_all')}`,
            props: {
              onClick: () => {
                window.$dialog
                  .confirm($t('msgs.que_ren_shan_chu_ci'), $t('actions.delete_all'), {
                    type: 'warning',
                  })
                  .then(() => {
                    // 删除与当前角色的全部聊天记录
                    deleteCurrentAllHistory()
                  })
                  .catch()
              },
            },
          },
        ]),
      children: [
        {
          label: `${$t('ai.new_chat')}`,
          iconClass: 'mdi mdi-plus',
          clickFn: () => {
            createChat()
          },
        },
        ...currentHistoryGroup.value.map((item, index) => {
          return {
            key: item.id,
            label: item.title || historyLabel,
            subtitle: formatDate(item.timestamp),
            cls: aisStore.currentChatHistoryId === item.id ? 'active' : '',
            clickFn: () => {
              aisStore.currentChatHistoryId = item.id
            },
            actionRender: () =>
              renderDropdownMenu([
                {
                  label: `✍️ ${$t('actions.rename')}`,
                  props: {
                    onClick: async () => {
                      const title = await window.$mcUtils.showInputPrompt({
                        title: `${$t('actions.rename')}: ${item.title}`,
                        value: item.title,
                      })
                      item.title = title
                    },
                  },
                },
                {
                  label: `🗑️ ${$t('actions.delete')}`,
                  props: {
                    onClick: () => {
                      const idx = allChatHistory.value.findIndex(i => i.id === item.id)
                      if (idx > -1) {
                        allChatHistory.value.splice(idx, 1)
                      }
                    },
                  },
                },
              ]),
          }
        }),
      ],
    },
  ]
})
</script>

<template>
  <div class="ai-side-history">
    <OptionUI class="ai-option-ui" :option-list="optionList" />
  </div>
</template>

<style lang="scss">
.ai-side-history {
  height: 100%;
  overflow: auto;
}
</style>
