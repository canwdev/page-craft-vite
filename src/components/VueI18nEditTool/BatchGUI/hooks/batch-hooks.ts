import {DirTreeItem} from '@/enum/vue-i18n-tool'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useI18n} from 'vue-i18n'
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import {BatchListItem, useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import {handleReadSelectedFile} from '@/utils/exporter'

const useCommon = () => {
  const i18nMainStore = useI18nMainStore()
  const i18nSetStore = useI18nToolSettingsStore()

  const subFilePathArr = computed(() => {
    if (i18nSetStore.isFoldersMode) {
      return i18nMainStore.filePathArr.slice(1)
    }
    return i18nMainStore.filePathArr
  })

  return {
    i18nMainStore,
    i18nSetStore,
    subFilePathArr,
  }
}

/**
 * 批处理管理器hook
 */
export const useBatchWrapper = () => {
  const {i18nMainStore, i18nSetStore, subFilePathArr} = useCommon()
  const itemsRef = ref()
  const isLoading = ref(false)

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
    globalEventBus.on(GlobalEvents.I18N_SAVE_ALL_CHANGES, handleSaveChanged)
  })
  onBeforeUnmount(() => {
    globalEventBus.off(GlobalEvents.I18N_SAVE_ALL_CHANGES, handleSaveChanged)
  })

  const filePathArrFiltered = computed(() => {
    if (i18nSetStore.isFoldersMode) {
      // console.log(i18nMainStore.dirTree)
      return i18nMainStore.dirTree.filter((i) => i.kind === 'directory')
    }
    return i18nMainStore.dirTree
  })

  const reloadBatchList = async () => {
    if (isLoading.value) {
      return
    }
    try {
      isLoading.value = true

      const list: BatchListItem[] = []
      for (let i = 0; i < filePathArrFiltered.value.length; i++) {
        const dirItem: DirTreeItem = filePathArrFiltered.value[i]

        const findNode = (): DirTreeItem | null => {
          let find: DirTreeItem | null = null
          const recursiveFindItem = (
            children: DirTreeItem[] | null,
            dirArr: string[],
            depth = 0
          ) => {
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
            recursiveFindItem(dirItem.children, subFilePathArr.value)
          } catch (e) {
            // console.warn(e)
          }
          return find
        }

        // 文件夹模式需要查找目标文件，否则 dirItem 就是单文件
        const currentItem = i18nSetStore.isFoldersMode ? findNode() : dirItem

        if (!currentItem) {
          list.push({
            dirItem: dirItem,
            rootDir: dirItem,
            json: null,
          })
          continue
        }

        // console.log(currentItem)
        const file = await (currentItem.entry as FileSystemFileHandle).getFile()
        const str = await handleReadSelectedFile(file)
        list.push({
          dirItem: currentItem,
          rootDir: dirItem,
          json: JSON.parse(str as string),
        })
      }
      i18nMainStore.batchList = list
      // console.log('batchList.value', batchList.value)
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }
  watch(subFilePathArr, reloadBatchList, {immediate: true})
  watch(() => i18nMainStore.dirTree, reloadBatchList)
  onMounted(() => {
    reloadBatchList()
  })

  return {isLoading, handleSaveChanged, itemsRef, filePathArrFiltered, subFilePathArr}
}

/**
 * 创建文件夹
 * @param directoryHandle
 * @param folderPath 如：pages/solution
 */
async function createFolder(directoryHandle: FileSystemDirectoryHandle, folderPath: string) {
  if (!folderPath) {
    return directoryHandle
  }
  const folders = folderPath.split('/')

  let currentDirectory = directoryHandle

  // 逐级创建文件夹
  for (const folder of folders) {
    currentDirectory = await currentDirectory.getDirectoryHandle(folder, {create: true})
  }

  console.log(`Folder "${folderPath}" created successfully.`)
  return currentDirectory
}

/**
 * 创建文件
 * @param directoryHandle
 * @param filePath 如：pages/solution/live.json，必须提前创建父文件夹
 * @param content
 */
async function createFile(
  directoryHandle: FileSystemDirectoryHandle,
  filePath: string,
  content: string
) {
  console.log('[createFile] 获取文件的可写入流')
  const fileHandle = await directoryHandle.getFileHandle(filePath, {create: true})
  const writable = await fileHandle.createWritable()

  console.log('[createFile] 将数据写入文件')
  await writable.write(content)

  console.log('[createFile] 关闭文件写入流')
  await writable.close()

  console.log(`[createFile] ${filePath} created and written successfully.`)
  return fileHandle
}

export const useBatchItemV2 = (props) => {
  const {i18nMainStore, i18nSetStore, subFilePathArr} = useCommon()
  const {t: $t} = useI18n()
  const isLoading = ref(false)
  const {listItem} = toRefs(props)

  const handleSaveFile = async (txt: string) => {
    try {
      isLoading.value = true
      if (!listItem.value.dirItem) {
        return
      }
      const fileHandle = listItem.value.dirItem.entry as FileSystemFileHandle
      if (!fileHandle) {
        return
      }
      // @ts-ignore
      const writable = await fileHandle.createWritable()

      // console.log('[translateObj.value]', translateObj.value)

      await writable.write(txt)
      await writable.close()
      const savedPath = listItem.value.dirItem.label + ': ' + fileHandle.name
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

  const isLocalCreated = ref(false)
  const handleCreateFile = async (options: any = {}) => {
    try {
      const {initObj = {}, cb, isReload = true} = options
      isLoading.value = true

      if (!listItem.value.dirItem) {
        return
      }
      const dirHandle = listItem.value.dirItem.entry as FileSystemDirectoryHandle
      if (!dirHandle) {
        return
      }

      const fullPath = subFilePathArr.value.join('/')
      const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'))
      const folderHandle = await createFolder(dirHandle, folderPath)

      const txt = JSON.stringify(initObj, null, 2)
      const fileHandle = await createFile(
        folderHandle,
        fullPath.substring(fullPath.lastIndexOf('/') + 1),
        txt
      )

      window.$message.success('Created ' + fullPath)
      isLocalCreated.value = true

      if (typeof cb === 'function') {
        await cb()
      }
      if (isReload) {
        setTimeout(() => {
          handleReload()
        })
      }
    } catch (error: any) {
      console.error(error)
      window.$message.error(error.message)
    } finally {
      isLoading.value = false
    }
  }

  const handleReload = () => {
    const btn = document.querySelector('.js_reload_btn')
    // @ts-ignore
    btn && btn.click()
  }

  return {
    isLoading,
    handleSaveFile,
    isLocalCreated,
    handleCreateFile,
    handleReload,
    subFilePathArr,
  }
}
