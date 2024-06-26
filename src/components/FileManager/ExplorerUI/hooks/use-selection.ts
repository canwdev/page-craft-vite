import {IEntry} from '../../types/filesystem'
import {useSelectionArea} from '@/hooks/use-selection-area'
import {generateTextFile, normalizePath, toggleArrayElement} from '../../utils'

export const useSelection = ({filteredFiles, basePath}) => {
  const selectedItems = ref<IEntry[]>([])
  const selectedItemsSet = computed(() => {
    return new Set(selectedItems.value)
  })
  watch(filteredFiles, () => {
    selectedItems.value = []
  })

  const explorerContentRef = ref()
  const {selectionArea} = useSelectionArea({
    containerRef: explorerContentRef,
    onStart: () => {
      selectedItems.value = []
    },
    onStop: (stored) => {
      const map = {}
      filteredFiles.value.forEach((i) => {
        map[i.name] = i
      })
      const list: IEntry[] = []
      stored.forEach((el) => {
        const name = el.getAttribute('data-name')
        if (!name) {
          return
        }
        if (map[name]) {
          list.push(map[name])
        }
      })

      selectedItems.value = list
    },
  })
  const toggleSelect = ({item, event, toggle = false}) => {
    if (event.ctrlKey || event.metaKey || toggle) {
      // 使用ctrl键多选
      selectedItems.value = toggleArrayElement([...selectedItems.value], item)
    } else if (event.shiftKey) {
      // 使用shift键选择范围
      let idx = 0
      const first = selectedItems.value[0]
      if (first) {
        idx = filteredFiles.value.findIndex((i) => i.name === first.name)
      }
      let itemIdx = filteredFiles.value.findIndex((i) => i.name === item.name)
      if (idx > itemIdx) {
        // 使最小的index在最前
        ;[itemIdx, idx] = [idx, itemIdx]
      }
      selectedItems.value = filteredFiles.value.slice(idx, itemIdx + 1)
    } else {
      selectedItems.value = [item]
    }
  }
  const toggleSelectAll = () => {
    const allFiles = filteredFiles.value
    if (selectedItems.value.length === allFiles.length) {
      selectedItems.value = []
    } else {
      selectedItems.value = [...allFiles]
    }
    // console.log(selectedItems.value)
  }

  const selectedPaths = computed(() => {
    return selectedItems.value.map((item) => {
      return normalizePath(basePath.value + '/' + item.name)
    })
  })

  return {
    selectedItems,
    selectedItemsSet,
    explorerContentRef,
    toggleSelect,
    toggleSelectAll,
    selectedPaths,
    selectionArea,
  }
}
