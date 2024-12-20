import {QuickOptionItem} from '@/components/CanUI/packages/QuickOptions/enum'

import {Ref} from 'vue'
import {sortMethodMap, SortType} from '@/components/PageCraft/ComponentExplorer/utils/sort'
import {useStorage} from '@vueuse/core'
import {IComponentItem} from '@/components/PageCraft/ComponentExplorer/enum'
import {LS_SettingsKey} from '@/enum/settings'

export const useLayoutSort = (files: Ref<IComponentItem[]>) => {
  const isGridView = ref(false)
  const sortMode = useStorage(
    LS_SettingsKey.MC_EXPLORER_COMPONENT_SORT_TYPE,
    SortType.birthTimeDesc,
    localStorage,
    {
      listenToStorageChanges: false,
    },
  )
  const showSortMenu = ref(false)
  const sortOptions = computed((): QuickOptionItem[] => {
    return [
      {label: 'Name ▲', value: SortType.name},
      {label: 'Name ▼', value: SortType.nameDesc},
      {label: 'Created Time ▲', value: SortType.birthTime},
      {label: 'Created Time ▼', value: SortType.birthTimeDesc},
    ].map((i) => {
      return {
        label: i.label,
        props: {
          class: sortMode.value === i.value ? 'active' : '',
          onClick: () => {
            sortMode.value = i.value
          },
        },
      }
    })
  })
  const filteredFiles = computed(() => {
    return files.value.sort(sortMethodMap[sortMode.value])
  })

  return {
    isGridView,
    showSortMenu,
    sortOptions,
    filteredFiles,
  }
}
