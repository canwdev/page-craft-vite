import {DirTreeItem} from '@/enum/vue-i18n-tool'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useI18n} from 'vue-i18n'

/**
 * 批处理管理器hook
 * @param props
 */
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

/**
 * 批处理单个文件通用方法hook
 * @param props
 */
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

  const handleReload = () => {
    const btn = document.querySelector('.js_reload_btn')
    // @ts-ignore
    btn && btn.click()
  }

  const isLocalCreated = ref(false)
  const handleCreateFile = async (cb?) => {
    try {
      isLoading.value = true

      if (!dirItem.value) {
        return
      }
      const dirHandle = dirItem.value.entry as FileSystemDirectoryHandle
      if (!dirHandle) {
        return
      }

      const fullPath = filePathArr.value.join('/')
      const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'))
      const folderHandle = await createFolder(dirHandle, folderPath)

      const txt = JSON.stringify({}, null, 2)
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
      setTimeout(() => {
        handleReload()
      })
    } catch (error: any) {
      console.error(error)
      window.$message.error(error.message)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    currentItem,
    handleSaveFile,
    isLocalCreated,
    handleCreateFile,
    handleReload,
  }
}
