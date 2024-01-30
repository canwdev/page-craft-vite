import {DirTreeItem} from '@/enum/vue-i18n-tool'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useI18n} from 'vue-i18n'

export const useBatchWrapper = (props) => {
  const {dirTree, isFoldersMode, filePathArr} = toRefs(props)
  const itemsRef = ref()

  const handleSaveChanged = async () => {
    // save other texts in the same level if not save
    // console.log('[handleSaveChanged]', itemsRef.value)

    // 逐个更新文件，而不是在组件内更新，以减少磁盘读写
    for (let i = 0; i < itemsRef.value.length; i++) {
      const item = itemsRef.value[i]
      await item.saveChange({isSetValue: true})
    }
  }
  onMounted(() => {
    globalEventBus.on(GlobalEvents.ON_I18N_SAVE_ALL_CHANGES, handleSaveChanged)
  })
  onBeforeUnmount(() => {
    globalEventBus.off(GlobalEvents.ON_I18N_SAVE_ALL_CHANGES, handleSaveChanged)
  })

  const filePathArrFiltered = computed(() => {
    if (isFoldersMode.value) {
      return dirTree.value.filter((i) => i.kind === 'directory')
    }
    return dirTree.value
  })

  const subFilePathArr = computed(() => {
    if (isFoldersMode.value) {
      return filePathArr.value.slice(1)
    }
    return filePathArr.value
  })

  return {
    handleSaveChanged,
    itemsRef,
    filePathArrFiltered,
    subFilePathArr,
  }
}

export const useBatchItem = (props) => {
  const {t: $t} = useI18n()
  const isLoading = ref(false)
  const {dirItem, filePathArr, translatePath, isFoldersMode} = toRefs(props)
  const findNode = (): DirTreeItem | null => {
    let find: DirTreeItem | null = null
    const recursiveFindItem = (children: DirTreeItem[] | null, dirArr: string[], depth = 0) => {
      const dirName = dirArr[depth]
      if (!children) {
        return
      }
      // console.log('---', depth, dirName)

      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child.label === dirName) {
          if (depth === dirArr.length - 1) {
            find = child
            throw new Error('item found')
          }
        }
        if (child.children) {
          recursiveFindItem(child.children, dirArr, depth + 1)
        }
      }
    }
    try {
      recursiveFindItem(dirItem.value.children, filePathArr.value)
    } catch (e) {
      // console.warn(e)
    }
    return find
  }

  const currentItem = computed(() => {
    if (!isFoldersMode.value) {
      // 单文件读取
      return dirItem.value
    }
    return findNode()
  })
  const handleSaveFile = async (txt: string) => {
    try {
      isLoading.value = true
      if (!currentItem.value) {
        return
      }
      const fileHandle = currentItem.value.entry as FileSystemFileHandle
      if (!fileHandle) {
        return
      }
      // @ts-ignore
      const writable = await fileHandle.createWritable()

      // console.log('[translateObj.value]', translateObj.value)

      await writable.write(txt)
      await writable.close()
      const savedPath = dirItem.value.label + ': ' + fileHandle.name
      console.log('[handleSaveFile]', savedPath)
      window.$message.success(`${savedPath} ` + $t('msgs.saved'))
    } catch (error: any) {
      console.error(error)
      window.$message.error($t('msgs.error') + error.message)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    currentItem,
    handleSaveFile,
  }
}
