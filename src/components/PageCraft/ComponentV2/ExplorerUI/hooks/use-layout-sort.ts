import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {sortMethodMap} from '../../utils/sort'
import {SortType} from '../../types/filesystem'

export const useLayoutSort = (files) => {
  const isGridView = ref(false)
  const sortMode = ref(SortType.default)
  const showSortMenu = ref(false)
  const sortOptions = computed((): QuickOptionItem[] => {
    return [
      {label: 'Default', value: SortType.default},
      {label: 'Name ▲', value: SortType.name},
      {label: 'Name ▼', value: SortType.nameDesc},
      {label: 'Size ▲', value: SortType.size},
      {label: 'Size ▼', value: SortType.sizeDesc},
      {label: 'Extension ▲', value: SortType.extension},
      {label: 'Extension ▼', value: SortType.extensionDesc},
      {label: 'Last Modified ▲', value: SortType.lastModified},
      {label: 'Last Modified ▼', value: SortType.lastModifiedDesc},
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
