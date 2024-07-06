<script lang="ts" setup>
import {StOptionItem} from '@/components/CommonUI/OptionUI/enum'
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {useAiSettingsStore} from '@/store/ai-settings'
import {useAiCharacters} from '@/components/AiTools/use-gpt'
import {formatDate, guid} from '@/utils'
import {renderNDropdownMenu} from '@/components/CommonUI/renders'
import {useI18n} from 'vue-i18n'
import {IChatHistoryItem} from '@/components/AiTools/types/ai'
import {useMounted} from '@vueuse/core'

const {t: $t} = useI18n()
const aisStore = useAiSettingsStore()

const {
  currentCharacter,
  allChatHistory,

  isCharacterListFinished,
  isAllChatHistory,
  currentHistoryGroup,
  currentHistory,
} = useAiCharacters()
const createChat = () => {
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
  console.log('创建历史记录', id, item, allChatHistory.value)
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
const autoInit = () => {
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
    return [{label: '请选择一个角色', key: 'pls'}]
  }
  const historyLabel = `与 ${currentCharacter.value.name} 的聊天`

  // 删除与当前角色的全部聊天记录
  const deleteCurrentAllHistory = () => {
    allChatHistory.value = allChatHistory.value
      .filter((i) => i.cid !== currentCharacter.value!.id)
      // 转换成原始对象，否则设值报错
      .map(toRaw)
  }
  return [
    {
      label: historyLabel,
      key: 'history',
      hideExpandIcon: true,
      actionRender: () =>
        renderNDropdownMenu([
          {
            label: `➕ ${$t('actions.create')}`,
            props: {
              onClick: () => {
                createChat()
              },
            },
          },
          {
            label: `📤 ${$t('actions.export')} JSON...`,
            props: {
              onClick: async () => {
                // 导出与当前角色的全部聊天记录
                const list = allChatHistory.value.filter(
                  (i) => i.cid === currentCharacter.value!.id
                )
                window.$mcUtils.handleExportFile(
                  await window.$mcUtils.promptGetFileName(historyLabel),
                  JSON.stringify(list, null, 2),
                  '.json'
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

                /**
                 * 自动覆盖相同id的数据，如果id不存在则添加
                 */
                const importData = (
                  existingData: IChatHistoryItem[],
                  newData: IChatHistoryItem[]
                ) => {
                  // Create a Map from existing data for quick lookup and update
                  const dataMap = new Map<string, IChatHistoryItem>(
                    existingData.map((item) => [item.id, item])
                  )

                  // Process new data items
                  newData.forEach((item) => {
                    // Update or add the data item in the Map
                    dataMap.set(item.id, item)
                  })

                  // Convert the Map back to an array
                  return Array.from(dataMap.values())
                }

                const oList = allChatHistory.value.filter(
                  (i) => i.cid === currentCharacter.value!.id
                )
                const mergedList = importData(oList, list)

                deleteCurrentAllHistory()
                allChatHistory.value = mergedList.map(toRaw)

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
                    // 删除与当前角色的全部聊天记录
                    deleteCurrentAllHistory()
                  },
                  onNegativeClick: () => {},
                })
              },
            },
          },
        ]),
      children: currentHistoryGroup.value.map((item, index) => {
        return {
          key: item.id,
          label: item.title || `New Chat with ${currentCharacter.value!.name}`,
          subtitle: formatDate(item.timestamp),
          cls: aisStore.currentChatHistoryId === item.id ? 'active' : '',
          clickFn: () => {
            aisStore.currentChatHistoryId = item.id
          },
          actionRender: () =>
            renderNDropdownMenu([
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
                    const idx = allChatHistory.value.findIndex((i) => i.id === item.id)
                    if (idx > -1) {
                      allChatHistory.value.splice(idx, 1)
                    }
                  },
                },
              },
            ]),
        }
      }),
    },
  ]
})
</script>

<template>
  <div class="ai-side-history">
    <OptionUI :option-list="optionList" />
  </div>
</template>

<style lang="scss">
.ai-side-history {
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
    }
  }
}
</style>
